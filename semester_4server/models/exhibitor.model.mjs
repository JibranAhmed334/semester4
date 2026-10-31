import mongoose from "mongoose";

const exhibitorSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },
        products: [{
            type: String,
            trim: true
        }],
        services: [{
            type: String,
            trim: true
        }],
        logo: {
            type: String,
            trim: true
        },
        contactEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        contactPhone: {
            type: String,
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

const Exhibitor = mongoose.models.Exhibitor || mongoose.model("Exhibitor", exhibitorSchema);
export default Exhibitor;
