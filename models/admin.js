const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    "username": {
        type: String,
        required: true,
        unique: true, // Ensure username is unique
    },
    "password": {
        type: String,
        required: true,
    }
});
const adminModel = mongoose.model("admin",adminSchema)
module.exports = adminModel
// const adminModel = mongoose.model("admin", adminSchema);
// module.exports = adminModel;
