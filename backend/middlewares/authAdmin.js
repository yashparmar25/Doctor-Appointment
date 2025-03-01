import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
    try {
        // Use req.headers['atoken'] or req.get('atoken')
        const atoken = req.headers['atoken'] || req.get('atoken');

        if (!atoken) {
            return res.status(401).json({ success: false, message: 'Not authorized, login again' });
        }

        // Verify token
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

        // Validate token content
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: 'Not authorized, login again' });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

export default authAdmin;
