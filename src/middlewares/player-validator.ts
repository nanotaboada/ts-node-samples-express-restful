import { body, ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { IPlayerValidator } from './player-validator-interface.js';

/**
 * Implementation of IPlayerValidator for handling Player validation.
 */
export default class PlayerValidator implements IPlayerValidator {
    /**
     * Array of validation chains for player creation and update operations.
     * Validates required fields: firstName, lastName, squadNumber, position
     * Validates optional fields: id, middleName, dateOfBirth, abbrPosition, team, league, starting11
     */
    public validationChain: ValidationChain[] = [
        body('id').optional({ checkFalsy: false }).isInt({ min: 1 }).withMessage('ID must be a positive integer'),
        body('firstName')
            .trim()
            .notEmpty()
            .withMessage('First name is required')
            .isString()
            .withMessage('First name must be a string'),
        body('lastName')
            .trim()
            .notEmpty()
            .withMessage('Last name is required')
            .isString()
            .withMessage('Last name must be a string'),
        body('squadNumber').isInt({ min: 1, max: 99 }).withMessage('Squad number must be an integer between 1 and 99'),
        body('position')
            .trim()
            .notEmpty()
            .withMessage('Position is required')
            .isString()
            .withMessage('Position must be a string'),
        body('middleName').optional({ checkFalsy: true }).isString().withMessage('Middle name must be a string'),
        body('dateOfBirth')
            .optional({ checkFalsy: true })
            .isISO8601()
            .withMessage('Date of birth must be a valid ISO 8601 date'),
        body('abbrPosition').optional({ checkFalsy: true }).isString().withMessage('Abbreviated position must be a string'),
        body('team').optional({ checkFalsy: true }).isString().withMessage('Team must be a string'),
        body('league').optional({ checkFalsy: true }).isString().withMessage('League must be a string'),
        body('starting11').optional({ checkFalsy: false }).isBoolean().withMessage('Starting 11 must be a boolean'),
    ];

    /**
     * Middleware function that handles validation results.
     * Returns 400 with error details if validation fails, otherwise calls next().
     *
     * @param request - Express Request object
     * @param response - Express Response object
     * @param next - Express NextFunction
     */
    validate(request: Request, response: Response, next: NextFunction): void {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    }
}
