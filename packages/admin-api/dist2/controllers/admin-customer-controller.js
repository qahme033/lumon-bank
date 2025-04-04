"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCustomerController = void 0;
const core_banking_1 = require("@banking-sim/core-banking");
class AdminCustomerController {
    constructor(bankId) {
        this.bankId = bankId;
        this.customerService = new core_banking_1.CustomerService(bankId);
    }
    async createCustomer(req, res) {
        try {
            const { firstName, lastName, email, phone } = req.body;
            // Validate required fields
            if (!firstName || !lastName || !email) {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                    message: 'Missing required fields: firstName, lastName, email'
                });
                return;
            }
            const customer = await this.customerService.createCustomer(firstName, lastName, email, phone);
            res.status(201).json({
                success: true,
                data: customer
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unknown error occurred';
            console.error(`Error in createCustomer: ${errorMessage}`);
            res.status(400).json({
                success: false,
                error: 'Creation Failed',
                message: errorMessage
            });
        }
    }
    async getCustomers(req, res) {
        try {
            const customers = await this.customerService.getCustomers();
            res.status(200).json({
                success: true,
                data: customers,
                count: customers.length
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unknown error occurred';
            console.error(`Error in getCustomers: ${errorMessage}`);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: errorMessage
            });
        }
    }
    async getCustomer(req, res) {
        try {
            const customerId = req.params.customerId;
            if (!customerId) {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                    message: 'customerId is required'
                });
                return;
            }
            const customer = await this.customerService.getCustomer(customerId);
            if (!customer) {
                res.status(404).json({
                    success: false,
                    error: 'Not Found',
                    message: `Customer with ID ${customerId} not found`
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: customer
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unknown error occurred';
            console.error(`Error in getCustomer: ${errorMessage}`);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: errorMessage
            });
        }
    }
    async updateCustomer(req, res) {
        try {
            const customerId = req.params.customerId;
            const { firstName, lastName, email, phone } = req.body;
            if (!customerId) {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                    message: 'customerId is required'
                });
                return;
            }
            const updatedCustomer = await this.customerService.updateCustomer(customerId, { firstName, lastName, email, phone });
            if (!updatedCustomer) {
                res.status(404).json({
                    success: false,
                    error: 'Not Found',
                    message: `Customer with ID ${customerId} not found`
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Customer updated successfully',
                data: updatedCustomer
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unknown error occurred';
            console.error(`Error in updateCustomer: ${errorMessage}`);
            res.status(400).json({
                success: false,
                error: 'Update Failed',
                message: errorMessage
            });
        }
    }
    async deleteCustomer(req, res) {
        try {
            const customerId = req.params.customerId;
            if (!customerId) {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                    message: 'customerId is required'
                });
                return;
            }
            const deleted = await this.customerService.deleteCustomer(customerId);
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: 'Not Found',
                    message: `Customer with ID ${customerId} not found`
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Customer deleted successfully'
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unknown error occurred';
            console.error(`Error in deleteCustomer: ${errorMessage}`);
            res.status(400).json({
                success: false,
                error: 'Deletion Failed',
                message: errorMessage
            });
        }
    }
}
exports.AdminCustomerController = AdminCustomerController;
