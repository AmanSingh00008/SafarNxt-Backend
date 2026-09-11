import mongoose from "mongoose";

const TripsSchema = new Schema({
   title: {
     type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
   },
   price: {
    type: Number,
    required: true,
    trim: true,
   },
    duration: { 
     type: String,
     required: true,
     trim: true,
    index: true,
    unique: true,
   },   

})   