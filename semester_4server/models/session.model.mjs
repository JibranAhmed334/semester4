import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        expo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expo",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        topic: {
            type: String,
            trim: true
        },
        speaker: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);
export default Session;
