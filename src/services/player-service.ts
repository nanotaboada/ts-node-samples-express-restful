import NodeCache from 'node-cache';
import Player from '../models/player-model';
import { IPlayerService } from '../services/player-service-interface';
import { IPlayerDatabase } from '../database/player-database-interface';

/**
 * Implementation of IPlayerDatabase for handing the service operations of a Player.
 */
export default class PlayerService implements IPlayerService {
    private readonly cache: NodeCache;
    private readonly playerDatabase: IPlayerDatabase;

    constructor(playerDatabase: IPlayerDatabase) {
        this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
        this.playerDatabase = playerDatabase;
    }

    async retrieveAllAsync(): Promise<Player[]> {
        const cacheKey = 'retrieveAll';
        let players = this.cache.get<Player[]>(cacheKey);
        if (!players) {
            players = await this.playerDatabase.selectAllAsync();
            this.cache.set(cacheKey, players);
        }
        return players;
    }

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

    async createAsync(player: Player): Promise<void> {
        await this.playerDatabase.insertAsync(player);
        this.cache.flushAll();
    }

    async updateAsync(player: Player): Promise<void> {
        await this.playerDatabase.updateAsync(player);
        this.cache.flushAll();
    }

    async deleteAsync(id: number): Promise<void> {
        await this.playerDatabase.deleteAsync(id);
        this.cache.flushAll();
    }
}
