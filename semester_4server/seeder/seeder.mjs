import "dotenv/config"
import bcrypt from "bcryptjs"
import connectDb from "../config/db.config.mjs"
import User from "../models/user.model.mjs"

const seeder = async ()=>{
    try{
        await connectDb()

        console.log("seeder data .....")

        const admin = await User.findOne({ email:process.env.ADMIN_EMAIL })

        if (admin){
            console.log("admin already exists")
            return
        }
        const hashpassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
        await User.create({
            name:"admin",
            email:process.env.ADMIN_EMAIL,
            password:hashpassword,
            role:"admin",
            address:"admin adress",
            workphone_no:"1233231423",
            cellphone_no:"0987654321",
            dob:"2000-01-01"
        })
        console.log("admin credentials seeded successfully")
    }catch(error){
        console.log("seeder error:", error.message)
    }
}

seeder()




// PORT=3000

// MONGO_ALTAS_URI=mongodb+srv://ahmedjibran469_db_user:piUfQuYE037rukYC@cluster0.bace257.mongodb.net/

// SECRET_KEY=example_ecommerce_application_secret_key

// ADMIN_EMAIL=jibran@gmail.com

// ADMIN_PASSWORD=123456


// CLOUDINARY_CLOUD_NAME=uwlozjf9
// CLOUDINARY_API_KEY=396458856872711
// CLOUDINARY_API_SECRET=XCsYJPuA9GxKXcUZFHZlpIKhGEM
    
    
// ahmedjibran469_db_user
// piUfQuYE037rukYC