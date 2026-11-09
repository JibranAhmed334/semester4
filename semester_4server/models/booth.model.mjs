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
        hall: {
            type: String,
            default: "Hall A",
            trim: true
        },
        size: {
            type: String,
            default: "10x10 ft",
            trim: true
        },
        price: {
            type: Number,
            default: 1200,
            min: 0
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
        },
        reservedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        showcaseDetails: {
            type: String,
            trim: true,
            maxlength: 1000
        },
        staffInfo: {
            type: String,
            trim: true,
            maxlength: 500
        }
    },
    { timestamps: true }
);

boothSchema.index({ expo: 1, boothNumber: 1 }, { unique: true });

const Booth = mongoose.models.Booth || mongoose.model("Booth", boothSchema);
export default Booth;
