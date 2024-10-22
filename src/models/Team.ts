import mongoose, { Document, Schema, model } from 'mongoose';
import { ITeam } from './interfaces';


const TeamSchema = new Schema<ITeam>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    teamLead: { type: Schema.Types.ObjectId, ref: 'User' },  
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]  
  });
  
  export const Team = model<ITeam>('Team', TeamSchema);
