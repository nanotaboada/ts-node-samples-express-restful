import NodeCache from 'node-cache';
import Player from '../models/player-model.js';
import { IPlayerService } from '../services/player-service-interface.js';
import { IPlayerDatabase } from '../database/player-database-interface.js';
import logger from '../utils/logger.js';

/**
 * Implementation of IPlayerService for handling the service operations of a Player.
 * Provides business logic layer with caching support for player data operations.
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
        if (players) {
            logger.debug({ cacheKey, cacheHit: true }, 'Cache hit for retrieveAll');
        } else {
            logger.debug({ cacheKey, cacheHit: false }, 'Cache miss for retrieveAll');
            players = await this.playerDatabase.selectAllAsync();
            this.cache.set(cacheKey, players);
            logger.debug({ cacheKey, count: players.length }, 'Cached retrieveAll result');
        }
        return players;
    }

    async retrieveByIdAsync(id: number): Promise<Player | undefined> {
        const cacheKey = `player_${id}`;
        let player = this.cache.get<Player>(cacheKey);
        if (player) {
            logger.debug({ cacheKey, playerId: id, cacheHit: true }, 'Cache hit for player by ID');
        } else {
            logger.debug({ cacheKey, playerId: id, cacheHit: false }, 'Cache miss for player by ID');
            player = (await this.playerDatabase.selectByIdAsync(id)) ?? undefined;
            if (player) {
                this.cache.set(cacheKey, player);
                logger.debug({ cacheKey, playerId: id }, 'Cached player by ID');
            }
        }
        return player;
    }

    async retrieveBySquadNumberAsync(squadNumber: number): Promise<Player | undefined> {
        const cacheKey = `player_squad_${squadNumber}`;
        let player = this.cache.get<Player>(cacheKey);
        if (player) {
            logger.debug({ cacheKey, squadNumber, cacheHit: true }, 'Cache hit for player by squad number');
        } else {
            logger.debug({ cacheKey, squadNumber, cacheHit: false }, 'Cache miss for player by squad number');
            player = (await this.playerDatabase.selectBySquadNumberAsync(squadNumber)) ?? undefined;
            if (player) {
                this.cache.set(cacheKey, player);
                logger.debug({ cacheKey, squadNumber }, 'Cached player by squad number');
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
