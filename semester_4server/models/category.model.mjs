import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        category_name: {
            type: String, 
            required: true, 
            trim: true, 
            lowercase: true
        },
      
        },

    
    { timestamps: true }
)

const category = mongoose.model("category", categorySchema)
export default category