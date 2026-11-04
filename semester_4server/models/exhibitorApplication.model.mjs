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
        documents: [{
            name: {
                type: String,
                required: true,
                trim: true
            },
            url: {
                type: String,
                required: true,
                trim: true
            }
        }],
        applicationDate: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

exhibitorApplicationSchema.index({ exhibitor: 1, expo: 1 }, { unique: true });

const ExhibitorApplication = mongoose.models.ExhibitorApplication
    || mongoose.model("ExhibitorApplication", exhibitorApplicationSchema);
export default ExhibitorApplication;
