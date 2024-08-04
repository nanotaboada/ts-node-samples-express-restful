import Player from '../models/player-model';

/**
 * Interface that defines database operations of a Player.
 */
export interface IPlayerDatabase {
    selectAllAsync(): Promise<Player[]>;
    selectByIdAsync(id: number): Promise<Player | null>;
    selectBySquadNumberAsync(squadNumber: number): Promise<Player | null>;
    insertAsync(player: Partial<Player>): Promise<void>;
    updateAsync(player: Partial<Player>): Promise<void>;
    deleteAsync(id: number): Promise<void>;
}
