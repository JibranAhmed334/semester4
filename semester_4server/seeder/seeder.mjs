import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDb from "../config/db.config.mjs";
import User from "../models/user.model.mjs";

const seedAdmin = async () => {
    if (mongoose.connection.readyState !== 1) {
        await connectDb();
    }

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
        console.log("Admin account already exists:", existingAdmin.email);
        return existingAdmin;
    }

    const email = (process.env.ADMIN_EMAIL || "admin@eventsphere.com").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
        throw new Error("Set ADMIN_PASSWORD in the server environment before creating the admin account.");
    }

    if (await User.exists({ email })) {
        throw new Error(`Cannot create admin: ${email} is already registered with a non-admin role.`);
    }

    const admin = await User.create({
        name: "Admin",
        email,
        password: await bcrypt.hash(password, 12),
        role: "admin"
    });

    console.log("Admin account created:", admin.email);
    return admin;
};

const seedAllModels = seedAdmin;

const isDirectExecution = process.argv[1]
    && process.argv[1].toLowerCase().endsWith("seeder.mjs");

if (isDirectExecution) {
    try {
        await seedAdmin();
    } catch (error) {
        console.error("Admin seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

export { seedAdmin, seedAllModels };
export default seedAllModels;
