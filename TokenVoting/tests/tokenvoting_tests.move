#[test_only]
module token_rating::test_rating_system {
    use sui::test_scenario as test;
    use sui::clock;
    use sui::coin;
    use token_rating::rating_system::{
        Self, 
        RatingSystem, 
        UserRegistration
    };

    // Test coin types
    public struct TestCoinA has drop {}
    public struct TestCoinB has drop {}

    const ADMIN: address = @0xAD;
    const USER1: address = @0xA1;

    #[test]
    fun test_user_registration() {
        let mut scenario = test::begin(ADMIN);
        
        // Create and share clock with initial timestamp
        let mut clock = clock::create_for_testing(scenario.ctx());
        clock.set_for_testing(1000000); // Set initial timestamp
        clock::share_for_testing(clock);
        
        // Initialize rating system
        {
            rating_system::init_for_testing(scenario.ctx());
        };
        
        scenario.next_tx(ADMIN);
        let mut rating_system = scenario.take_shared<RatingSystem>();
        let clock = scenario.take_shared<clock::Clock>();
        
        // Test user registration
        scenario.next_tx(USER1);
        {
            rating_system::register_user(&mut rating_system, &clock, scenario.ctx());
        };
        
        // Verify user is registered
        assert!(rating_system::is_user_registered(&rating_system, USER1), 0);
        
        // Check user info
        let (reg_time, votes_cast) = rating_system::get_user_info(&rating_system, USER1);
        assert!(reg_time > 0, 1);
        assert!(votes_cast == 0, 2);
        
        // Check user received registration NFT
        scenario.next_tx(USER1);
        assert!(scenario.has_most_recent_for_sender<UserRegistration>(), 3);
        
        test::return_shared(rating_system);
        test::return_shared(clock);
        scenario.end();
    }

