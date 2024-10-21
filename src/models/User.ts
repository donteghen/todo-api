import { Schema, model} from 'mongoose';
import { constants } from '../data';
import { IUser, IERROR } from './interfaces';
import bcrypt from 'bcrypt'

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: {type: String},
    role: { type: String, 
        enum: [constants.USER_ROLE.ADMIN, constants.USER_ROLE.TEAM_LEAD, constants.USER_ROLE.TEAM_USER], 
        default:  constants.USER_ROLE.TEAM_USER
    },
    team: { type: Schema.Types.ObjectId, ref: 'Team' }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare passwords for login
UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};
  
export const User = model<IUser>('User', UserSchema);