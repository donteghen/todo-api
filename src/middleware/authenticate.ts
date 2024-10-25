import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Types } from 'mongoose';
import { localLog, logger } from '../services/log';


const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token || (token && !(token?.length > 16)) ) {
            res.status(401).json({ ok: false, message: 'Authentication token is missing' });
            return
        }
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET??'JWT_SECRET'); // Use your JWT secret
        const user = await User.findOne({_id:  new Types.ObjectId(decoded.id as string), approved: true});

        if (!user) {
            res.status(401).json({ ok: false, message: 'Invalid token' });
            return
        }

        // Attach the user information to the request object
        req.user = { id: user.id, role: user.role, team: user.team }; // Include team if necessary
        next();
    } catch (error) {
        if (process.env.NODE_ENV === 'production') {
            logger.error({source:'authenticate.ts', message: 'authentication error!', meta: error})
        }
        localLog.log(JSON.stringify({source:'authenticate.ts', message: 'authentication error!', meta: error}));
        res.status(401).json({ ok: false, message: 'Invalid token' });
    }
};

export{
    authenticate
}