import type { Request, Response, NextFunction, RequestHandler } from "express";

const TryCatch = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
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
