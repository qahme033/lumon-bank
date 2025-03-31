"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseController = void 0;
const core_banking_1 = require("@banking-sim/core-banking"); // Adjust the import path as needed
class DatabaseController {
    constructor(bankId) {
        this.databaseService = new core_banking_1.DatabaseService(bankId);
    }
    // Get database snapshot
    async getDatabaseSnapshot(req, res, next) {
        try {
            const includeAllBanks = req.query.includeAllBanks === 'true';
            const snapshot = await this.databaseService.getDatabaseSnapshot(includeAllBanks);
            res.status(200).json(snapshot);
        }
        catch (error) {
            next(error);
        }
    }
    // Get database stats
    async getStats(req, res, next) {
        try {
            const stats = await this.databaseService.getStats();
            res.status(200).json(stats);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DatabaseController = DatabaseController;
