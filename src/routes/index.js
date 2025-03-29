import {authRoutes} from "./auth.js"
import {orderRoute} from "./order.js" 
import {categoryRoutes,productRoutes} from "./products.js"
const prefix ="/api"; 
export const registerRoutes = async(fasity)=>{
    fasity.register(authRoutes,{prefix:prefix}); 
    fasity.register(orderRoute,{prefix:prefix});
    fasity.register(productRoutes,{prefix:prefix});
    fasity.register(categoryRoutes,{prefix:prefix});
}