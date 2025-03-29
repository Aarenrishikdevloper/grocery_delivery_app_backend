import {
    confirmOder, 
    createOrder, 
    createTransaction, 
    getOrderById, 
    getOrders, 
    uodateOrderStatus
} from "../controllers/order/order.js" 

import {verifyToken} from "../middleware/verifyToken.js" 

export const orderRoute = async(fastify, options)=>{
     fastify.post("/order",{ preHandler: [verifyToken] }, createOrder) 
    fastify.get("/order", getOrders) 
    fastify.patch("/order/status", { preHandler: [verifyToken] }, uodateOrderStatus) 
    fastify.post("/order/:orderId/confirm",{ preHandler: [verifyToken] }, confirmOder); 
    fastify.get("/order/:orderId",{ preHandler: [verifyToken] }, getOrderById)
    fastify.post("/transactions", createTransaction);
}