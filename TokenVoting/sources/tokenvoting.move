module token_rating::rating_system {
    use sui::object;
    use sui::transfer;
    use sui::tx_context;
    use sui::clock;
    use sui::table;
    use sui::coin;
    use std::type_name;

    // Public error constants - accessible in tests
    const EInvalidRating: u64 = 0;
    const EAlreadyVoted: u64 = 1;
    const ENoTokensOwned: u64 = 2;
    const EUserNotRegistered: u64 = 3;

    // Structs
    public struct RatingSystem has key {
        id: object::UID,
        token_ratings: table::Table<type_name::TypeName, TokenRating>,
        user_votes: table::Table<address, table::Table<type_name::TypeName, bool>>, // user -> token_type -> has_voted
        users: table::Table<address, UserInfo>,
    }

    public struct TokenRating has store {
        total_weighted_score: u64,
        total_weight: u64,
        vote_count: u64,
        average_rating: u64, // multiplied by 100 for precision (e.g., 750 = 7.50)
    }

    public struct UserInfo has store {
        registration_time: u64,
        total_votes_cast: u64,
    }

    public struct UserRegistration has key {
        id: object::UID,
        user: address,
        registration_time: u64,
    }

    // Initialize the rating system
    fun init(ctx: &mut tx_context::TxContext) {
        let rating_system = RatingSystem {
            id: object::new(ctx),
            token_ratings: table::new(ctx),
            user_votes: table::new(ctx),
            users: table::new(ctx),
        };
        transfer::share_object(rating_system);
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut tx_context::TxContext) {
        init(ctx);
    }

    // Register a new user
    public fun register_user(
        rating_system: &mut RatingSystem,
        clock: &clock::Clock,
        ctx: &mut tx_context::TxContext
    ) {
        let user_address = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);
        
        // Create user info
        let user_info = UserInfo {
            registration_time: current_time,
            total_votes_cast: 0,
        };
        
        // Add user to the system
        table::add(&mut rating_system.users, user_address, user_info);
        table::add(&mut rating_system.user_votes, user_address, table::new(ctx));
        
        // Create a registration NFT for the user
        let registration = UserRegistration {
            id: object::new(ctx),
            user: user_address,
            registration_time: current_time,
        };
        
        transfer::transfer(registration, user_address);
    }

    // Vote on a token (users must own the token to vote)
    public fun vote_on_token<T>(
        rating_system: &mut RatingSystem,
        token_coin: &coin::Coin<T>, // User must pass a coin they own to prove ownership
        rating: u8,
        clock: &clock::Clock,
        ctx: &mut tx_context::TxContext
    ) {
        let user_address = tx_context::sender(ctx);
        let token_type = type_name::get<T>();
        let current_time = clock::timestamp_ms(clock);
        
        // Validate rating (1-10)
        assert!(rating >= 1 && rating <= 10, EInvalidRating);
        
        // Check if user owns tokens (balance > 0)
        assert!(coin::value(token_coin) > 0, ENoTokensOwned);
        
        // Check if user is registered
        assert!(table::contains(&rating_system.users, user_address), EUserNotRegistered);
        
        // Check if user has already voted for this token
        let user_votes = table::borrow_mut(&mut rating_system.user_votes, user_address);
        assert!(!table::contains(user_votes, token_type), EAlreadyVoted);
        
        // Calculate user weight based on registration time (older users have more weight)
        let user_info = table::borrow(&rating_system.users, user_address);
        let time_registered = current_time - user_info.registration_time;
        let weight = calculate_weight(time_registered);
        
        // Record the vote
        table::add(user_votes, token_type, true);
        
        // Update or create token rating
        if (table::contains(&rating_system.token_ratings, token_type)) {
            let token_rating = table::borrow_mut(&mut rating_system.token_ratings, token_type);
            update_token_rating(token_rating, rating as u64, weight);
        } else {
            let new_rating = TokenRating {
                total_weighted_score: (rating as u64) * weight,
                total_weight: weight,
                vote_count: 1,
                average_rating: (rating as u64) * 100,
            };
            table::add(&mut rating_system.token_ratings, token_type, new_rating);
        };
        
        // Update user's vote count
        let user_info_mut = table::borrow_mut(&mut rating_system.users, user_address);
        user_info_mut.total_votes_cast = user_info_mut.total_votes_cast + 1;
    }

    // Helper function to calculate weight based on registration time
    fun calculate_weight(time_registered_ms: u64): u64 {
        let days_registered = time_registered_ms / (24 * 60 * 60 * 1000); // Convert ms to days
        
        if (days_registered == 0) {
            1 // Minimum weight for new users
        } else if (days_registered < 30) {
            1 + days_registered / 10 // Small bonus for users under 30 days
        } else if (days_registered < 180) {
            5 + (days_registered - 30) / 15 // Medium bonus for users 30-180 days
        } else {
            15 + (days_registered - 180) / 30 // Higher bonus for users over 180 days
        }
    }

    // Helper function to update token rating
    fun update_token_rating(rating: &mut TokenRating, new_rating: u64, weight: u64) {
        rating.total_weighted_score = rating.total_weighted_score + (new_rating * weight);
        rating.total_weight = rating.total_weight + weight;
        rating.vote_count = rating.vote_count + 1;
        
        // Calculate new average (multiply by 100 for precision)
        rating.average_rating = (rating.total_weighted_score * 100) / rating.total_weight;
    }

    // View functions
    public fun get_token_rating<T>(rating_system: &RatingSystem): (u64, u64, u64) {
        let token_type = type_name::get<T>();
        if (table::contains(&rating_system.token_ratings, token_type)) {
            let rating = table::borrow(&rating_system.token_ratings, token_type);
            (rating.average_rating, rating.vote_count, rating.total_weight)
        } else {
            (0, 0, 0) // No ratings yet
        }
    }

    public fun has_user_voted<T>(rating_system: &RatingSystem, user: address): bool {
        let token_type = type_name::get<T>();
        if (table::contains(&rating_system.user_votes, user)) {
            let user_votes = table::borrow(&rating_system.user_votes, user);
            table::contains(user_votes, token_type)
        } else {
            false
        }
    }

    public fun get_user_info(rating_system: &RatingSystem, user: address): (u64, u64) {
        if (table::contains(&rating_system.users, user)) {
            let user_info = table::borrow(&rating_system.users, user);
            (user_info.registration_time, user_info.total_votes_cast)
        } else {
            (0, 0) // User not registered
        }
    }

    public fun is_user_registered(rating_system: &RatingSystem, user: address): bool {
        table::contains(&rating_system.users, user)
    }

    // Get user's current weight
    public fun get_user_weight(rating_system: &RatingSystem, user: address, clock: &clock::Clock): u64 {
        if (table::contains(&rating_system.users, user)) {
            let user_info = table::borrow(&rating_system.users, user);
            let current_time = clock::timestamp_ms(clock);
            let time_registered = current_time - user_info.registration_time;
            calculate_weight(time_registered)
        } else {
            0 // User not registered
        }
    }
}