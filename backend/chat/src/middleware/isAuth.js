import jwt, {} from "jsonwebtoken";
/*
  🔒 Verify JWT only (NO DB)
*/
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, secret);
    if (typeof decoded !== "object" ||
        decoded === null ||
        !("id" in decoded) ||
        !("email" in decoded)) {
        throw new Error("Invalid token payload");
    }
    return decoded;
};
/*
  🔐 Chat Service Auth Middleware
*/
export const isAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const payload = verifyToken(token);
        // ✅ Attach decoded identity ONLY
        req.user = {
            id: payload.id,
            email: payload.email,
        };
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
//# sourceMappingURL=isAuth.js.map