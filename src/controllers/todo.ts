import { Request, Response } from 'express';
import { Todo } from '../models/Todo';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { Schema, Types } from 'mongoose';

export const createTodo = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;
        const { title, description } = req.body;
        const team = await Team.findById(teamId);

        if (!team) {
            res.status(404).json({ ok: false, message: 'Team not found' });
            return
        }

        const newTodo = new Todo({
            title,
            description,
            team: teamId
        });

        await newTodo.save();
        //team.todos.push(newTodo._id);
        await team.save();

        res.status(201).json({ ok: true, data: newTodo });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const updateTodo = async (req: Request, res: Response) => {
    try {
        const { todoId } = req.params;
        const { title, description } = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(todoId, { title, description }, { new: true });

        if (!updatedTodo) {
            res.status(404).json({ ok: false, message: 'Todo not found' });
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

        if (!todo || !user) {
            res.status(404).json({ ok: false, message: 'Todo or User not found' });
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

        res.status(200).json({ ok: true, data: todo });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const getAllTodos = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;
        const todos = await Todo.find({team: new Types.ObjectId(teamId)});

        if (!todos) {
            res.status(404).json({ ok: false, message: 'Team not found' });
            return
        }

        res.status(200).json({ ok: true, data: todos });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};
