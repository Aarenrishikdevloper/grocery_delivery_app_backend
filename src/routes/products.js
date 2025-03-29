import { getAllCategories } from "../controllers/products/category.js";
import { getProductsByCateGoryId, Searchproducts} from "../controllers/products/product.js";

export const categoryRoutes = async (fastify, options) => {
    fastify.get("/categories", getAllCategories);
};

export const productRoutes = async (fastify, options) => {
    fastify.get("/products/:categoryId", getProductsByCateGoryId);
    fastify.get('/search', Searchproducts);
};
