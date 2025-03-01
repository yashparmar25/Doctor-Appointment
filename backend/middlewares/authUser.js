import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        // Extract token from header
        let token = req.headers["token"] || req.get("token");

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, login again" });
        }

        // If token is in "Bearer <token>" format, remove "Bearer "
        if (token.startsWith("Bearer ")) {
            token = token.slice(7).trim();
        }

        // Verify token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        req.body.userId = token_decode.id; // Attach user ID to request
        next();
    } catch (error) {
        console.log("JWT Verification Error:", error);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authUser;
