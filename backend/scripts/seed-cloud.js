const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Default Questions
const questions = [
    // --- DSA (50 Questions) ---
    { text: "Explain the difference between an array and a linked list.", type: "dsa", topic: "DSA", difficulty: "easy" },
    { text: "How do you reverse a string in O(1) space?", type: "dsa", topic: "DSA", difficulty: "easy" },
    { text: "What is a hash map and how does it work?", type: "dsa", topic: "DSA", difficulty: "easy" },
    { text: "Implement binary search on a sorted array.", type: "dsa", topic: "DSA", difficulty: "easy" },
    { text: "What is the time complexity of QuickSort?", type: "dsa", topic: "DSA", difficulty: "medium" },
    { text: "Explain the concept of a stack vs a queue.", type: "dsa", topic: "DSA", difficulty: "easy" },
    { text: "Detect a cycle in a linked list.", type: "dsa", topic: "DSA", difficulty: "medium" },
    { text: "Merge two sorted linked lists.", type: "dsa", topic: "DSA", difficulty: "medium" },
    { text: "Find the missing number in an array of 1 to n.", type: "dsa", topic: "DSA", difficulty: "easy" },
    { text: "Check if a string is a palindrome.", type: "dsa", topic: "DSA", difficulty: "easy" },
    { text: "Explain Depth First Search (DFS).", type: "dsa", topic: "DSA", difficulty: "medium" },
    { text: "Explain Breadth First Search (BFS).", type: "dsa", topic: "DSA", difficulty: "medium" },
    { text: "Find the maximum subarray sum (Kadane's Algorithm).", type: "dsa", topic: "DSA", difficulty: "medium" },
    { text: "What is a Binary Search Tree (BST)?", type: "dsa", topic: "DSA", difficulty: "easy" },
    { text: "How to validate a BST?", type: "dsa", topic: "DSA", difficulty: "medium" },
    { text: "Find the height of a binary tree.", type: "dsa", topic: "DSA", difficulty: "easy" },
    { text: "Invert a binary tree.", type: "dsa", topic: "DSA", difficulty: "easy" },
    { text: "What is dynamic programming?", type: "dsa", topic: "DSA", difficulty: "hard" },
    { text: "Solve the Climbing Stairs problem.", type: "dsa", topic: "DSA", difficulty: "easy" },
    { text: "Explain the Knapsack problem.", type: "dsa", topic: "DSA", difficulty: "hard" },

    // --- DBMS (20 Questions) ---
    { text: "What is DBMS? Explain its advantages.", type: "dsa", topic: "DBMS", difficulty: "easy" },
    { text: "Difference between DBMS and RDBMS.", type: "dsa", topic: "DBMS", difficulty: "easy" },
    { text: "What is a Primary Key?", type: "dsa", topic: "DBMS", difficulty: "easy" },
    { text: "What is a Foreign Key?", type: "dsa", topic: "DBMS", difficulty: "easy" },
    { text: "Explain Key constraints.", type: "dsa", topic: "DBMS", difficulty: "medium" },
    { text: "What is Normalization? Why is it needed?", type: "dsa", topic: "DBMS", difficulty: "medium" },
    { text: "Explain 1NF, 2NF, 3NF.", type: "dsa", topic: "DBMS", difficulty: "medium" },
    { text: "What is BCNF?", type: "dsa", topic: "DBMS", difficulty: "medium" },
    { text: "What is Denormalization?", type: "dsa", topic: "DBMS", difficulty: "hard" },
    { text: "Explain ACID properties.", type: "dsa", topic: "DBMS", difficulty: "medium" },

    // --- OOPS (20 Questions) ---
    { text: "What is Object-Oriented Programming (OOP)?", type: "dsa", topic: "OOPS", difficulty: "easy" },
    { text: "What are the 4 pillars of OOP?", type: "dsa", topic: "OOPS", difficulty: "easy" },
    { text: "What is a Class?", type: "dsa", topic: "OOPS", difficulty: "easy" },
    { text: "What is an Object?", type: "dsa", topic: "OOPS", difficulty: "easy" },
    { text: "Explain Encapsulation.", type: "dsa", topic: "OOPS", difficulty: "medium" },
    { text: "Explain Abstraction.", type: "dsa", topic: "OOPS", difficulty: "medium" },
    { text: "What is Inheritance? Types?", type: "dsa", topic: "OOPS", difficulty: "medium" },
    { text: "Explain Polymorphism.", type: "dsa", topic: "OOPS", difficulty: "medium" },
    { text: "Compile-time vs Runtime Polymorphism.", type: "dsa", topic: "OOPS", difficulty: "medium" },

    // --- MCQ Questions (Multiple Choice) ---
    {
        text: "Which of the following data structures follows the LIFO (Last In First Out) principle?",
        type: "dsa",
        topic: "DSA",
        difficulty: "easy",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correctAnswer: "Stack"
    },
    {
        text: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
        type: "dsa",
        topic: "DSA",
        difficulty: "medium",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correctAnswer: "O(log n)"
    },
    {
        text: "Which SQL clause is used to filter the results of an aggregate function?",
        type: "dsa",
        topic: "DBMS",
        difficulty: "medium",
        options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
        correctAnswer: "HAVING"
    },
    {
        text: "In Object-Oriented Programming, what is the process of wrapping data and methods into a single unit called?",
        type: "dsa",
        topic: "OOPS",
        difficulty: "easy",
        options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
        correctAnswer: "Encapsulation"
    }
];

// --- 1. SETUP URI HERE ---
// You will replace this string when running the script or set the ENV var
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/interviewprep";

const seedCloudDB = async () => {
    if (MONGO_URI.includes('localhost')) {
        console.warn('\n⚠️ WARNING: You are about to seed to LOCALHOST. If you want to seed the CLOUD, please edit this file or pass the URI.\n');
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Seed Questions
        await Question.deleteMany({}); // Optional: Clear old questions
        console.log('🗑️  Cleared existing questions.');
        await Question.insertMany(questions);
        console.log(`✅ Seeded ${questions.length} questions.`);

        // 2. Create Admin User (Optional)
        // Check if admin exists
        const adminEmail = 'admin@example.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Created Admin user: admin@example.com / admin123');
        } else {
            console.log('ℹ️  Admin user already exists.');
        }

        console.log('\nSUCCESS! Your database is ready. 🚀');
        process.exit();
    } catch (err) {
        console.error('❌ Error seeding DB:', err);
        process.exit(1);
    }
};

seedCloudDB();
