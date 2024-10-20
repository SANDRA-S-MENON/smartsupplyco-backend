const mongoose=require("mongoose")
const express=require("express")
const cors=require("cors")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const { userModel } = require("./models/users")
const adminModel = require("./models/admin")



mongoose.connect("mongodb+srv://sandras02:sandrasmenon@cluster0.3g103sn.mongodb.net/smartsupplycodb?retryWrites=true&w=majority&appName=Cluster0")


let app=express()
app.use(express.json())
app.use(cors())




//api for user sign up

app.post("/signup", async (req, res) => {
    const { username, address, phone, r_number, password, confirmpassword } = req.body;

    // Input validation
    if (!username || !address || !phone || !r_number || !password || !confirmpassword) {
        return res.json({ "status": "error", "message": "All fields are required" });
    }

    if (password !== confirmpassword) {
        return res.json({ "status": "error", "message": "Passwords do not match" });
    }

    // Check if user already exists
    let existingUser = await userModel.findOne({ username: req.body.username });
    if (existingUser) {
        return res.json({ "status": "error", "message": "Username already exists" });
    }

    try {
        // Hash password
        let hashedPassword = bcrypt.hashSync(password, 10);
        req.body.password = hashedPassword;

        // Save the new user
        let user = new userModel(req.body);
        await user.save();

        res.json({ "status": "success", "message": "User registered successfully" });
    } catch (error) {
        res.status(500).json({ "status": "error", "message": "Server error during signup" });
    }
});

// api for  user sign-in
app.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ "status": "error", "message": "Username and password are required" });
    }

    try {
        // Find the user by username
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ "status": "error", "message": "User does not exist" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ "status": "error", "message": "Incorrect password" });
        }

        // Generate JWT token if the password is correct
        jwt.sign(
            { username: user.username, userId: user._id },
            "smartsupplyco-app",
            { expiresIn: "1d" }, // Token expiration time of 1 day
            (error, token) => {
                if (error) {
                    return res.status(500).json({ "status": "error", "message": "Unable to create token" });
                }
                res.json({ "status": "success", "userId": user._id, "token": token });
            }
        );
    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ "status": "error", "message": "Server error during sign-in" });
    }
});



// API for admin sign-up
app.post("/adminsignup", async (req, res) => {
    const { username, password, confirmpassword } = req.body;

    // Input validation
    if (!username || !password || !confirmpassword) {
        return res.status(400).json({ "status": "error", "message": "All fields are required" });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ "status": "error", "message": "Passwords do not match" });
    }

    try {
        // Check if the admin already exists
        const existingAdmin = await adminModel.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ "status": "error", "message": "Admin already exists" });
        }

        // Hash the password
        let hashedPassword = bcrypt.hashSync(password, 10);
        
        // Create new admin
        const newAdmin = new adminModel({
            username,
            password: hashedPassword // Store the hashed password
        });

        // Save the new admin to the database
        await newAdmin.save();

        res.status(201).json({ "status": "success", "message": "Admin registered successfully" });
    } catch (error) {
        console.error("Error during admin sign-up:", error);
        res.status(500).json({ "status": "error", "message": "Server error during sign-up" });
    }
});


app.listen("4040",()=>{
    console.log("server started")
})