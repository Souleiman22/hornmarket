import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
export declare function getPublicProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=users.controller.d.ts.map