import { Request, Response } from 'express';
import { Todo } from '../models/Todo';
import { Team } from '../models/Team';
import { User } from '../models/User';

import { toMongoId, mongoIdToString } from '../utils';
import { constants } from '../data';

export const createTodo = async (req: Request, res: Response) => {
    try {
        const { title, description, teamId } = req.body;
        const team = await Team.findById(teamId);

        if (!team) {
            res.status(404).json({ ok: false, message: 'Team not found' });
            return
        }

        const newTodo = new Todo({
            title,
            description,
            team: team._id
        });

        await newTodo.save();

        res.status(201).json({ ok: true, data: newTodo });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const updateTodo = async (req: Request, res: Response) => {
    try {
        const { todoId } = req.params;
        const { title, description } = req.body;
        
        const todo = await Todo.findById(todoId);
        if (!todo) {
            res.status(404).json({ ok: false, message: 'Todo not found' });
            return
        }

        // make sure the team lead has the right to update this todo
        const team = await Team.findById(todo?.team.toString());
        if (!team) {
            res.status(404).json({ ok: false, message: 'Team linked to this todo was not found!' });
            return
        }
        if (team.teamLead?.toString() === req?.user?.id) {
            res.status(404).json({ ok: false, message: 'You are not allowed t update todos from other teams.!' });
            return
        }
        todo.title = title ? title : todo.title;
        todo.description = description ? description : todo.description;

        const updatedTodo = await todo.save()
        if (!updatedTodo) {
            res.status(404).json({ ok: false, message: 'Todo update failed' });
            return
        }
  
        res.status(200).json({ ok: true, data: updatedTodo });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const { todoId } = req.params;
        const deletedTodo = await Todo.findByIdAndDelete(todoId);

        if (!deletedTodo) {
            res.status(404).json({ ok: false, message: 'Todo not found' });
            return
        }

        res.status(204).json({ ok: true, message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const assignTodo = async (req: Request, res: Response) => {
    try {
        const { todoId, userId } = req.params;
        const todo = await Todo.findById(todoId);
        const user = await User.findById(userId);
        const team = await Team.findById(todo?.team.toString())
        if (!todo || !user || !team) {
            res.status(404).json({ ok: false, message: 'Todo or User or Team not found' });
            return
        }
        // make sure that the user is team member
        if (!team.members.map(_id => mongoIdToString(_id)).includes(mongoIdToString(user._id))) {
            res.status(404).json({ ok: false, message: 'Provided user doesn\'t not belong to this team!' });
            return
        }
        todo.assignedTo = user._id;
        await todo.save();

        res.status(200).json({ ok: true, data: todo });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const updateTodoStatus = async (req: Request, res: Response) => {
    try {
        const { todoId } = req.params;
        const { status } = req.body;
        const todo = await Todo.findById(todoId);

        if (!todo) {
            res.status(404).json({ ok: false, message: 'Todo not found' });
            return
        }
        if (todo.assignedTo.toString() !== req.user?.id) {
            res.status(404).json({ ok: false, message: 'You are not allowed to update the status of a todo assigned to someone else!' });
            return
        }
        todo.status = status;
        await todo.save();

        res.status(200).json({ ok: true, data: todo });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const getTodoDetails = async (req: Request, res: Response) => {
    try {
        const { todoId } = req.params;
        const todo = await Todo.findById(todoId);

        if (!todo) {
            res.status(404).json({ ok: false, message: 'Todo not found' });
            return
        }
        if (req.user?.role === constants.USER_ROLE.TEAM_USER && todo.assignedTo.toString() !== req.user?.id) {
            res.status(404).json({ ok: false, message: 'You are not allowed to view this todo as it isn\'t assigned to you!' });
            return
        }
        if (req.user?.role === constants.USER_ROLE.TEAM_LEAD) {
            const team = await Team.findById(todo.team.toString());
            if (team?.teamLead.toString() !== req.user?.id)
            res.status(404).json({ ok: false, message: 'You are not allowed to view this todo as it doesn\'t belong to your team!' });
            return
        }
        res.status(200).json({ ok: true, data: todo });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const getAllTeamTodos = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findById(teamId);
        if (req.user?.id !== team?.teamLead.toString()) {
            res.status(404).json({ ok: false, message: 'You are not allowed to view this todo list as you aren\'t the team lead!' });
            return         
        }
        const todos = await Todo.find({team: toMongoId(teamId)});

        if (!todos) {
            res.status(404).json({ ok: false, message: 'Team not found' });
            return
        }

        res.status(200).json({ ok: true, data: todos });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const getAllTodos = async (req: Request, res: Response) => {
    try {
        const todos = await Todo.find();

        if (!todos) {
            res.status(404).json({ ok: false, message: 'Team not found' });
            return
        }

        res.status(200).json({ ok: true, data: todos });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};