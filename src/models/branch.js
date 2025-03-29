import mongoose from "mongoose"; 
export const brachSchema = new mongoose.Schema({
    name:{type:String, required:true}, 
    location:{
        latitude:{type:Number}, 
        longitude:{type:Number},
    }, 
    adress:{type:String}, 
    deliveryPartners:[
        {
            type:mongoose.Schema.Types.ObjectId, 
            ref:"DeliveryPartner"
        }
    ]
}) 
const Branch = mongoose.model("Branch", brachSchema); 
export default Branch; 