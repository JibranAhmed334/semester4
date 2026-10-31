import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        product_name: {  type: String, required: true,trim:true,},
        price:{type: Number , required: true},
        category:{type:mongoose.Schema.Types.ObjectId, ref:"category", required:true},
        product_image_url:{type: String, required:true},
        product_image_public_id:{type: String}
      
        },

    
    { timestamps: true }
)

const Product = mongoose.model("Product", productSchema)
export default Product