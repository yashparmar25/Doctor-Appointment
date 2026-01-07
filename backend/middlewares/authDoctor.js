import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
    try {
        // Try to get token from different possible locations
        let dtoken = req.headers.authorization || req.headers.dtoken || req.get("dToken");
        
        if (!dtoken) {
            return res.status(401).json({ success: false, message: "Not authorized, login again" });
        }

        // If token is in "Bearer <token>" format, remove "Bearer "
        if (dtoken.startsWith("Bearer ")) {
            dtoken = dtoken.split(" ")[1];
        }

        // Verify token
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

        // Attach decoded user ID to request for multiple access patterns
        req.body.docId = token_decode.id; 
        req.docId = token_decode.id;
        next();
        
    } catch (error) {
        console.error("JWT Verification Error:", error);
        
        // Provide more specific error messages
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Token expired, please login again",
                expiredAt: error.expiredAt
            });
        }
        
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default authDoctor;
