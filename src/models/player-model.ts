/* -----------------------------------------------------------------------------
 * Model
 * -------------------------------------------------------------------------- */

export interface Player {
    id: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    dateOfBirth: string; // ISO 8601
    squadNumber: number;
    position: string;
    abbrPosition: string;
    team: string;
    league: string;
    starting11: string;
}
