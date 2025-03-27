import express from 'express'
import User from '../model/UserModel.js'
import jwt from 'jsonwebtoken'
import "dotenv/config"
import { SignupSchema, LoginSchema } from './zod.js'
import { protect } from '../middleware/authMiddleware.js'
import rateLimit from 'express-rate-limit'

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();


router.post("/signup", async (req, res) => {
    try{
        const bodyValidation = SignupSchema.safeParse(req.body);
        if(!bodyValidation.success) {
            const errors = bodyValidation.error.errors.map(err => ({
                message: err.message
            }))
            return res.status(400).json({
                errors: bodyValidation.error.errors.map(err => ({
                    field: err.path.join("."),
                    message: err.message
                })),
                message: `${errors[0].message}`
            })
        }
        const { email, password, name, role } = req.body;

        const userExist = await User.findOne({ email });
        if(userExist) return res.status(409).json({ message: "User already exist" })

        const user = await User.create({
            name: name,
            email: email,
            password: password,
            role: role
        })

        const { password: _, ...userData } = user.toObject();
        res.status(201).json({ message: "User registered successfully ", user: userData });
    } catch(err) {
       return res.status(500).json({message: err.message})
    }
});


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many login attempts, please try again later"
});


router.post("/login", loginLimiter, async (req, res) => {
    try {
        
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token = req.headers.authorization.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded) return res.status(400).json({ message: "You are already logged in" });
            } catch (err) {
                
            }
        }

        const bodyValidation = LoginSchema.safeParse(req.body);
        if(!bodyValidation.success) return res.status(400).json({
            message: "Incorrect data format"
        })

        const { email, password } = req.body;

        if(!email || !password) return res.status(400).json({message: "All fields are required"})
        
        const userExist = await User.findOne({ email: email });

        if(!userExist) return res.status(404).json({
            message: "wrong credentials"
        })

        const isValidPassword = await userExist.comparePassword(password);
        
        if( !isValidPassword ) return res.status(404).json({message: "Not Authorized, wrong credentials"});

        const token = jwt.sign({
            id: userExist._id
        }, JWT_SECRET, { expiresIn: "7d"})

        res.cookie('authorization', token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({
            message: "Logged in successfully",
            user: userExist.name,
            token: token
        });
    }catch(err) {
        return res.status(500).json({message: err.message}) 
    }
});

router.get("/me", protect, async (req, res) => {
    try{
        const userInfo = await User.findById(req.user.id).select("-password");

        if(!userInfo ) {
            return res.status(404).json({ message: "User not found" })
        } else {
           return res.status(200).json(userInfo);
        }

    }catch(err) { return res.status(500).json(err.message) }
})


router.post("/logout", protect, async (req, res) => {
    try {
        res.clearCookie("authorization", { 
            httpOnly: true, 
            sameSite: "strict",
            secure: true 
        });

        req.user = null;

       return res.status(200).send("You are logged out successfully")
    }catch(err) { res.status(500).json({message: err.message})}
})

export default router