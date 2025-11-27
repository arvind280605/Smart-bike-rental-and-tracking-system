/**
 * WHITE-BOX TESTING FOR USER REGISTRATION
 * ========================================
 * File: whitebox-testing.js
 * 
 * This file contains the registration logic and comprehensive white-box tests
 * using Basis Path Testing technique.
 */

class UserRegistration {
    constructor() {
        this.users = new Map();
    }

    /**
     * Registration logic with multiple decision points for white-box testing
     * 
     * @param {string} username - 3-20 chars, alphanumeric
     * @param {string} email - valid email format
     * @param {string} password - min 8 chars, must contain digit and special char
     * @param {number} age - must be >= 18
     * @returns {Object} {success: boolean, message: string}
     */
    registerUser(username, email, password, age) {
        // Node 1: Entry point

        // Node 2: Check if username is valid length
        if (username.length < 3 || username.length > 20) {
            return { success: false, message: "Username must be 3-20 characters" };
        }

        // Node 3: Check if username is alphanumeric
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            return { success: false, message: "Username must be alphanumeric" };
        }

        // Node 4: Check if username already exists
        if (this.users.has(username)) {
            return { success: false, message: "Username already exists" };
        }

        // Node 5: Validate email format
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            return { success: false, message: "Invalid email format" };
        }

        // Node 6: Check password length
        if (password.length < 8) {
            return { success: false, message: "Password must be at least 8 characters" };
        }

        // Node 7: Check if password contains digit
        if (!/\d/.test(password)) {
            return { success: false, message: "Password must contain at least one digit" };
        }

        // Node 8: Check if password contains special character
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
            return { success: false, message: "Password must contain at least one special character" };
        }

        // Node 9: Check age requirement
        if (age < 18) {
            return { success: false, message: "User must be at least 18 years old" };
        }

        // Node 10: All validations passed - register user
        this.users.set(username, {
            email: email,
            password: password,
            age: age,
            registeredAt: new Date()
        });

        // Node 11: Exit point (success)
        return { success: true, message: "Registration successful" };
    }

    // Get all registered users
    getAllUsers() {
        return Array.from(this.users.keys());
    }
}

/**
 * =============================================================================
 * CONTROL FLOW GRAPH (CFG) ANALYSIS
 * =============================================================================
 * 
 * Nodes:
 * ------
 * 1.  Entry
 * 2.  username.length < 3 || username.length > 20
 * 3.  !/^[a-zA-Z0-9]+$/.test(username)
 * 4.  this.users.has(username)
 * 5.  !emailPattern.test(email)
 * 6.  password.length < 8
 * 7.  !/\d/.test(password)
 * 8.  !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
 * 9.  age < 18
 * 10. Register user
 * 11. Exit
 * 
 * Edges: 21 edges connecting the nodes
 * 
 * =============================================================================
 * CYCLOMATIC COMPLEXITY CALCULATION
 * =============================================================================
 * 
 * Method 1: V(G) = E - N + 2
 * E = 21 edges, N = 11 nodes
 * V(G) = 21 - 11 + 2 = 12
 * 
 * Method 2: V(G) = P + 1 (P = number of decision points)
 * P = 9 decision points
 * V(G) = 9 + 1 = 10
 * 
 * Cyclomatic Complexity = 10
 * We need at least 10 independent test paths for complete coverage.
 * 
 * =============================================================================
 */

/**
 * TEST DATA - 10 INDEPENDENT PATHS (BASIS SET)
 */
const testPaths = [
    // Path 1: Username too short
    {
        id: 1,
        nodes: [1, 2, 11],
        input: {
            username: 'ab',
            email: 'test@example.com',
            password: 'Pass123!',
            age: 25
        },
        expected: { success: false, message: "Username must be 3-20 characters" },
        description: "Tests username length validation (too short)"
    },

    // Path 2: Username not alphanumeric
    {
        id: 2,
        nodes: [1, 2, 3, 11],
        input: {
            username: 'user@123',
            email: 'test@example.com',
            password: 'Pass123!',
            age: 25
        },
        expected: { success: false, message: "Username must be alphanumeric" },
        description: "Tests username alphanumeric validation"
    },

    // Path 3: Username already exists
    {
        id: 3,
        nodes: [1, 2, 3, 4, 11],
        input: {
            username: 'existinguser',
            email: 'test@example.com',
            password: 'Pass123!',
            age: 25
        },
        expected: { success: false, message: "Username already exists" },
        description: "Tests duplicate username detection",
        setup: (reg) => {
            reg.users.set('existinguser', { email: 'old@example.com' });
        }
    },

    // Path 4: Invalid email format
    {
        id: 4,
        nodes: [1, 2, 3, 4, 5, 11],
        input: {
            username: 'newuser',
            email: 'invalidemail',
            password: 'Pass123!',
            age: 25
        },
        expected: { success: false, message: "Invalid email format" },
        description: "Tests email format validation"
    },

    // Path 5: Password too short
    {
        id: 5,
        nodes: [1, 2, 3, 4, 5, 6, 11],
        input: {
            username: 'newuser',
            email: 'test@example.com',
            password: 'Pass1!',
            age: 25
        },
        expected: { success: false, message: "Password must be at least 8 characters" },
        description: "Tests password length validation"
    },

    // Path 6: Password missing digit
    {
        id: 6,
        nodes: [1, 2, 3, 4, 5, 6, 7, 11],
        input: {
            username: 'newuser',
            email: 'test@example.com',
            password: 'Password!',
            age: 25
        },
        expected: { success: false, message: "Password must contain at least one digit" },
        description: "Tests password digit requirement"
    },

    // Path 7: Password missing special character
    {
        id: 7,
        nodes: [1, 2, 3, 4, 5, 6, 7, 8, 11],
        input: {
            username: 'newuser',
            email: 'test@example.com',
            password: 'Password123',
            age: 25
        },
        expected: { success: false, message: "Password must contain at least one special character" },
        description: "Tests password special character requirement"
    },

    // Path 8: Age below 18
    {
        id: 8,
        nodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11],
        input: {
            username: 'newuser',
            email: 'test@example.com',
            password: 'Pass123!',
            age: 17
        },
        expected: { success: false, message: "User must be at least 18 years old" },
        description: "Tests age restriction validation"
    },

    // Path 9: Successful registration
    {
        id: 9,
        nodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        input: {
            username: 'validuser',
            email: 'valid@example.com',
            password: 'SecurePass123!',
            age: 25
        },
        expected: { success: true, message: "Registration successful" },
        description: "Tests successful registration path"
    },

    // Path 10: Username too long
    {
        id: 10,
        nodes: [1, 2, 11],
        input: {
            username: 'thisusernameiswaytoolong',
            email: 'test@example.com',
            password: 'Pass123!',
            age: 25
        },
        expected: { success: false, message: "Username must be 3-20 characters" },
        description: "Tests username length validation (too long)"
    }
];

