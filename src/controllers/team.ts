import { Request, Response } from 'express';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { set, Types } from 'mongoose';
import { constants } from '../data';

export const createTeam = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const newTeam = new Team({ name, description });
        await newTeam.save();
        
        res.status(201).json({ ok: true, data: newTeam });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const updateTeam = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;
        const { name, description, members } = req.body;
        const team = await Team.findById(teamId);
        if (!team) {
            res.status(404).json({ ok: false, message: 'Team not found' });
            return
        }
        if (team && members && members.length > 0) {
            let teamMemberSet = team?.members?.length > 0 ? new Set<string>(team?.members?.map(mem => mem.toString())) : new Set<string>();
            members.forEach((member: string) => {
                teamMemberSet.add(member);
            });
            team.members = Array.from(teamMemberSet.values()).map(id => new Types.ObjectId(id))
        }
        const updatedTeam = await team.save();

        if (!updatedTeam) {
            res.status(404).json({ ok: false, message: 'Team update failed!' });
            return
        }

        res.status(200).json({ ok: true, data: updatedTeam });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const deleteTeam = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;
        const deletedTeam = await Team.findByIdAndDelete(teamId);

        if (!deletedTeam) {
            res.status(404).json({ ok: false, message: 'Team not found' });
            return
        }

        res.status(204).json({ ok: true, message: 'Team deleted successfully' });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const getTeamDetails = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findById(teamId);

        if (!team) {
            res.status(404).json({ ok: false, message: 'Team not found' });
            return
        }

        res.status(200).json({ ok: true, data: team });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const getAllTeams = async (req: Request, res: Response) => {
    try {
        const teams = await Team.find({});
        res.status(200).json({ ok: true, data: teams });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};

export const assignTeamLead = async (req: Request, res: Response) => {
    try {
        const { teamId, userId } = req.params;
        
        const team = await Team.findById(teamId);
        const user = await User.findById(userId);

        if (!team || !user) {
            res.status(404).json({ ok: false, message: 'Team or User not found' });
            return
        }

        // Ensure user is a team member
        if (!team.members.map(member => member.toString()).includes(user.id)) {
            res.status(400).json({ ok: false, message: 'User is not a member of this team' });
            return
        }

        team.teamLead = user._id;
        user.role = constants.USER_ROLE.TEAM_LEAD;
        await team.save();
        await user.save();

        res.status(200).json({ ok: true, data: team });
    } catch (error) {
        res.status(400).json({ ok: false, message: JSON.stringify(error) });
    }
};
