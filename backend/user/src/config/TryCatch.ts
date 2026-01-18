import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

/*
  TryCatch ek higher-order function hai.
  Ye ek controller (handler) leta hai aur usko ek wrapper me wrap karta hai.

  Purpose:
  - async controllers me try-catch bar-bar likhne se bachna
  - error aane par centralized error response dena
*/

const TryCatch = (handler: RequestHandler): RequestHandler => {
  // Ye actual middleware function return karta hai
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Original controller ko call kar rahe hain
      // req, res, next same forward kiye jaate hain
      await handler(req, res, next);
    } catch (error: any) {
      /*
        Agar controller ke andar koi error throw hota hai
        (DB error, logic error, etc.)
        to wo yahan catch hoga
      */

      res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  };
};

export default TryCatch;
