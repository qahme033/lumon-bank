import { Consent } from '@banking-sim/core-banking-client';
import { Response } from 'express';
/**
 * Render a simple authorization result page.
 * @param res Express response object.
 * @param consent The consent object containing the status.
 */
export declare function renderAuthorizationResult(res: Response, consent: Consent): void;
/**
 * Render a simple authorization page.
 * @param res Express response object.
 * @param consent The consent object containing consent details.
 */
export declare function renderAuthorizationPage(res: Response, consent: Consent): void;
