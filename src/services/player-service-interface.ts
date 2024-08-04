import Player from '../models/player-model';

/**
 * Interface that defines service operations of a Player.
 */
export interface IPlayerService {
    retrieveAllAsync(): Promise<Player[]>;
    retrieveByIdAsync(id: number): Promise<Player | undefined>;
    retrieveBySquadNumberAsync(squadNumber: number): Promise<Player | undefined>;
    createAsync(player: Player): Promise<void>;
    updateAsync(player: Player): Promise<void>;
    deleteAsync(id: number): Promise<void>;
}
