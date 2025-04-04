import mongoose from "mongoose";
import Counter from "./counter.js";
import { type } from "os";

 const orderSchema = new mongoose.Schema({
   orderId:{
    type:String, 
    unique:true
   }, 
   customer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", 
    required: true
   },  
   deliveryPartner:{
    type:mongoose.Schema.Types.ObjectId, 
     ref:"DeliveryPartner", 
   }, 
   branch:{
     type:mongoose.Schema.Types.ObjectId, 
     ref:"Branch",
     required:true
   }, 
   items:[ 
    {
        id:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:"Product",
            required:true
        },
        item:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:"Product",
            required:true
        }, 
        count:{type:Number, required:true}
    }

   ],
   deliverylocation:{
    latitude:{type:Number, required:true}, 
    longitude:{type:Number, required:true},
    address:{type:String},
   }, 
   pickuplocation:{
    latitude:{type:Number, required:true}, 
    longitude:{type:Number, required:true},
    address:{type:String},
   }, 
   deliveryPersonLocation:{
    latitude:{type:Number, required:true}, 
    longitude:{type:Number, required:true},
    address:{type:String},
   }, 
   status:{
     type:String,
     enum:['Pending', 'Confirmed', 'Cancelled', "arriving", 'Completed'],

     default:'Pending',
     
   },
   totalPrice:{type:Number, required:true}, 
   createdAt:{type:Date, default:Date.now}, 
   updatedAt:{type:Date, default:Date.now},
   payment_id:{type:String}

 }) 

 const Order = mongoose.model("Order",orderSchema); 
 export default Order;