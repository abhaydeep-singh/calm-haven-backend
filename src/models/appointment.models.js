import mongoose,{Schema} from "mongoose";
import { User } from "./user.models.js";

const appointmentSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId, //user
            ref: User,
          },
          helper:{
            type: Schema.Types.ObjectId, //helper / author
            ref: User,
          },
          aptStatus:String,
          issue:String,
          bookDate: Date
    },
    {
        timestamps:true
    }
);

export const Appointment = mongoose.model("Appointment",appointmentSchema);