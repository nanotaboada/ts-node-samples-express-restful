import NodeCache from 'node-cache';
import Player from '../models/player-model';
import { IPlayerService } from '../services/player-service-interface';
import { IPlayerDatabase } from '../data/player-database-interface';

/**
 * Implementation of IPlayerDatabase for handing the service operations of a Player.
 */
export default class PlayerService implements IPlayerService {
    private cache: NodeCache;
    private playerDatabase: IPlayerDatabase;

    constructor(playerDatabase: IPlayerDatabase) {
        this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
        this.playerDatabase = playerDatabase;
    }

    /**
     * Retrieves all players, using cache if available.
     * @returns {Promise<Player[]>} A promise that resolves to an array of Player models.
     */
    async retrieveAllAsync(): Promise<Player[]> {
        const cacheKey = 'retrieveAll';
        let players = this.cache.get<Player[]>(cacheKey);
        if (!players) {
            players = await this.playerDatabase.selectAllAsync();
            this.cache.set(cacheKey, players);
        }
        return players;
    }

    /**
     * Retrieves a Player by its ID, using cache if available.
     * @param {number} id - The ID of the Player to retrieve.
     * @returns {Promise<Player | undefined>} A promise that resolves to the Player model if found, otherwise undefined.
     */
    async retrieveByIdAsync(id: number): Promise<Player | undefined> {
        const cacheKey = `player_${id}`;
        let player = this.cache.get<Player>(cacheKey);
        if (!player) {
            player = (await this.playerDatabase.selectByIdAsync(id)) ?? undefined;
            if (player) {
                this.cache.set(cacheKey, player);
            }
        }
        return player;
    }

    /**
     * Retrieves a Player by its Squad Number, using cache if available.
     * @param {number} squadNumber - The Squad Number of the Player to retrieve.
     * @returns {Promise<Player | undefined>} A promise that resolves to the Player model if found, otherwise undefined.
     */
    async retrieveBySquadNumberAsync(squadNumber: number): Promise<Player | undefined> {
        const cacheKey = `player_squad_${squadNumber}`;
        let player = this.cache.get<Player>(cacheKey);
        if (!player) {
            player = (await this.playerDatabase.selectBySquadNumberAsync(squadNumber)) ?? undefined;
            if (player) {
                this.cache.set(cacheKey, player);
            }
        }
        return player;
    }

    /**
     * Creates a new Player and clears the cache.
     * @param {Player} player - The Player to create.
     * @returns {Promise<void>} A promise that resolves when the creation is complete.
     */
    async createAsync(player: Player): Promise<void> {
        await this.playerDatabase.insertAsync(player);
        this.cache.flushAll();
    }

    /**
     * Updates an existing Player and clears the cache.
     * @param {Player} player - The Player to update.
     * @returns {Promise<void>} A promise that resolves when the update is complete.
     */
    async updateAsync(player: Player): Promise<void> {
        await this.playerDatabase.updateAsync(player);
        this.cache.flushAll();
    }

    /**
     * Deletes an existing Player by its ID and clears the cache.
     * @param {number} id - The ID of the Player to delete.
     * @returns {Promise<void>} A promise that resolves when the deletion is complete.
     */
    async deleteAsync(id: number): Promise<void> {
        await this.playerDatabase.deleteAsync(id);
        this.cache.flushAll();
    }
}
