import jwt from 'jsonwebtoken'
import User from '../model/UserModel.js'

export const protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    else if(req.cookies && req.cookies.authorization) {
        token = req.cookies.authorization
    }

    if(!token) {
        return res.status(401).json({message: "Not authorized, No token provided"})
    }
    
        try {   
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select("-password");

            if(!req.user) return res.status(401).json({message: "User not found"})

            next();

        } catch(err) {
            return res.status(401).json({ message: "Not authorized, invalid token", error: err});
        }
    
}