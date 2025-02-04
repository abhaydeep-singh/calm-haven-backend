import mongoose, {Schema} from "mongoose";
import { User } from "./user.models.js";
const infoSchema = new Schema(
{
    user: {
        type: Schema.Types.ObjectId, // Reference field
        ref: 'User', // Reference to User model
        // required: true // Ensure that this field is populated
      },
    srqData:Object,
    age:Number,
    gender:Boolean, // true for M false for F
    occupation:String,
    // mental health history
    pastIssues: {
        type: String,
        enum: ['Depression','Anxiety','PTSD'],
    },
    presentIssues:{
        type: String,
        enum: ['Depression','Anxiety','PTSD']
    },
    treatment:{
        type: String,
        enum: ['Therepy','Medications']
    },
    // current mental state
    rateMood:{
        type:Number,
        enum:[1,2,3,4,5]
    },
    moodSwings:Boolean,
    appetiteIssues:Boolean,

    //lifestyles and habits
    sleepHours:Number,
    isPhysicallyActive:Boolean,
    substanceUse:Boolean,



// multiple selections about platform
    platformGoals:{
        type:[String],
        enum:['Reducing Anxiety','Improving Sleep']
    },
    platformContent:{
        type:[String],
        enum:['Articles','Videos','Excercises']
    },
    platformFeatures:{
        type:[String],
        enum:['Therapy ','Community Support','Self-help Tools']
    }

    // risk assesment
},
{
    timestamps: true
}
);

export const Info = mongoose.model('Info',infoSchema);