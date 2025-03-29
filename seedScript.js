import "dotenv/config"; 
import mongoose from "mongoose"; 
import { categories, products } from "./seedData.js";  
import {Product,Category} from "./src/models/index.js";
async function SeedData() { 
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000, // Increase timeout
          });
        //await Product.deleteMany({});
        //await Category.deleteMany({});  
        const categoryDocs = await Category.insertMany(categories);  
        const categorymap = categoryDocs.reduce((map,category)=>{ 
            map[category.name] =category._id; 
            return map; 

        },{}); 
        const productWithcategoryId = products.map((product)=>({
            ...product, 
            category:categorymap[product.category],
        })); 
        await Product.insertMany(productWithcategoryId);
        console.log("Seed Operation successfully ");
    } catch (error) {
        console.error("Error while creating", error);
    }finally{
        mongoose.connection.close();
    }
    
} 
SeedData();