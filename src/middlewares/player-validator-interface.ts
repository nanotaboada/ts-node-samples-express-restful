import { ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Interface for Player validator middleware.
 */
export interface IPlayerValidator {
    /**
     * Array of validation chains for player creation and update operations.
     */
    validationChain: ValidationChain[];

    /**
     * Middleware function that handles validation results.
     * Returns 400 with error details if validation fails, otherwise calls next().
     */
    validate(request: Request, response: Response, next: NextFunction): void;
}
