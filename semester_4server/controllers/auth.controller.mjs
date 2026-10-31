import asyncHanlder from "express-async-handler"
import User from "../models/user.model.mjs"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createHash, randomBytes } from "node:crypto"
import nodemailer from "nodemailer"

const register = asyncHanlder(async(request, response) => {
    const { name, email, password, role } = request.body

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !name.trim() || !email.trim() || !password){
        return response.status(400).json({ message: `All fields are required.` })
    }

    const normalizedRole = typeof role === 'string' && role.trim()
        ? role.trim().toLowerCase()
        : 'attendee'

    if (!['attendee', 'exhibitor'].includes(normalizedRole)) {
        return response.status(400).json({ message: 'Invalid role.', success: false })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const userExists = await User.findOne({
        email: normalizedEmail
    })

    if(userExists){
        return response.status(400).json({ 
            message: `Email is already registered.`,
            success: false
        })
    }

    const hashPassword = await bcrypt.hash(password, 12)

    let user
    try {
        user = await User.create({
            name: name.trim(), email: normalizedEmail, password: hashPassword, role: normalizedRole
        })
    } catch(error) {
        if(error.code === 11000){
            return response.status(400).json({
                message: `Email is already registered.`,
                success: false
            })
        }
        throw error
    }
    
    response.status(201).json({ 
        message: `User registered.`, 
        success: true, 
        user 
    })
})

const login = asyncHanlder(async(request, response) => {
    const { email, password } = request.body

    if(!email || !password){
        return response.status(400).json({
            message: `Email and password is required`,
            success: false
        })
    }

    const user = await User.findOne({ email })

    if(!user){
        return response.status(404).json({
            message: `User not registered.`,
            success: false
        })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if(!validPassword){
        return response.status(401).json({
            message: `Invalid Password.`,
            success: false
        })
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" })
    
    response.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
    })

    response.status(200).json({ 
            message: `User login.`, 
            success: true,
            name: user.name, 
            email: user.email,
            role: user.role,
            
            token 
        })    
})

const forgotPassword = asyncHanlder(async (request, response) => {
    const { email } = request.body

    if (!email) {
        return response.status(400).json({ message: "Email is required." })
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com"
    const smtpPort = Number(process.env.SMTP_PORT || 587)
    const smtpUser = process.env.SMTP_USER
    const smtpPassword = process.env.SMTP_PASSWORD
    const fromAddress = process.env.SMTP_FROM || smtpUser

    if (!smtpUser || !smtpPassword || !fromAddress || !Number.isInteger(smtpPort)) {
        return response.status(503).json({
            message: "Password reset email is not configured. Add your Gmail address as SMTP_USER and a Google App Password as SMTP_PASSWORD in server/.env, then restart the server. Gmail SMTP defaults to smtp.gmail.com:587."
        })
    }

    const genericMessage = "If an account matches that email, a password reset code has been sent."
    const user = await User.findOne({ email: email.trim().toLowerCase() })

    if (!user) {
        return response.status(200).json({ message: genericMessage })
    }

    const resetToken = randomBytes(32).toString("hex")
    const hashedToken = createHash("sha256").update(resetToken).digest("hex")
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    user.passwordResetToken = hashedToken
    user.passwordResetExpires = expiresAt
    await user.save()

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPassword }
    })

    try {
        await transporter.sendMail({
            from: fromAddress,
            to: user.email,
            subject: "Your Alnoor password reset code",
            text: `Your Alnoor password reset code is:\n\n${resetToken}\n\nIt expires in 15 minutes. If you did not request this, you can ignore this email.`,
            html: `<p>Your Alnoor password reset code is:</p><p style="font-size:20px;font-weight:bold;letter-spacing:2px">${resetToken}</p><p>It expires in 15 minutes. If you did not request this, you can ignore this email.</p>`
        })
    } catch (error) {
        console.error("Password reset email could not be sent:", error.message)
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()
        return response.status(502).json({ message: "The password reset email could not be sent. Please try again later." })
    }

    return response.status(200).json({ message: genericMessage })
})

const resetPassword = asyncHanlder(async (request, response) => {
    const { email, token, password } = request.body

    if (!email || !token || !password) {
        return response.status(400).json({ message: "Email, reset code, and new password are required." })
    }

    if (password.length < 8) {
        return response.status(400).json({ message: "Password must be at least 8 characters long." })
    }

    const hashedToken = createHash("sha256").update(token).digest("hex")
    const user = await User.findOne({
        email: email.trim().toLowerCase(),
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() }
    }).select("+passwordResetToken +passwordResetExpires")

    if (!user) {
        return response.status(400).json({ message: "The reset code is invalid or has expired. Request a new code and try again." })
    }

    user.password = await bcrypt.hash(password, 12)
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    return response.status(200).json({ message: "Password reset successfully. You can now sign in." })
})

const logout = asyncHanlder(async(request, response) => {
    response.clearCookie("token")
    response.status(200).json({ message: `User logout.` })    
})

const profile = asyncHanlder(async(request, response) => {
    const profile = await User.findById(request.user._id).select("-password -passwordResetToken -passwordResetExpires")
    response.status(200).json({ message: `User profile.`, profile })
})

export {
    register, login, logout, profile, forgotPassword, resetPassword
}