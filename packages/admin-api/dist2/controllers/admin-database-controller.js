"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDatabaseController = void 0;
const core_banking_1 = require("@banking-sim/core-banking");
class AdminDatabaseController {
    constructor(bankId) {
        this.bankId = bankId;
        this.databaseService = new core_banking_1.DatabaseService(bankId);
    }
    async getDatabaseSnapshot(req, res) {
        try {
            const includeAllBanks = req.query.includeAllBanks === 'true';
            const snapshot = await this.databaseService.getDatabaseSnapshot(includeAllBanks);
            res.status(200).json({
                success: true,
                data: snapshot
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unknown error occurred';
            console.error(`Error in getDatabaseSnapshot: ${errorMessage}`);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: errorMessage
            });
        }
    }
    async getDatabaseStats(req, res) {
        try {
            const stats = await this.databaseService.getStats();
            res.status(200).json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unknown error occurred';
            console.error(`Error in getDatabaseStats: ${errorMessage}`);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: errorMessage
            });
        }
    }
}
exports.AdminDatabaseController = AdminDatabaseController;
