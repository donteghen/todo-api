import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils'; // Adjust the import path as necessary
import { constants } from '../data'; // Adjust the import path according to your project structure
import notify  from '../services/email';
import { IEmailNotification } from "../models/interfaces";


export const signUp = async (req: Request, res: Response) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, password, email });
        await newUser.save();
        
        const emailData: IEmailNotification = {
            source: process.env.MAIL_SENDER, 
            targets: [email, process.env.ADMIN_EMAIL], 
            data: {
                title: 'Welcome to Your Todo World',
                subtitle: 'Sign up successful✅',
                content: `Hi ${username}, \n\nYour account has been created successful and is currently pending approval. 
                \nHang in tight! You will be notified immediately an admin approves your accout`
            }
        }
        await notify(emailData);
        
        res.status(201).json({ ok: true, data: newUser });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const approveUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(userId, { approved: true }, { new: true });

        if (!user) {
            res.status(404).json({ ok: false, message: 'User not found' });
            return
        }

        // Notify user/teamlead about the approval (Implement your notification logic here)

        res.status(200).json({ ok: true, data: user });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            res.status(404).json({ ok: false, message: 'User not found' });
            return
        }

        res.status(204).json({ ok: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const getUserDetails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ ok: false, message: 'User not found' });
            return
        }

        res.status(200).json({ ok: true, data: user });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({});
        res.status(200).json({ ok: true, data: users });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};
