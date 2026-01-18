// import type { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { User } from "../model/User.js";
// import type { IUser } from "../model/User.js";

// /*
//   AuthenticatedRequest:
//   - Normal Express Request ko extend kar rahe hain
//   - req.user attach karne ke liye
// */
// export interface AuthenticatedRequest extends Request {
//   user?: IUser | null;
// }

// /*
//   isAuth Middleware
//   - JWT token verify karta hai
//   - User ko req.user me attach karta hai
// */
// export const isAuth = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     /*
//       1. Authorization header read karo
//       Expected format:
//       Authorization: Bearer <token>
//     */
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       res.status(401).json({
//         message: "Not authorized, token missing",
//       });
//       return;
//     }

//     /*
//       2. Header se token extract karo
//     */
//     const token = authHeader.split(" ")[1];

//     /*
//       3. Token verify karo
//     */
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     ) as { id: string; email: string };

//     /*
//       4. User DB se fetch karo
//     */
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       res.status(401).json({
//         message: "User not found",
//       });
//       return;
//     }

//     /*
//       5. req.user me attach karo
//       Taaki next controllers use kar saken
//     */
//     req.user = user;

//     /*
//       6. Next middleware / controller
//     */
//     next();
//   } catch (error) {
//     res.status(401).json({
//       message: "Not authorized, token invalid",
//     });
//   }
// };
