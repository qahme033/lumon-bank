import { IConsent } from '@banking-sim/core-banking';
import { Response } from 'express';
/**
 * Render a simple authorization result page.
 * @param res Express response object.
 * @param consent The consent object containing the status.
 */
export declare function renderAuthorizationResult(res: Response, consent: IConsent): void;
/**
 * Render a simple authorization page.
 * @param res Express response object.
 * @param consent The consent object containing consent details.
 */
export declare function renderAuthorizationPage(res: Response, consent: IConsent): void;
