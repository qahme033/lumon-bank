"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSystemController = void 0;
const core_banking_1 = require("@banking-sim/core-banking");
class AdminSystemController {
    constructor(bankId) {
        this.bankId = bankId;
    }
    async resetSystem(req, res) {
        try {
            // Implementation would go here - reset the database for this bank
            res.status(200).json({
                success: true,
                message: 'System reset successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                // message: error.message
            });
        }
    }
    async seedData(req, res) {
        try {
            // Seed the database with test data
            (0, core_banking_1.seedBankData)(this.bankId);
            res.status(200).json({
                success: true,
                message: 'Test data seeded successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                // message: error.message
            });
        }
    }
    async getStatus(req, res) {
        try {
            // Implementation would go here - get system status
            res.status(200).json({
                success: true,
                data: {
                    status: 'RUNNING',
                    bankId: this.bankId,
                    uptime: process.uptime(),
                    timestamp: new Date().toISOString()
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                // message: error.message
            });
        }
    }
}
exports.AdminSystemController = AdminSystemController;
