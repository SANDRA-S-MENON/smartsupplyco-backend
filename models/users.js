const mongoose=require("mongoose")

const userSchema = mongoose.Schema(
    {
        "username":{ type: String, required: true },
        "address":{ type: String, required: true },
        "phone":{ type: String, required: true },
        "r_number":{ type: String, required: true },
        "password":{ type: String, required: true },
        "confirmpassword":{ type: String, required: true },
    }
)
var userModel=mongoose.model("users",userSchema)
module.exports={userModel}
// var userModel=mongoose.model("users",userSchema)
// module.exports={userModel}