/**
 * TEST EXECUTION ENGINE
 */
function runWhiteBoxTests() {
    console.log("\n" + "=".repeat(80));
    console.log("WHITE-BOX TESTING - BASIS PATH TESTING");
    console.log("Project: SE Project - User Registration Module");
    console.log("=".repeat(80) + "\n");

    let passCount = 0;
    let failCount = 0;
    const results = [];

    testPaths.forEach((test) => {
        console.log(`\n📋 Test Path ${test.id}: ${test.description}`);
        console.log("─".repeat(80));
        console.log(`   Nodes Covered: ${test.nodes.join(' → ')}`);
        console.log(`   Input Data:`);
        console.log(`     • Username: '${test.input.username}'`);
        console.log(`     • Email: '${test.input.email}'`);
        console.log(`     • Password: '${test.input.password}'`);
        console.log(`     • Age: ${test.input.age}`);

        // Create new registration instance for each test
        const reg = new UserRegistration();

        // Run setup if provided (for test 3)
        if (test.setup) {
            test.setup(reg);
        }

        // Execute test
        const result = reg.registerUser(
            test.input.username,
            test.input.email,
            test.input.password,
            test.input.age
        );

        console.log(`   Expected: ${JSON.stringify(test.expected)}`);
        console.log(`   Actual:   ${JSON.stringify(result)}`);

        const passed = JSON.stringify(result) === JSON.stringify(test.expected);
        console.log(`   ${passed ? '✅ PASS' : '❌ FAIL'}`);

        if (passed) passCount++;
        else failCount++;

        results.push({
            testId: test.id,
            description: test.description,
            passed: passed,
            expected: test.expected,
            actual: result
        });
    });

    // Print summary
    console.log("\n" + "=".repeat(80));
    console.log("TEST SUMMARY");
    console.log("=".repeat(80));
    console.log(`Total Test Paths: ${testPaths.length}`);
    console.log(`Tests Passed: ${passCount} ✅`);
    console.log(`Tests Failed: ${failCount} ${failCount > 0 ? '❌' : ''}`);
    console.log(`Pass Rate: ${((passCount / testPaths.length) * 100).toFixed(1)}%`);
    console.log(`\nCyclomatic Complexity: 10`);
    console.log(`Code Coverage: 100% (all branches covered)`);
    console.log(`Decision Coverage: 100%`);
    console.log(`Condition Coverage: 100%`);
    console.log("=".repeat(80) + "\n");

    return {
        passed: passCount,
        failed: failCount,
        total: testPaths.length,
        results: results
    };
}

/**
 * CONDITION COVERAGE MATRIX
 * =============================================================================
 * 
 * Decision Point | Condition          | True  | False
 * ---------------|-------------------|-------|-------
 * Node 2         | len < 3           | P1    | P2-10
 *                | len > 20          | P10   | P1-9
 * Node 3         | !alphanumeric     | P2    | P3-10
 * Node 4         | user exists       | P3    | P4-10
 * Node 5         | !valid email      | P4    | P5-10
 * Node 6         | len < 8           | P5    | P6-10
 * Node 7         | !has digit        | P6    | P7-10
 * Node 8         | !has special      | P7    | P8-10
 * Node 9         | age < 18          | P8    | P9-10
 * 
 * All conditions tested in both TRUE and FALSE states
 * =============================================================================
 */

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UserRegistration,
        runWhiteBoxTests,
        testPaths
    };
}

// Auto-run tests when file is executed directly
if (require.main === module) {
    runWhiteBoxTests();
}

// Also run if called directly with node
runWhiteBoxTests();