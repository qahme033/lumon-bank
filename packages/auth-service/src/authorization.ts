// packages/core-banking/src/views/authorization.ts

import { Response } from 'express';
import { Consent, ConsentStatus } from '@banking-sim/core-banking-client';

/**
 * Render a simple authorization result page.
 * @param res Express response object.
 * @param consent The consent object containing the status.
 */
export function renderAuthorizationResult(res: Response, consent: Consent): void {
    let message: string;

    switch (consent.status) {
        case ConsentStatus.AUTHORIZED:
            message = 'Your consent has been approved.';
            break;
        case ConsentStatus.REVOKED:
            message = 'Your consent has been denied.';
            break;
        default:
            message = 'Your consent status is unknown.';
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Consent ${consent.status}</title>
    </head>
    <body>
        <h1>Consent ${consent.status}</h1>
        <p>${message}</p>
    </body>
    </html>
    `;

    res.send(html);
}

/**
 * Render a simple authorization page.
 * @param res Express response object.
 * @param consent The consent object containing consent details.
 */
export function renderAuthorizationPage(res: Response, consent: Consent): void {
    const permissions = consent.permissions.join(', ');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Authorize Access</title>
    </head>
    <body>
        <h1>Authorize Access</h1>
        <p><strong>Customer ID:</strong> ${consent.customerId}</p>
        <p><strong>Bank ID:</strong> ${consent.bankId}</p>
        <p><strong>Accounts:</strong> ${consent.accountIds.join(', ')}</p>
        <p><strong>Permissions:</strong> ${permissions}</p>
        <form method="POST" action="/authorize">
            <input type="hidden" name="consentId" value="${consent.consentId}" />
            <button type="submit" name="action" value="approve">Approve</button>
            <button type="submit" name="action" value="deny">Deny</button>
        </form>
    </body>
    </html>
    `;

    res.send(html);
}
