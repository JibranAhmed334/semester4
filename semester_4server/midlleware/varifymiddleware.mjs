import User from "../models/user.model.mjs"

import jwt from "jsonwebtoken"

const varifytoken = async(request, response, next) =>{
    try{
        const authorization = request.get("authorization")
        const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
        const token = bearerToken || request.cookies?.token

        if(!token ){
            return response.status(401).json({message: `Access Denied. No token provided.`})
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY)

        const user = await User.findById(decode._id)
        if (!user) {
            return response.status(401).json({ message: "The account for this token no longer exists." })
        }

        request.user = user

        return next()
    }catch(error){
        if (error instanceof jwt.JsonWebTokenError) {
            return response.status(401).json({ message: "The authentication token is invalid or expired. Please sign in again." })
        }

        console.error("Authentication failed:", error.message)
        return response.status(500).json({ message: "The server could not verify your authentication." })
    }
}

export default varifytoken