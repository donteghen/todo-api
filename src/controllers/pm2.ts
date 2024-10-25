import { Request, Response } from 'express';
import pm2 from 'pm2';

import git from 'simple-git';
import fs from 'fs';
import path from 'path';
import { localLog } from '../services/log';

const logPath = path.join(process.cwd(), 'dist', 'public', 'logs', 'pm2.log');

// 1. Pull changes from GitHub
export const pullChanges = async (req: Request, res: Response) => {
    try {
        await git().pull('origin', 'main');
        res.send({ ok: true, message: 'Pulled changes from GitHub' });
    } catch (err) {
        localLog.log('err -> pullChanges ', err);
        res.status(500).send({ ok: false, message: 'Failed to pull changes' });
    }
};

// 2. Restart the server using PM2
export const restartServer = (req: Request, res: Response) => {
    pm2.connect((err) => {
        if (err) {
          localLog.log('err -> restartServer -> pm2 connect', err);
            return res.status(500).send({ ok: false, message: 'Failed to connect to PM2' });
        }
        pm2.restart('TODO', (err) => {
            if (err) {
              localLog.log('err -> restartServer -> pm2 restart', err)
              res.status(500).send({ ok: false, message: 'Failed to restart server' });
              return
            }
            pm2.disconnect();
            if (err) {
              localLog.log('err -> restartServer -> pm2 disconnect', err)
              res.status(500).send({ ok: false, message: 'Failed to restart server' });
              return
            }
            res.send({ ok: true, message: 'Server restarted successfully' });
        });
    });
};

// 3. Stop the server
export const stopServer = (req: Request, res: Response) => {
    pm2.connect((err) => {
      if (err) {
          localLog.log('err ->  stopServer', err);
          res.status(500).send({ ok: false, message: 'Failed to connect to PM2' });
          return
      }
      pm2.stop('TODO', (err) => {
          pm2.disconnect();
          if (err) return res.status(500).send({ ok: false, message: 'Failed to stop server' });
          res.send({ ok: true, message: 'Server stopped successfully' });
      });
  });
};

// 4. View logs
export const viewLogs = (req: Request, res: Response) => {
    fs.readFile(path.join(logPath), 'utf8', (err, data) => {        
        if (err) {
            localLog.log('err ->  viewLogs', err);
            res.status(500).send({ ok: false, message: 'Error reading logs' });
            return
        }
          res.send({ ok: true, logs: data });
    });
};

// 5. Revert to a previous commit
export const revertCommit = async (req: Request, res: Response) => {
    const { commit } = req.body;
    try {
        await git().reset(['--hard', commit]);
        res.send({ ok: true, message: `Reverted to commit: ${commit}` });
    } catch (err) {
        localLog.log('err -> revertCommit', err);
        res.status(500).send({ ok: false, message: 'Failed to revert to commit' });
    }
};


