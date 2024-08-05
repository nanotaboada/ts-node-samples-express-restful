import { Request, Response } from 'express';

/**
 * Interface that defines the operations of a Player controller.
 */
export interface IPlayerController {
    /**
     * Handles the route "GET /players" to retrieve all players.
     * @param {Request} request - The incoming Request.
     * @param {Response} response - The outgoing Response.
     */
    getAllAsync(request: Request, response: Response): Promise<void>;

    /**
     * Handles the route "GET /players/:id" to retrieve a Player by their ID.
     * @param {Request} request - The incoming Request.
     * @param {Response} response - The outgoing Response.
     */
    getByIdAsync(request: Request, response: Response): Promise<void>;

    /**
     * Handles the route "GET /players/:squadNumber" to retrieve a Player by their Squad Number.
     * @param {Request} request - The incoming Request.
     * @param {Response} response - The outgoing Response.
     */
    getBySquadNumberAsync(request: Request, response: Response): Promise<void>;

    /**
     * Handles the route "POST /players" to create a new Player.
     * @param {Request} request - The incoming Request.
     * @param {Response} response - The outgoing Response.
     */
    postAsync(request: Request, response: Response): Promise<void>;

    /**
     * Handles the route "PUT /players/:id" to (entirely) update an existing Player.
     * @param {Request} request - The incoming Request.
     * @param {Response} response - The outgoing Response.
     */
    putAsync(request: Request, response: Response): Promise<void>;

    /**
     * Handles the route "DELETE /players/:id" to delete an existing Player.
     * @param {Request} request - The incoming Request.
     * @param {Response} response - The outgoing Response.
     */
    deleteAsync(request: Request, response: Response): Promise<void>;
}
