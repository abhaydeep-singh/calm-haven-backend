import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Appointment } from "../models/appointment.models.js";

const addBooking = asyncHandler(async(req,res)=>{
    const userId = req.user._id; // getting user id from cookies which came in request
    const {helper, aptStatus, issue, bookDate } = req.body;

    const data = await Appointment.create({
        user:userId, helper, aptStatus, issue, bookDate
    });
    
    if (!data) {
        throw new ApiError(500, "Something went wrong while adding Booking");
      }
      res.status(201).json(new ApiResponse(200, data, "Booking created Successfully"));
});

const deleteBooking = asyncHandler(async(req,res)=>{
    const { bookingID } = req.params; // good practice, match with DELETE standards, passing in body not recomended
    const deletedBooking = await Appointment.findByIdAndDelete(bookingID);
    if (!deletedBooking) {
        throw new ApiError(500, "Something went wrong while deleting booking");
    }
    res.status(201).json(new ApiResponse(200, deletedBooking, "Booking deleted Successfully")); 
});

const setAptStatus = asyncHandler(async(req,res)=>{
    const {bookingID, status} = req.body;
    const updateStatus = await Appointment.findByIdAndUpdate(bookingID,{aptStatus:status});
    if(!updateStatus){
        throw new ApiError(500, "Something went wrong while updating status");
    }
    res.status(201).json(new ApiResponse(200, updateStatus, "Status updated sucessfuly")); 
});

const getAptList = asyncHandler(async(req,res)=>{
    const helperId = req.user._id; // As we are logged in as helper so automaticaly it will have helper's _id in cookies
    const list = await Appointment.find({helper:helperId}).populate('user','fullname');
    if(!list){
        throw new ApiError(500, "Something went wrong while fetching appointment list from DB");
    }
    res.status(201).json(new ApiResponse(200,list,"List fetched succefully"))
});

export {addBooking,deleteBooking,setAptStatus,getAptList};