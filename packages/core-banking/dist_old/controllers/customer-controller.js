"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const core_banking_1 = require("@banking-sim/core-banking"); // Adjust the import path as needed
class CustomerController {
    constructor(bankId) {
        this.customerService = new core_banking_1.CustomerService(bankId);
    }
    // Create a new customer
    async createCustomer(req, res, next) {
        try {
            const { firstName, lastName, email, phone } = req.body;
            const customer = await this.customerService.createCustomer(firstName, lastName, email, phone);
            res.status(201).json(customer);
        }
        catch (error) {
            next(error);
        }
    }
    // Get a customer by ID
    async getCustomer(req, res, next) {
        try {
            const { customer_id } = req.params;
            const customer = await this.customerService.getCustomer(customer_id);
            if (customer) {
                res.status(200).json(customer);
            }
            else {
                res.status(404).json({ error: 'Customer not found' });
            }
        }
        catch (error) {
            next(error);
        }
    }
    // Get all customers
    async getCustomers(req, res, next) {
        try {
            const customers = await this.customerService.getCustomers();
            res.status(200).json(customers);
        }
        catch (error) {
            next(error);
        }
    }
    // Update a customer
    async updateCustomer(req, res, next) {
        try {
            const { customer_id } = req.params;
            const updates = req.body;
            const updatedCustomer = await this.customerService.updateCustomer(customer_id, updates);
            if (updatedCustomer) {
                res.status(200).json(updatedCustomer);
            }
            else {
                res.status(404).json({ error: 'Customer not found' });
            }
        }
        catch (error) {
            next(error);
        }
    }
    // Delete a customer
    async deleteCustomer(req, res, next) {
        try {
            const { customer_id } = req.params;
            const success = await this.customerService.deleteCustomer(customer_id);
            if (success) {
                res.status(200).json({ message: 'Customer deleted successfully' });
            }
            else {
                res.status(404).json({ error: 'Customer not found' });
            }
        }
        catch (error) {
            next(error);
        }
    }
    // Get customer accounts
    async getCustomerAccounts(req, res, next) {
        try {
            const { customer_id } = req.params;
            const accountIds = await this.customerService.getCustomerAccounts(customer_id);
            res.status(200).json({ accountIds });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CustomerController = CustomerController;
