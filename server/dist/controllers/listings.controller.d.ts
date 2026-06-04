import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
export declare function getListings(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function createListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function deleteListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getMyListings(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=listings.controller.d.ts.map