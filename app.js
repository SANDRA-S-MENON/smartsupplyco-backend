const mongoose=require("mongoose")
const express=require("express")
const cors=require("cors")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const { userModel } = require("./models/users")



mongoose.connect("mongodb+srv://sandras02:sandrasmenon@cluster0.3g103sn.mongodb.net/smartsupplycodb?retryWrites=true&w=majority&appName=Cluster0")


let app=express()
app.use(express.json())
app.use(cors())




//api for user sign up
//********************************************* */
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






app.listen("4040",()=>{
    console.log("server started")
})