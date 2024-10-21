import { Request } from 'express';
import { constants} from "../data";
import mongoose, {Mixed, Types} from 'mongoose';

interface IERROR {
    ok: boolean,
    message?: string | object
}

interface ISUCCESS {
    ok: boolean,
    data: any | null
}

interface AuthRequest extends Request {
    user?: any;
}

interface IUser extends Document {
    username: string;
    password: string;
    role: string;
    token: string | null,
    team: Types.ObjectId;
    comparePassword(password: string): Promise<boolean>;
}
interface ITodo extends Document {
    description: string;
    status: string;
    assignedTo: Types.ObjectId;  
    createdBy: Types.ObjectId;   
    team: Types.ObjectId;
}

interface ITeam extends Document {
    teamName: string;
    members: Types.ObjectId[];
    teamLead: Types.ObjectId;
}

interface IEmailNotification {
    source: string, 
    targets: string[], 
    data: {
        title: string,
        subtitle: string,
        content: string
    }
}


export {
    IEmailNotification,
    IERROR, ISUCCESS,
    AuthRequest,
    IUser,
    ITodo,
    ITeam
}