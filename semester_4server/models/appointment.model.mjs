import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        attendee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
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
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending"
        }
    },
    { timestamps: true }
);

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
export default Appointment;
