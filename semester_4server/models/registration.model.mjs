import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
    {
        attendee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        expo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expo",
            required: true
        },
        registrationDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            required: true,
            enum: ["registered", "cancelled"],
            default: "registered"
        }
    },
    { timestamps: true }
);

const Registration = mongoose.models.Registration || mongoose.model("Registration", registrationSchema);
export default Registration;
