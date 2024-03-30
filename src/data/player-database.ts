import Database from 'better-sqlite3';
import { Player } from '../models/player-model';
import { join } from 'path';

const filename = join(__dirname, 'players-sqlite3.db');

const db = new Database(filename, { fileMustExist: true });
db.pragma('journal_mode = WAL');

const playerDatabase = {
    getAll: (): Player[] => {
        const query = db.prepare(`
            SELECT * 
            FROM players
        `);
        return query.all() as Player[];
    },

    getBySquadNumber: (squadNumber: number): Player | null => {
        const query = db.prepare(`
            SELECT *
            FROM players
            WHERE squadNumber = ?
        `);
        const result = query.get(squadNumber);
        return result ? (result as Player) : null;
    },

    insert: (player: Player): void => {
        const query = db.prepare(`
            INSERT INTO players 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        query.run(
            player.id,
            player.firstName,
            player.middleName,
            player.lastName,
            player.dateOfBirth.toISOString(),
            player.squadNumber,
            player.position,
            player.abbrPosition,
            player.team,
            player.league,
            player.starting11 ? 1 : 0,
        );
    },

    update: (player: Player): void => {
        const query = db.prepare(`
            UPDATE players 
            SET 
                firstName = ?, 
                middleName = ?, 
                lastName = ?, 
                dateOfBirth = ?, 
                squadNumber = ?, 
                position = ?, 
                abbrPosition = ?, 
                team = ?, 
                league = ?, 
                starting11 = ? 
            WHERE id = ?
        `);
        query.run(
            player.firstName,
            player.middleName,
            player.lastName,
            player.dateOfBirth.toISOString(),
            player.squadNumber,
            player.position,
            player.abbrPosition,
            player.team,
            player.league,
            player.starting11 ? 1 : 0,
            player.id,
        );
    },

    delete: (playerId: string): void => {
        const query = db.prepare(`
            DELETE FROM players 
            WHERE id = ?
        `);
        query.run(playerId);
    },
};

export default playerDatabase;