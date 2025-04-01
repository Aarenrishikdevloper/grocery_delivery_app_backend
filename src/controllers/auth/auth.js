
import {Customer, deliveryPartner} from "../../models/user.js"  
import jwt from 'jsonwebtoken'; 
import { sentotp, verifyOtp } from "../../config/phoneverification.js";

const generateToken =(user)=>{
    const acessToken = jwt.sign(
        {userId:user._id, role:user.role}, 
        process.env.ACESS_TOKEN_SCRET, 
        {expiresIn:'1d'}
    ) 
    const RefreshToken = jwt.sign(
        {userId:user._id, role:user.role}, 
        process.env.REFRESH_TOKEN_SECRET, 
        {expiresIn:'7d'}
    )
    return{acessToken,RefreshToken}
} 

export const registerPhonenUmber =async(req, reply)=>{ 
    try {
        const {phone} = req.body; 
        const phone_no = `91${phone}`
        await sentotp(phone_no); 
       return reply.status(200).send({message:"Code Sent Sucessfully"})
    } catch (error) {
         console.log(error); 
         return reply.status(500).send({message:"An Internal Server Error"})
    }

}
export const loginCustomer =async(req, reply)=>{
    try {
        const {phone, otp} = req.body;  
        const phone_otp = `91${phone}`
        const verify = await verifyOtp(phone_otp, otp)
        let customer = await Customer.findOne({phone})  
        if(verify.valid){
        if(!customer){
            customer = new Customer({
                 phone: phone, 
        
                role:"Customer", 
                isActivated:true
            })
            await customer.save() 
           
        }
        const {acessToken, RefreshToken} = generateToken(customer)
        return reply.send({
            message: "Customer Login Successfull", 
            acessToken, 
            RefreshToken, 
            customer
        });
    }else{ 
        return reply.status(500).send({message:"You are Unauthorize"});
    }
    } catch (error) {
        console.log(error);
      return  reply.status(500).send({message:"An Error occured", error})
    }
}

export const LoginDeliveryPartner =async(req, reply)=>{
    try {
        const {email, password} = req.body; 
        let DeliveryPartner = await deliveryPartner.findOne({email})   
        if(!deliveryPartner){
            return reply.status(404).send({message:"DeliveryPartner not found"})
        }  
        const IsMatch =password === DeliveryPartner.password 
        if(!IsMatch){
            return reply.status(400).send({message:"Invalid Credentials"})
        }
        const {acessToken, RefreshToken} = generateToken(DeliveryPartner)
        return reply.send({
            message: "Customer Login Successfull", 
            acessToken, 
            RefreshToken, 
           DeliveryPartner
        });
        
    } catch (error) {
        console.log(error);
      return  reply.status(500).send({message:"An Error occured", error})
    }
}
export const refreshToken =async(req, reply)=>{
    const {  refreshToken} = req.body 
    if(!refreshToken){
        return reply.status(500).send({message:"Refresh Token Required"})
    }
    try {
        const decoded  = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)  
        let user
        if(decoded.role === "Customer"){
            user = await Customer.findById(decoded.userId)
        }
        else if(decoded.role === "DeliveryPartner"){
            user = await deliveryPartner.findById(decoded.userId);   

        }else{
            return reply.status(403).send({message:"Invalid role"}); 
        }
        if(!user){
            return reply.status(403).send({message:"User not found"}); 
        }
        const {acessToken, RefreshToken:newRefreshToken} = generateToken(user);  
        return reply.send({
            message:"Token Refreshed", 
            acessToken, 
            RefreshToken:newRefreshToken
        })

    } catch (error) {
        console.log(error);
        return  reply.status(500).send({message:"An Error occured", error})
    }
}
export const fetchUser =async(req, reply)=>{
    try {
        const {userId, role } =req.user; 
        let user;
        if(decoded.role === "Customer"){
            user = await Customer.findById(userId)
        }
        else if(decoded.role === "DeliveryPartner"){
            user = await deliveryPartner.findById(userId);   

        }else{
            return reply.status(403).send({message:"Invalid role"}); 
        }
        if(!user){
            return reply.status(403).send({message:"User not found"}); 
        }
        return reply.status(200).send({message:"User fetched successfully", user});
    } catch (error) {
        return  reply.status(500).send({message:"An Error occured", error})
    }
}