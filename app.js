const mongoose=require("mongoose")
const express=require("express")
const cors=require("cors")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")



let app=express()
app.get("/",(req,res)=>{
    res.send("hello")
})





app.listen("4040",()=>{
    console.log("server started")
})