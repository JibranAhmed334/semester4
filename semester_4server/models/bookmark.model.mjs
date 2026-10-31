import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
    {
        attendee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true
        }
    },
    { timestamps: true }
);

const Bookmark = mongoose.models.Bookmark || mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;
