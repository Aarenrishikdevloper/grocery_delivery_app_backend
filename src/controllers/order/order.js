import {Customer, deliveryPartner} from "../../models/user.js" 
import Brance from "../../models/branch.js"
import Order from "../../models/order.js"
import crypto from 'crypto'; 
import Razorpay from 'razorpay'; 
import {getDistance} from "geolib"
export const createTransaction =async(req, res)=>{
    const {amount, userId} = req.body; 
    const razor = new Razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET
    });
    const options={
        amount:amount, 
        currency:"INR", 
        receipt:`receipt#${Date.now()}`
    }
    try {
        if(!userId && !amount){
            res.status(400).send({message:"Invalid Request", success:false})  

        }
        const razorpayOrder = await razor.orders.create(options); 
         return res.status(201).send({
            success:true, 
            message:"Order Created Sucessfully",
            amount:razorpayOrder.amount, 
            currency:razorpayOrder.currency, 
            order_id:razorpayOrder.id, 
            key:process.env.RAZORPAY_KEY_ID
        })
    } catch (error) { 
        console.log(error)
        res.status(500).send({message:"An Error occured", sucesss:false})
    }
}
export const createOrder = async(req, reply)=>{
    const {userId} = req.user;
    const {items, branch, totalPrice, razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
    const key_secret = process.env.RAZORPAY_KEY_SECRET; 
    const generated_signatures = crypto.createHmac('sha256',key_secret).update(razorpay_order_id+"|"+razorpay_payment_id).digest('hex')
    console.log(items, branch, totalPrice, );
    console.log(razorpay_signature, razorpay_order_id, razorpay_payment_id);
   if(generated_signatures !== razorpay_signature){
    return reply.status(400).send({message: "Payment verification failed"});
   }
    try {
       
        const customerData = await Customer.findById(userId); 
        const branchData = await Brance.findById(branch); 
        const totlaPrice = totalPrice +16
        if(!customerData){
            return reply.status(400).send({message:"Unauthorized"});
        } 
        const customerCoords = {
            latitude:customerData.livelocation.latitude,
            longitude: customerData.livelocation.longitude,
        };
        const allbrance  =  await Brance.find({}); 
        const nearbyBrance  = allbrance.filter((branch)=>{
            const branceCords  = { 
                latitude:branch.location.latitude,
                longitude: branch.location.longitude,

            }
            const  distance =getDistance(customerCoords,branceCords); 
            return distance <= 2000
        })
        if(nearbyBrance.length === 0){
            return reply.status(400).send({ message: "No nearby branches found within 2km." });
        }
        const nearestbrance  = nearbyBrance.reduce((prev,curr)=>{
            const prevDistance = getDistance(customerCoords,{
                latitude:prev.location.latitude, 
                longitude:prev.location.longitude
            })
            const currDistance = getDistance(customerCoords,{
                latitude:curr.location.latitude, 
                longitude:curr.location.longitude
            })
            return currDistance < prevDistance?curr:prev
        })
       
        

        const orderData = new Order({
            customer:userId, 
            items:items.map((item)=>({
                id:item.id, 
                item:item.item, 
                count:item.count
            })), 
            branch:nearestbrance?._id,

            totalPrice:totlaPrice, 
            deliverylocation:{
                latitude:customerData.livelocation.latitude,  
                longitude:customerData.livelocation.longitude, 
                address:customerData.address
            }, 
            pickuplocation:{
                latitude:nearestbrance.location.latitude, 
                longitude:nearestbrance.location.longitude, 
                address:nearestbrance.adress || "Unknown",
            }, 
            deliveryPersonLocation: {
                latitude: 0, // Default value
                longitude: 0, // Default value
                address: "Unknown" // Default value
            },
            payment_id:razorpay_payment_id, 
            orderId:razorpay_order_id,
            
        }) 
        let saveData = await orderData.save();  
        saveData  = await saveData.populate([
            {path:"customer"}, 
            
            {path:"items.item"}, 
           
        ]); 
        return reply.status(200).send(saveData);
       
    

    } catch (error) {
        console.log(error); 
        return reply.status(500).send({message:"Failed to create order"})
    }
}
export const confirmOder = async(req, reply)=>{
    try {
        const {orderId} = req.params; 
        const{userId} = req.user; 
        const {deliveryPersonLocation} = req.body; 
        console.log(deliveryPersonLocation);
        const deliveryPerson = await deliveryPartner.findById(userId);  
        if(!deliveryPartner){
            return reply.status(400).send({message:"DeliveryPartner not Avalaible"}); 

        } 
        const order =  await Order.findById(orderId); 
        if(!order){
            return reply.status(400).send({message:"Order not Found"}); 

        }
        if(order.status !== "Pending"){
            return reply.status(400).send({message:"Order not Pending"}); 
        } 
        order.status = "Confirmed"; 
        order.deliveryPartner = userId; 
        order.deliveryPersonLocation={
            latitude:deliveryPersonLocation.latitude, 
            longitude:deliveryPersonLocation.longitude, 
            address:deliveryPersonLocation.address || ""
        }
        req.server.io.to(orderId).emit("OrderConfirmed", order); 
        await order.save();
        await deliveryPartner.updateOne(
            {_id:deliveryPartner},
            {
                $set:{
                    livelocation:{
                       
                            latitude: deliveryPersonLocation.latitude,
                            longitude: deliveryPersonLocation.longitude,
                    }
                }
            }
            
        )
        return reply.status(200).send(order);
    } catch (error) {
        console.log(error);
        return reply.status(500).send({message:"Internal Server Error"}); 
    }
} 
export const uodateOrderStatus =async(req, reply) => {
    try {
       
        const{status, deliveryPersonLocation, orderId} = req.body; 
        console.log(orderId);
        const{userId} =req.user; 
        const deliveryPerson = await deliveryPartner.findById(userId);  
        if(!deliveryPerson){
            return reply.status(400).send({message:"Delivery Partner not Avalaible"}); 

        } 
        const order =  await Order.findById(orderId); 
        if(!order){
            return reply.status(400).send({message:"Order not Found"});
        }
        if(["cancelled","delivered"].includes(order.status)){
            return reply.status(400).send({message:"Order is already cancelled or delivered"});
        } 
        
        if(order?.deliveryPartner.toString() !== userId){
            return reply.status(403).send({message:"Unauthorized"});
        }  
        order.status = status; 
        order.deliveryPersonLocation = deliveryPersonLocation; 
        await order.save(); 
        await deliveryPartner.updateOne(
            {_id:deliveryPartner},
            {
                $set:{
                    livelocation:{
                       
                            latitude: deliveryPersonLocation.latitude,
                            longitude: deliveryPersonLocation.longitude,
                    }
                }
            }
            
        )
        req.server.io.to(orderId).emit("liveTrackingUpdates",order); 
        return reply.status(200).send(order);

    } catch (error) {
       console.log(error); 
       return reply.status(500).send({message:"Internal Server Error"});
    }
} 
export const getOrders =async(req,reply) => {
    try {
        const{status, customerId, deliveryPartnerId, branchId} = req.query; 
        console.log(status, deliveryPartnerId, branchId);
        let query ={}
        if(status){
            query.status = status;
        }
        if(customerId){
            query.customer = customerId;
        }
        if(deliveryPartnerId){
            query.deliveryPartner = deliveryPartnerId; 
            query.branch = branchId; 

        }
        const order = await Order.find(query).populate(
            "customer branch items.item deliveryPartner"
        )
        if(status === "pending" && deliveryPartnerId){
            const deliveryPerson = await deliveryPartner.findById(deliveryPartnerId); 
            if(!deliveryPerson?.livelocation){
                return reply.status(400).send({ message: "Delivery partner/location not found." });
            } 
            const partnerCoords = {
                latitude:deliveryPerson.livelocation.latitude, 
                longitude:deliveryPerson.livelocation.longitude,
            } 
            const {filterorders,invalidOrders} = order.reduce((acc, order)=>{
                if(!order.pickuplocation || !order.deliverylocation){
                    acc.invalidOrders++; 
                    return 
                } 
                 const pickupDist = getDistance(partnerCoords,{
                    latitude:order.pickuplocation.latitude, 
                    longitude:order.pickuplocation.longitude, 
                 }) 
                 const deliveryDist = getDistance(partnerCoords,{
                    latitude:order.deliverylocation.latitude, 
                    longitude:order.deliverylocation.longitude
                 })
                 if(pickupDist<=2000 && deliveryDist <=5000){
                    acc.filterorders.push(order);
                 }
                 return acc
            },{filterorders:[], invalidOrders:0})
            console.log(`Filtered ${filterorders.length} valid orders, skipped ${invalidOrders} invalid orders`);
            return reply.status(200).send(filterorders);
        }
        
        console.log(order)
        return reply.status(200).send(order);
    } catch (error) {
        console.log(error);
       return reply.status(500).send({message:"Internal Server Error", error})
    }
} 

export const getOrderById = async(req, reply) => {
    try {
        const {orderId} = req.params; 
        const order = await Order.findById(orderId).populate(
            "customer branch items.item deliveryPartner"
        ) 
        if(!order){
            return reply.status(404).send({message:"Order not Found"})
        }
        return reply.status(200).send(order);
    } catch (error) {
        console.log(error);
        return reply.status(500).send({message:"Internal Server Error", error});
    }
}