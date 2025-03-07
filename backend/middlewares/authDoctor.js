import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
    try {
        // Extract token from header
        const {dtoken} = req.headers

        if (!dtoken) {
            return res.status(401).json({ success: false, message: "Not authorized, login again" });
        }

        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
 
        req.body.docId = token_decode.id; // Attach user ID to request
        next();
    } catch (error) {
        console.log("JWT Verification Error:", error);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authDoctor;
