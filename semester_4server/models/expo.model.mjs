import mongoose from "mongoose";

const expoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: Date,
            required: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true
        },
        theme: {
            type: String,
            trim: true
        },
        boothCount: {
            type: Number,
            min: 0,
            default: 0
        },
        price: {
            type: Number,
            min: 0,
            default: 500
        },
        bannerUrl: {
            type: String,
            trim: true
        },
        bannerPublicId: {
            type: String,
            trim: true
        },
        product_image_url: {
            type: String,
            trim: true
        },
        product_image_public_id: {
            type: String,
            trim: true
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

expoSchema.virtual("product_name").get(function () {
    return this.title;
});

const Expo = mongoose.models.Expo || mongoose.model("Expo", expoSchema);
export default Expo;
