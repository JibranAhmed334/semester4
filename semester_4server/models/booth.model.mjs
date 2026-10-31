import mongoose from "mongoose";

const boothSchema = new mongoose.Schema(
    {
        boothNumber: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            required: true,
            enum: ["available", "reserved", "occupied"],
            default: "available"
        },
        expo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expo",
            required: true
        },
        exhibitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exhibitor"
        }
    },
    { timestamps: true }
);

const Booth = mongoose.models.Booth || mongoose.model("Booth", boothSchema);
export default Booth;
