import mongoose from "mongoose";

const exhibitorApplicationSchema = new mongoose.Schema(
    {
        exhibitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exhibitor",
            required: true
        },
        expo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expo",
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        applicationDate: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const ExhibitorApplication = mongoose.models.ExhibitorApplication
    || mongoose.model("ExhibitorApplication", exhibitorApplicationSchema);
export default ExhibitorApplication;
