import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils'; // Utility function to generate JWT

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).json({ ok: false, message: 'Invalid username or password' });
            return
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ ok: false, message: 'Invalid username or password' });
            return
        }

        // Generate JWT token
        const token = generateToken(user);

        // Store the token in the user model
        user.token = token; 
        await user.save(); 

        res.status(200).json({ ok: true, data: { token } });        
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
};


export const logout = async (req: Request, res: Response) => {
    const { id } = req.user; 

    try {
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ ok: false, message: 'User not found' });
            return
        }

        // Invalidate the user's token
        user.token = null; 
        await user.save(); 

        res.status(200).json({ ok: true, message: 'Successfully logged out' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });        
    }
};
