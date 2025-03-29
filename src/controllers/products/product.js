import Product from "../../models/product.js"
export const getProductsByCateGoryId = async(req, reply)=>{
   try {
    const{categoryId} = req.params;  
    const products = await Product.find({category:categoryId}).select("-category").exec(); 
    return  reply.send(products)
   } catch (error) {
    return  reply.status(500).send({message:"An Error occured", error})
   }
  
} 
export const Searchproducts =async(req, reply)=>{
   const searchterm = req.query.searchterm;
   const escapedTerm = searchterm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   console.log(searchterm);
   try {
      const products  = await Product.find({
         $or:[
            {name:{$regex:`^${escapedTerm}`, $options:`i`}},
            {name:{$regex:escapedTerm, $options:"i"}} 
         ]
      })
      return reply.status(200).send(products)
   } catch (error) {
      console.log(error) 
      return reply.status(500).send({message:"Internal server Error"})
   }
} 