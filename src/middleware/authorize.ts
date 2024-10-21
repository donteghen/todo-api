import {  Response, NextFunction } from 'express';
import { AuthRequest } from '../models/interfaces';


export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const { role } = req.user; // Access the role from req.user

        if (!role) {
            res.status(403).json({ ok: false, message: 'Access denied. No role provided.' });
            return
        }

        if (!roles.includes(role)) {
            res.status(403).json({ ok: false, message: 'Access denied. Insufficient permissions.' });
            return
        }

        next();
    };
};