    #[test]
    fun test_single_vote() {
        let mut scenario = test::begin(ADMIN);
        
        // Create and share clock
        let mut clock = clock::create_for_testing(scenario.ctx());
        clock.set_for_testing(1000000); // Set initial timestamp
        clock::share_for_testing(clock);
        
        // Initialize rating system
        {
            rating_system::init_for_testing(scenario.ctx());
        };
        
        scenario.next_tx(ADMIN);
        let mut rating_system = scenario.take_shared<RatingSystem>();
        let mut clock = scenario.take_shared<clock::Clock>();
        
        // Register user first
        scenario.next_tx(USER1);
        {
            rating_system::register_user(&mut rating_system, &clock, scenario.ctx());
        };
        
        // Advance time to give user some weight
        clock.increment_for_testing(86400000); // 1 day in ms
        
        // Create test coin
        scenario.next_tx(USER1);
        let test_coin = coin::mint_for_testing<TestCoinA>(1000, scenario.ctx());
        
        // Vote on the token
        {
            rating_system::vote_on_token<TestCoinA>(
                &mut rating_system,
                &test_coin,
                8, // rating
                &clock,
                scenario.ctx()
            );
        };
        
        // Check vote was recorded
        assert!(rating_system::has_user_voted<TestCoinA>(&rating_system, USER1), 0);
        
        // Check token rating
        let (avg_rating, vote_count, total_weight) = rating_system::get_token_rating<TestCoinA>(&rating_system);
        assert!(avg_rating == 800, 1); // 8.00 * 100
        assert!(vote_count == 1, 2);
        assert!(total_weight > 0, 3);
        
        // Check user's vote count increased
        let (_, votes_cast) = rating_system::get_user_info(&rating_system, USER1);
        assert!(votes_cast == 1, 4);
        
        // Clean up
        coin::burn_for_testing(test_coin);
        test::return_shared(rating_system);
        test::return_shared(clock);
        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = rating_system::EAlreadyVoted)]
    fun test_double_vote_prevention() {
        let mut scenario = test::begin(ADMIN);
        
        // Create and share clock
        let mut clock = clock::create_for_testing(scenario.ctx());
        clock.set_for_testing(1000000);
        clock::share_for_testing(clock);
        
        // Initialize rating system
        {
            rating_system::init_for_testing(scenario.ctx());
        };
        
        scenario.next_tx(ADMIN);
        let mut rating_system = scenario.take_shared<RatingSystem>();
        let clock = scenario.take_shared<clock::Clock>();
        
        // Register user
        scenario.next_tx(USER1);
        {
            rating_system::register_user(&mut rating_system, &clock, scenario.ctx());
        };
        
        // First vote
        scenario.next_tx(USER1);
        let coin1 = coin::mint_for_testing<TestCoinA>(1000, scenario.ctx());
        {
            rating_system::vote_on_token<TestCoinA>(
                &mut rating_system,
                &coin1,
                8,
                &clock,
                scenario.ctx()
            );
        };
        
        // Second vote should fail
        let coin2 = coin::mint_for_testing<TestCoinA>(500, scenario.ctx());
        {
            rating_system::vote_on_token<TestCoinA>(
                &mut rating_system,
                &coin2,
                5,
                &clock,
                scenario.ctx()
            );
        };
        
        coin::burn_for_testing(coin1);
        coin::burn_for_testing(coin2);
        test::return_shared(rating_system);
        test::return_shared(clock);
        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = rating_system::EInvalidRating)]
    fun test_invalid_rating_high() {
        let mut scenario = test::begin(ADMIN);
        
        let mut clock = clock::create_for_testing(scenario.ctx());
        clock.set_for_testing(1000000);
        clock::share_for_testing(clock);
        
        {
            rating_system::init_for_testing(scenario.ctx());
        };
        
        scenario.next_tx(ADMIN);
        let mut rating_system = scenario.take_shared<RatingSystem>();
        let clock = scenario.take_shared<clock::Clock>();
        
        scenario.next_tx(USER1);
        {
            rating_system::register_user(&mut rating_system, &clock, scenario.ctx());
        };
        
        scenario.next_tx(USER1);
        let coin = coin::mint_for_testing<TestCoinA>(1000, scenario.ctx());
        {
            rating_system::vote_on_token<TestCoinA>(
                &mut rating_system,
                &coin,
                11, // Invalid: too high
                &clock,
                scenario.ctx()
            );
        };
        
        coin::burn_for_testing(coin);
        test::return_shared(rating_system);
        test::return_shared(clock);
        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = rating_system::ENoTokensOwned)]
    fun test_zero_balance_rejection() {
        let mut scenario = test::begin(ADMIN);
        
        let mut clock = clock::create_for_testing(scenario.ctx());
        clock.set_for_testing(1000000);
        clock::share_for_testing(clock);
        
        {
            rating_system::init_for_testing(scenario.ctx());
        };
        
        scenario.next_tx(ADMIN);
        let mut rating_system = scenario.take_shared<RatingSystem>();
        let clock = scenario.take_shared<clock::Clock>();
        
        scenario.next_tx(USER1);
        {
            rating_system::register_user(&mut rating_system, &clock, scenario.ctx());
        };
        
        scenario.next_tx(USER1);
        let empty_coin = coin::mint_for_testing<TestCoinA>(0, scenario.ctx()); // Zero balance
        {
            rating_system::vote_on_token<TestCoinA>(
                &mut rating_system,
                &empty_coin,
                8,
                &clock,
                scenario.ctx()
            );
        };
        
        coin::burn_for_testing(empty_coin);
        test::return_shared(rating_system);
        test::return_shared(clock);
        scenario.end();
    }

    #[test]
    fun test_weight_calculation() {
        let mut scenario = test::begin(ADMIN);
        
        let mut clock = clock::create_for_testing(scenario.ctx());
        clock.set_for_testing(1000000);
        clock::share_for_testing(clock);
        
        {
            rating_system::init_for_testing(scenario.ctx());
        };
        
        scenario.next_tx(ADMIN);
        let mut rating_system = scenario.take_shared<RatingSystem>();
        let mut clock = scenario.take_shared<clock::Clock>();
        
        // Register user
        scenario.next_tx(USER1);
        {
            rating_system::register_user(&mut rating_system, &clock, scenario.ctx());
        };
        
        // Test weight at different time intervals
        let initial_weight = rating_system::get_user_weight(&rating_system, USER1, &clock);
        assert!(initial_weight == 1, 0); // New user weight = 1
        
        // After 10 days
        clock.increment_for_testing(864000000); // 10 days in ms
        let weight_10_days = rating_system::get_user_weight(&rating_system, USER1, &clock);
        assert!(weight_10_days == 2, 1); // 1 + 10/10 = 2
        
        test::return_shared(rating_system);
        test::return_shared(clock);
        scenario.end();
    }

    #[test]
    fun test_different_tokens() {
        let mut scenario = test::begin(ADMIN);
        
        let mut clock = clock::create_for_testing(scenario.ctx());
        clock.set_for_testing(1000000);
        clock::share_for_testing(clock);
        
        {
            rating_system::init_for_testing(scenario.ctx());
        };
        
        scenario.next_tx(ADMIN);
        let mut rating_system = scenario.take_shared<RatingSystem>();
        let clock = scenario.take_shared<clock::Clock>();
        
        // Register user
        scenario.next_tx(USER1);
        {
            rating_system::register_user(&mut rating_system, &clock, scenario.ctx());
        };
        
        // Vote on TestCoinA
        scenario.next_tx(USER1);
        let coinA = coin::mint_for_testing<TestCoinA>(1000, scenario.ctx());
        {
            rating_system::vote_on_token<TestCoinA>(
                &mut rating_system,
                &coinA,
                7,
                &clock,
                scenario.ctx()
            );
        };
        
        // Vote on TestCoinB
        let coinB = coin::mint_for_testing<TestCoinB>(500, scenario.ctx());
        {
            rating_system::vote_on_token<TestCoinB>(
                &mut rating_system,
                &coinB,
                9,
                &clock,
                scenario.ctx()
            );
        };
        
        // Check both tokens have separate ratings
        let (ratingA, countA, _) = rating_system::get_token_rating<TestCoinA>(&rating_system);
        let (ratingB, countB, _) = rating_system::get_token_rating<TestCoinB>(&rating_system);
        
        assert!(ratingA == 700, 0); // 7.00
        assert!(countA == 1, 1);
        assert!(ratingB == 900, 2); // 9.00
        assert!(countB == 1, 3);
        
        // User should have voted on both
        assert!(rating_system::has_user_voted<TestCoinA>(&rating_system, USER1), 4);
        assert!(rating_system::has_user_voted<TestCoinB>(&rating_system, USER1), 5);
        
        coin::burn_for_testing(coinA);
        coin::burn_for_testing(coinB);
        test::return_shared(rating_system);
        test::return_shared(clock);
        scenario.end();
    }
}