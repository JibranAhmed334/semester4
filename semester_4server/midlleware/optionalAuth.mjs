import User from "../models/user.model.mjs";
import jwt from "jsonwebtoken";

const optionalAuth = async (request, response, next) => {
    try {
        const authorization = request.get("authorization");
        const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
        const token = bearerToken || request.cookies?.token;

        if (token) {
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            const user = await User.findById(decode._id);
            if (user) {
                request.user = user;
            }
        }
    } catch {
        // Silently continue for guests
    }
    return next();
};

export default optionalAuth;
