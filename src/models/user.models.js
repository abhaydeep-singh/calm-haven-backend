import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
    {
        
            username:{
                type:String, // S capital
                required:true,
                lowercase: true,
                trim: true, 
                index: true
            },

            email:{
                type:String,
                required:true,
                lowercase: true,
                trim: true, 
            },
            fullname: {
                type: String,
                required: true,
                trim: true, 
                index: true
            },
            password: {
                type: String,
                required: [true, 'Password is required']
            },
            isHelper:{
                type:Boolean
            }
        
    },

    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// can i use arrow function here? No dont! 
// Do not have their own this context. The this value inside an arrow function is inherited from the surrounding (lexical) scope. In the context of Mongoose schema methods, arrow functions can cause this to be undefined or refer to the global object, which is not the desired behavior.

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            isHelper: this.isHelper
            
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
// "User" is stored in mongoDB in lowercase and plural form ie: users
// "User" or `users` is a collection in database. collection is like table storing objects called documents
