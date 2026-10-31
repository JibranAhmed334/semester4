import express from "express"
import "dotenv/config"
import cors from "cors"
import morgan from "morgan"
import connectDb from "./config/db.config.mjs"
import authRouter from "./routes/auth.route.mjs"
import cookieParser from "cookie-parser"
import categoryRouter from "./routes/category.route.mjs"
import productRouter from "./routes/product.route.mjs"
import uploads, { uploadDirectory } from "./midlleware/uplods.mjs"
import varifytoken from "./midlleware/varifymiddleware.mjs"
import checkRole from "./midlleware/RoleMiddleware.mjs"
import multer from "multer"

const app = express()
const port = process.env.PORT

 await connectDb()
app.use(express.json())

const configuredClientOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        const isLocalDevelopmentOrigin = process.env.NODE_ENV !== "production"
            && /^http:\/\/(localhost|127\.0\.0\.1|\[::1\]):\d+$/.test(origin || "")

        if (!origin || configuredClientOrigins.includes(origin) || isLocalDevelopmentOrigin) {
            return callback(null, true)
        }

        return callback(new Error("This client origin is not allowed by CORS."))
    },
    credentials: true
}))
app.use(morgan("tiny"))
app.use(cookieParser())

app.use("/uploads", express.static(uploadDirectory))

app.post("/uploads", varifytoken, checkRole("admin"), uploads.single("file"), (request, response) => {
    if (!request.file) {
        return response.status(400).json({ message: "Please select an image file.", success: false })
    }
    const secure_url = `${request.protocol}://${request.get("host")}/uploads/${encodeURIComponent(request.file.filename)}`
    return response.status(200).json({
        message: "File uploaded successfully",
        secure_url
    });
});

app.use("/api/auth", authRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/products", productRouter)

app.use((error, _request, response, _next) => {
    console.error("API request failed:", error.message)

    if (error instanceof multer.MulterError) {
        const message = error.code === "LIMIT_FILE_SIZE"
            ? "Product images must be 8 MB or smaller."
            : error.message
        return response.status(400).json({ message, success: false })
    }

    if (error.message === "Please select an image file.") {
        return response.status(400).json({ message: error.message, success: false })
    }

    return response.status(500).json({ message: "The server could not complete the request.", success: false })
})

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`)
})
