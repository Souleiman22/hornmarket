import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
export declare function getFavorites(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function addFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function removeFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function checkFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=favorites.controller.d.ts.map