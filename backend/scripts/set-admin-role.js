// MongoDB Script to Check and Update User Role to Admin
// Run this in MongoDB Shell or MongoDB Compass

// STEP 1: Find your user by email
// Replace 'your-email@example.com' with your actual email
db.users.findOne({ email: "your-email@example.com" })

// STEP 2: If the role is not 'admin', update it
// Replace 'your-email@example.com' with your actual email
db.users.updateOne(
    { email: "your-email@example.com" },
    { $set: { role: "admin" } }
)

// STEP 3: Verify the update
db.users.findOne({ email: "your-email@example.com" })

// Expected output should show:
// {
//   _id: ObjectId("..."),
//   name: "Your Name",
//   email: "your-email@example.com",
//   password: "...",
//   role: "admin",  // ← This should be "admin"
//   createdAt: ISODate("..."),
//   updatedAt: ISODate("..."),
//   __v: 0
// }

// ALTERNATIVE: Update ALL users to admin (use with caution!)
// db.users.updateMany({}, { $set: { role: "admin" } })

// ALTERNATIVE: Find all admin users
// db.users.find({ role: "admin" })

// ALTERNATIVE: Find all regular users
// db.users.find({ role: "user" })
