import {
    fetchUser,
    loginCustomer,
    LoginDeliveryPartner,
    refreshToken,
    registerPhonenUmber,
} from "../controllers/auth/auth.js";
import { updateUser } from "../controllers/tracking/tracking.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const authRoutes = async (fastify, options) => {
    fastify.post("/customer/otp",registerPhonenUmber);
    fastify.post("/customer/login", loginCustomer);
    fastify.post("/delivery/login", LoginDeliveryPartner);
    fastify.post("/refresh-token", refreshToken);
    fastify.get("/user", { preHandler: [verifyToken] }, fetchUser);
    fastify.patch("/user", { preHandler: [verifyToken] }, updateUser);
};