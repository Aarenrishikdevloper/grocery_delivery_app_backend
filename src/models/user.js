import mongoose, { Mongoose } from "mongoose"; 
const userSchema = new mongoose.Schema({
    name:{type:String,}, 
    role:{
        type:String, 
        enum:["Customer", "Admin", "DeliveryPartner"],
        default:"Customer",
        required:true
    }, 
    isActivated:{type:Boolean, default:false}  

}) 
//Customer Schema  
const customerSchema = new mongoose.Schema({
    ...userSchema.obj,
    phone:{type:Number, required:true, unique:true},  
    livelocation:{
        latitude:{type:Number}, 
        longitude:{type:Number}
    }, 
    address:{type:String}

}) 
const deliveryPartnerSchema  = new mongoose.Schema({
    ...userSchema.obj, 
    email:{type:String, required:true, unique:true}, 
    password:{type:String, required:true}, 
    phone:{type:Number, required:true, unique:true}, 
    role:{type:String, enum:["DeliveryPartner"], default:"DeliveryPartner"}, 
    livelocation:{
        latitude:{type:Number}, 
        longitude:{type:Number}
    }, 
    address:{type:String},
    branch: {
        type: mongoose.Schema.Types.ObjectId, // Correct usage
        ref: 'Branch',
      },

}) 
const adminSchema = new mongoose.Schema({
    ...userSchema.obj, 
    email:{type:String, required:true, unique:true}, 
    password:{type:String, required:true}, 
    role:{type:String, enum:["Admin"], default:"Admin"}
})
export const Customer = mongoose.model("Customer", customerSchema) 
export const deliveryPartner = mongoose.model(
    "DeliveryPartner",
    deliveryPartnerSchema
);
export const admin = mongoose.model("Admin", adminSchema);