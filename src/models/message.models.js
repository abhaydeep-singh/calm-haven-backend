import mongoose, {Schema} from "mongoose";
import { User } from "./user.models.js";

const messageSchema = new Schema(
    {
        senderId:{ // id of current logged in instance
            type: Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        reciverId:{
            // type: Schema.Types.ObjectId,
            type:String,
            required:true
        },
        message:{
            type:String
        },
        timestamps:{
            type:Date,
            default:Date.now
        }

    },{
    timestamps:true
    }
)

export const Message = mongoose.model('Message',messageSchema)