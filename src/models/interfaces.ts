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


interface IUser extends Document {
    username: string;
    email:string,
    password: string;
    role: string;
    token: string | null,
    team: Types.ObjectId;
    approved: boolean;
    comparePassword(password: string): Promise<boolean>;
}
interface ITodo extends Document {
    title: string;
    description: string;
    status: string;
    assignedTo: Types.ObjectId;  
    createdBy: Types.ObjectId;   
    team: Types.ObjectId;
}

interface ITeam extends Document {
    name: string;
    description: string;
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

interface ILogData {
    source: string,
    message: string,
    meta?: any | null
}

export {
    IEmailNotification,
    IERROR, ISUCCESS, ILogData,
    IUser,
    ITodo,
    ITeam
}