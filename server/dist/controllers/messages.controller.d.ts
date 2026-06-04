import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
export declare function sendMessage(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getConversation(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getMyConversations(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=messages.controller.d.ts.map