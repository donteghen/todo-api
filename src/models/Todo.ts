import mongoose, { Schema } from 'mongoose';
import { ITodo } from './interfaces';
import { constants } from '../data';


const TodoSchema: Schema = new Schema<ITodo>({
    title: { 
        type: String, 
        required: false 
    },
    description: { 
        type: String, 
        required: false 
    },    
    assignedTo: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    team: { 
        type: Schema.Types.ObjectId, 
        ref: 'Team', 
        required: true 
    },
    status: { 
        type: String, 
        enum: [constants.TODO_STATUS.READY, constants.TODO_STATUS.ON_GOING, constants.TODO_STATUS.DONE],
        default: constants.TODO_STATUS.READY
    }
});

export const Todo = mongoose.model<ITodo>('Todo', TodoSchema);
