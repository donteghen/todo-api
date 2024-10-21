import mongoose, { Document, Schema, model } from 'mongoose';
import { ITeam } from './interfaces';


const TeamSchema = new Schema<ITeam>({
    teamName: { type: String, required: true },
    teamLead: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // TeamLead is a user
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]  // Array of team members (user references)
  });
  
  export const Team = model<ITeam>('Team', TeamSchema);
