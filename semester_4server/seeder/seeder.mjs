import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDb from "../config/db.config.mjs";

// Models
import User from "../models/user.model.mjs";
import Category from "../models/category.model.mjs";
import Expo from "../models/expo.model.mjs";
import Exhibitor from "../models/exhibitor.model.mjs";
import Booth from "../models/booth.model.mjs";
import Session from "../models/session.model.mjs";
import Registration from "../models/registration.model.mjs";
import Bookmark from "../models/bookmark.model.mjs";
import Message from "../models/message.model.mjs";
import Notification from "../models/notification.model.mjs";
import Feedback from "../models/feedback.model.mjs";

export const seedAllModels = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDb();
        }

        console.log("------------------------------------------");
        console.log("Seeding normal operational data for all models...");
        console.log("------------------------------------------");

        // 1. Seed Users (Admin, Organizer, Exhibitors, Attendees)
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "123456", 12);
        const defaultPassword = await bcrypt.hash("123456", 12);

        // Admin User
        let adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) {
            adminUser = await User.create({
                name: "Admin Coordinator",
                email: (process.env.ADMIN_EMAIL || "admin@eventsphere.com").toLowerCase().trim(),
                password: hashedPassword,
                role: "admin"
            });
            console.log("✓ Admin User created:", adminUser.email);
        }

        // Organizer User
        let organizerUser = await User.findOne({ email: "organizer@eventsphere.com" });
        if (!organizerUser) {
            organizerUser = await User.create({
                name: "Sophia Vance",
                email: "organizer@eventsphere.com",
                password: defaultPassword,
                role: "organizer"
            });
            console.log("✓ Organizer User created:", organizerUser.email);
        }

        // Exhibitor Users
        let exhibitorUser1 = await User.findOne({ email: "david.miller@aerotech.com" });
        if (!exhibitorUser1) {
            exhibitorUser1 = await User.create({
                name: "David Miller",
                email: "david.miller@aerotech.com",
                password: defaultPassword,
                role: "exhibitor"
            });
            console.log("✓ Exhibitor User 1 created:", exhibitorUser1.email);
        }

        let exhibitorUser2 = await User.findOne({ email: "elena.rostova@biohealth.com" });
        if (!exhibitorUser2) {
            exhibitorUser2 = await User.create({
                name: "Dr. Elena Rostova",
                email: "elena.rostova@biohealth.com",
                password: defaultPassword,
                role: "exhibitor"
            });
            console.log("✓ Exhibitor User 2 created:", exhibitorUser2.email);
        }

        let exhibitorUser3 = await User.findOne({ email: "marcus.thorne@heliogrid.com" });
        if (!exhibitorUser3) {
            exhibitorUser3 = await User.create({
                name: "Marcus Thorne",
                email: "marcus.thorne@heliogrid.com",
                password: defaultPassword,
                role: "exhibitor"
            });
            console.log("✓ Exhibitor User 3 created:", exhibitorUser3.email);
        }

        // Attendee Users
        let attendeeUser1 = await User.findOne({ email: "sarah.jenkins@example.com" });
        if (!attendeeUser1) {
            attendeeUser1 = await User.create({
                name: "Sarah Jenkins",
                email: "sarah.jenkins@example.com",
                password: defaultPassword,
                role: "attendee"
            });
            console.log("✓ Attendee User 1 created:", attendeeUser1.email);
        }

        let attendeeUser2 = await User.findOne({ email: "alex.chen@example.com" });
        if (!attendeeUser2) {
            attendeeUser2 = await User.create({
                name: "Alex Chen",
                email: "alex.chen@example.com",
                password: defaultPassword,
                role: "attendee"
            });
            console.log("✓ Attendee User 2 created:", attendeeUser2.email);
        }

        // 2. Seed Categories
        const standardCategories = [
            "technology & ai",
            "healthcare & medtech",
            "green energy & cleantech",
            "automotive & ev",
            "industrial & robotics",
            "fintech & e-commerce"
        ];

        const categoryDocs = {};
        for (const catName of standardCategories) {
            let cat = await Category.findOne({ category_name: catName });
            if (!cat) {
                cat = await Category.create({ category_name: catName });
                console.log("✓ Category created:", cat.category_name);
            }
            categoryDocs[catName] = cat;
        }

        // 3. Seed Expos
        const expoDefinitions = [
            {
                title: "Global AI & Robotics Summit 2026",
                date: new Date("2026-11-15T09:00:00.000Z"),
                location: "Silicon Valley Convention Center, Hall A",
                description: "The world's leading symposium on artificial intelligence, neural robotics, and autonomous systems with 150+ live demonstrations and industry keynotes.",
                category: categoryDocs["technology & ai"]._id,
                theme: "Next-Generation Intelligence",
                boothCount: 120,
                price: 1200,
                bannerUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60",
                organizer: organizerUser._id
            },
            {
                title: "International MedTech & Healthcare Expo 2026",
                date: new Date("2026-11-28T09:00:00.000Z"),
                location: "Metropolitan Medical Arts Center, Hall B",
                description: "Connecting healthcare innovators, biomedical engineers, and clinical directors to showcase groundbreaking clinical diagnostic tools and patient monitoring suites.",
                category: categoryDocs["healthcare & medtech"]._id,
                theme: "Advancing Global Patient Care",
                boothCount: 95,
                price: 950,
                bannerUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60",
                organizer: organizerUser._id
            },
            {
                title: "CleanEnergy & EV Innovations 2026",
                date: new Date("2026-12-05T09:00:00.000Z"),
                location: "Pacific Trade Pavilion, Hall C",
                description: "Spotlighting commercial battery grids, solar micro-inverters, ultra-fast EV charging hubs, and zero-emission industrial manufacturing pipelines.",
                category: categoryDocs["green energy & cleantech"]._id,
                theme: "Zero-Emission Future",
                boothCount: 80,
                price: 800,
                bannerUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=60",
                organizer: organizerUser._id
            },
            {
                title: "Smart Manufacturing & IoT World 2026",
                date: new Date("2026-12-18T09:00:00.000Z"),
                location: "Exhibition Center South, Hall A",
                description: "Digital twin architectures, automated factory logistics, industrial wireless sensors, and predictive maintenance solutions.",
                category: categoryDocs["industrial & robotics"]._id,
                theme: "Connected Industry 4.0",
                boothCount: 110,
                price: 1100,
                bannerUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
                organizer: organizerUser._id
            }
        ];

        const expoDocs = [];
        for (const item of expoDefinitions) {
            let existingExpo = await Expo.findOne({ title: item.title });
            if (!existingExpo) {
                existingExpo = await Expo.create({
                    ...item,
                    product_image_url: item.bannerUrl
                });
                console.log("✓ Expo created:", existingExpo.title);
            }
            expoDocs.push(existingExpo);
        }

        // 4. Seed Exhibitors
        const exhibitorDefinitions = [
            {
                companyName: "AeroTech Systems",
                products: ["AeroDrone X-400", "Autonomous Flight Controller", "High-Payload Cargo Quad"],
                services: ["Fleet Maintenance", "Airspace Mapping", "B2B Logistics Integration"],
                logo: "bi-airplane",
                contactEmail: "contact@aerotech.com",
                contactPhone: "+1 (555) 234-5678",
                user: exhibitorUser1._id
            },
            {
                companyName: "BioHealth Solutions",
                products: ["PulseWave ICU Monitor", "BioScan Point-of-Care Kit", "CryoStorage Unit"],
                services: ["Hospital Equipment Calibration", "Clinical Staff Onboarding"],
                logo: "bi-heart-pulse",
                contactEmail: "info@biohealth.com",
                contactPhone: "+1 (555) 876-5432",
                user: exhibitorUser2._id
            },
            {
                companyName: "HelioGrid Technologies",
                products: ["HelioCell Bifacial Panels", "GridSync MegaBattery 100kWh", "Smart Power Inverter"],
                services: ["Commercial Microgrid Auditing", "Solar Installation Planning"],
                logo: "bi-sun",
                contactEmail: "sales@heliogrid.com",
                contactPhone: "+1 (555) 345-6789",
                user: exhibitorUser3._id
            }
        ];

        const exhibitorDocs = [];
        for (const exData of exhibitorDefinitions) {
            let exhibitor = await Exhibitor.findOne({ companyName: exData.companyName });
            if (!exhibitor) {
                exhibitor = await Exhibitor.create(exData);
                console.log("✓ Exhibitor profile created:", exhibitor.companyName);
            }
            exhibitorDocs.push(exhibitor);
        }

        // 5. Seed Booths
        const boothCountInDb = await Booth.countDocuments();
        if (boothCountInDb === 0 && expoDocs.length > 0) {
            const boothDefinitions = [
                // Hall A for Expo 0
                { boothNumber: "A-101", location: "Hall A, Main Concourse", status: "occupied", expo: expoDocs[0]._id, exhibitor: exhibitorDocs[0]._id },
                { boothNumber: "A-102", location: "Hall A, Central Corridor", status: "available", expo: expoDocs[0]._id },
                { boothNumber: "A-103", location: "Hall A, East Wing", status: "reserved", expo: expoDocs[0]._id },
                { boothNumber: "A-104", location: "Hall A, South Dock", status: "available", expo: expoDocs[0]._id },
                // Hall B for Expo 1
                { boothNumber: "B-201", location: "Hall B, Diagnostic Row", status: "occupied", expo: expoDocs[1]._id, exhibitor: exhibitorDocs[1]._id },
                { boothNumber: "B-202", location: "Hall B, Innovation Hub", status: "available", expo: expoDocs[1]._id },
                { boothNumber: "B-203", location: "Hall B, VIP Section", status: "reserved", expo: expoDocs[1]._id },
                // Hall C for Expo 2
                { boothNumber: "C-301", location: "Hall C, Green Pavilion", status: "occupied", expo: expoDocs[2]._id, exhibitor: exhibitorDocs[2]._id },
                { boothNumber: "C-302", location: "Hall C, Solar Arena", status: "available", expo: expoDocs[2]._id }
            ];

            await Booth.insertMany(boothDefinitions);
            console.log(`✓ Booths created: ${boothDefinitions.length} booths assigned across halls.`);
        }

        // 6. Seed Sessions
        const sessionCountInDb = await Session.countDocuments();
        if (sessionCountInDb === 0 && expoDocs.length > 0) {
            const sessionDefinitions = [
                {
                    expo: expoDocs[0]._id,
                    title: "Keynote: The Dawn of Commercial General-Purpose Robotics",
                    topic: "Artificial Intelligence & Embodied Hardware",
                    speaker: "Dr. Aris Thorne (Chief Scientist, AeroTech)",
                    location: "Main Auditorium A-1",
                    startTime: new Date("2026-11-15T10:00:00.000Z"),
                    endTime: new Date("2026-11-15T11:30:00.000Z")
                },
                {
                    expo: expoDocs[0]._id,
                    title: "Deep Dive: Vision-Language-Action Models on the Edge",
                    topic: "Machine Learning Infrastructure",
                    speaker: "Elena Rostova",
                    location: "Seminar Room 3",
                    startTime: new Date("2026-11-15T13:00:00.000Z"),
                    endTime: new Date("2026-11-15T14:30:00.000Z")
                },
                {
                    expo: expoDocs[1]._id,
                    title: "Panel: Regulatory Pathways for AI-Powered Diagnostic Implants",
                    topic: "MedTech Compliance & Clinical Trials",
                    speaker: "Dr. Maya Lin & Panelists",
                    location: "Medical Amphitheater B",
                    startTime: new Date("2026-11-28T10:30:00.000Z"),
                    endTime: new Date("2026-11-28T12:00:00.000Z")
                },
                {
                    expo: expoDocs[2]._id,
                    title: "Masterclass: Deploying 500kW Industrial Microgrids",
                    topic: "Clean Energy Engineering",
                    speaker: "Marcus Thorne (HelioGrid Energy)",
                    location: "Green Pavilion Stage 2",
                    startTime: new Date("2026-12-05T11:00:00.000Z"),
                    endTime: new Date("2026-12-05T12:30:00.000Z")
                }
            ];

            await Session.insertMany(sessionDefinitions);
            console.log(`✓ Sessions created: ${sessionDefinitions.length} conference sessions scheduled.`);
        }

        // 7. Seed Registrations
        const regCount = await Registration.countDocuments();
        if (regCount === 0 && expoDocs.length > 0) {
            await Registration.create([
                { attendee: attendeeUser1._id, expo: expoDocs[0]._id, status: "registered" },
                { attendee: attendeeUser1._id, expo: expoDocs[1]._id, status: "registered" },
                { attendee: attendeeUser2._id, expo: expoDocs[0]._id, status: "registered" },
                { attendee: attendeeUser2._id, expo: expoDocs[2]._id, status: "registered" }
            ]);
            console.log("✓ Registrations created for attendee users.");
        }

        // 8. Seed Bookmarks
        const bookmarkCount = await Bookmark.countDocuments();
        const firstSession = await Session.findOne({ expo: expoDocs[0]._id });
        if (bookmarkCount === 0 && firstSession) {
            await Bookmark.create([
                { attendee: attendeeUser1._id, session: firstSession._id }
            ]);
            console.log("✓ Bookmarks created for attendee users.");
        }

        // 9. Seed Messages
        const messageCount = await Message.countDocuments();
        if (messageCount === 0) {
            await Message.create([
                {
                    sender: organizerUser._id,
                    receiver: exhibitorUser1._id,
                    messageText: "Hello David, your electrical hookup permit for Booth A-101 in Hall A has been approved. Freight loading opens at 08:00 AM."
                },
                {
                    sender: exhibitorUser1._id,
                    receiver: organizerUser._id,
                    messageText: "Thank you Sophia! Our logistics crew will arrive on Nov 14th with the display quadcopters."
                },
                {
                    sender: attendeeUser1._id,
                    receiver: exhibitorUser1._id,
                    messageText: "Hi AeroTech team, will you be demonstrating the AeroDrone X-400 cargo flight during the Day 1 afternoon session?"
                }
            ]);
            console.log("✓ Operational messages between roles created.");
        }

        // 10. Seed Notifications
        const notifCount = await Notification.countDocuments();
        if (notifCount === 0) {
            await Notification.create([
                {
                    user: attendeeUser1._id,
                    title: "Registration Confirmed",
                    message: "Your attendee entry badge for Global AI & Robotics Summit 2026 is ready. Badge ID: #EVT-4821",
                    isRead: false
                },
                {
                    user: exhibitorUser1._id,
                    title: "Booth Allocation Verified",
                    message: "Booth #A-101 in Hall A is locked and ready for equipment move-in.",
                    isRead: true
                },
                {
                    user: organizerUser._id,
                    title: "New Floor Plan Inquiry",
                    message: "BioHealth Solutions has completed safety registration for Hall B.",
                    isRead: true
                }
            ]);
            console.log("✓ System notifications created for users.");
        }

        // 11. Seed Feedback
        const feedbackCount = await Feedback.countDocuments();
        if (feedbackCount === 0) {
            await Feedback.create([
                {
                    user: attendeeUser1._id,
                    subject: "Excellent Hall A Layout & Mobile Wayfinding",
                    message: "The interactive floor plan was very easy to follow on mobile. Great selection of keynote speakers!",
                    status: "resolved"
                },
                {
                    user: attendeeUser2._id,
                    subject: "Request for Additional Device Charging Stations",
                    message: "Would appreciate extra device charging stations near Hall C for attendee networking sessions.",
                    status: "in-progress"
                }
            ]);
            console.log("✓ User feedback submissions created.");
        }

        console.log("------------------------------------------");
        console.log("All 11 model files have normal seed data ready!");
        console.log("------------------------------------------");
        return true;
    } catch (error) {
        console.error("Seeder encountered an error:", error.message);
        return false;
    }
};

// If executed directly from command line (e.g. npm run seeder)
const isDirectExecution = process.argv[1] && process.argv[1].endsWith("seeder.mjs");
if (isDirectExecution) {
    (async () => {
        await seedAllModels();
        process.exit(0);
    })();
}

export default seedAllModels;
