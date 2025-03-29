import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession  from "connect-mongodb-session";
import { admin } from "../models/user.js";

export const PORT = process.env.PORT || 3000; 
export const COOKIE_PASSWORD=process.env.COOKIE_PASSWORD 
const MongoStore = ConnectMongoDBSession(fastifySession); 
export const sessionStore  = new MongoStore({
    uri: process.env.MONGO_URI,
    collection:"session",
    
})  
sessionStore.on("error",(err)=>{
    console.log("Seesion store error: " + err)
}) 
export const authenticate = async(email, password)=>{
  // creating admin first time
   
  if(email && password){
    if(email === "kashyaprishik@gmail.com" && password === "12345678"){
      return Promise.resolve({email:email, password:password}); 
    }else{
      return null;
}
}  
  
  


   } 
  //uncoment it when created Admin Manually 
  

    
 