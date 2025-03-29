import {Customer, deliveryPartner} from '../../models/user.js'
export const updateUser =async(req,reply)=>{
    try {
        const{userId} = req.user; 
        const updateData = req.body; 
        let user = await Customer.findById(userId) || await deliveryPartner.findById(userId); 
        if(!user) return reply.status(404).send({message:"User not found"})
             let Usermodel; 
             if(user.role === "Customer"){
                Usermodel = Customer
             }else if(user.role === "DeliveryPartner"){
                Usermodel = deliveryPartner
             }else{
                return  reply.status(500).send({message:"An Error occured", error})
             }
             const updateUser  = await Usermodel.findByIdAndUpdate(
                userId, 
                {$set:updateData}, 
                {new: true, runValidators:true}
             )
             if(!updateUser) return reply.status(500).send({message:"User not found"}); 
             return reply.send({
                message:"User Update Success", 
                user:updateUser,
             })
    } catch (error) {
      console.log(error);
        return  reply.status(500).send({message:"An Error occured", error})
    }
}