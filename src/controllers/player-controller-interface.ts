import { Request, Response } from 'express';

/**
 * Interface that defines the operations of a Player controller.
 */
export interface IPlayerController {
    getAllAsync(request: Request, response: Response): Promise<void>;
    getByIdAsync(request: Request, response: Response): Promise<void>;
    getBySquadNumberAsync(request: Request, response: Response): Promise<void>;
    postAsync(request: Request, response: Response): Promise<void>;
    putAsync(request: Request, response: Response): Promise<void>;
    deleteAsync(request: Request, response: Response): Promise<void>;
}
