"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
// packages/core-banking/src/services/customer-service.ts
const uuid_1 = require("uuid");
const in_memory_db_1 = require("../data/in-memory-db");
class CustomerService {
    constructor(bankId) {
        this.db = in_memory_db_1.InMemoryDatabase.getInstance();
        this.bankId = bankId;
    }
    /**
     * Create a new customer
     */
    async createCustomer(firstName, lastName, email, phone) {
        // Validate inputs
        if (!firstName || !lastName || !email) {
            throw new Error('First name, last name, and email are required');
        }
        // Check if customer with the same email already exists
        for (const [_, customer] of this.db.customers) {
            if (customer.email === email && customer.bankId === this.bankId) {
                throw new Error(`Customer with email ${email} already exists`);
            }
        }
        // Create the customer
        const customer = {
            id: (0, uuid_1.v4)(),
            firstName,
            lastName,
            email,
            phone,
            bankId: this.bankId
        };
        // Store the customer
        this.db.customers.set(customer.id, customer);
        return customer;
    }
    /**
     * Get a customer by ID
     */
    async getCustomer(customerId) {
        const customer = this.db.customers.get(customerId);
        if (customer && customer.bankId === this.bankId) {
            return customer;
        }
        return null;
    }
    /**
     * Get all customers for this bank
     */
    async getCustomers() {
        const customers = [];
        for (const [_, customer] of this.db.customers) {
            if (customer.bankId === this.bankId) {
                customers.push(customer);
            }
        }
        return customers;
    }
    /**
     * Update a customer
     */
    async updateCustomer(customerId, updates) {
        const customer = await this.getCustomer(customerId);
        if (!customer) {
            return null;
        }
        // If updating email, check if it's already in use
        if (updates.email && updates.email !== customer.email) {
            for (const [_, existingCustomer] of this.db.customers) {
                if (existingCustomer.email === updates.email &&
                    existingCustomer.bankId === this.bankId &&
                    existingCustomer.id !== customerId) {
                    throw new Error(`Email ${updates.email} is already in use`);
                }
            }
        }
        // Update the customer
        const updatedCustomer = {
            ...customer,
            firstName: updates.firstName || customer.firstName,
            lastName: updates.lastName || customer.lastName,
            email: updates.email || customer.email,
            phone: updates.phone !== undefined ? updates.phone : customer.phone
        };
        // Store the updated customer
        this.db.customers.set(customerId, updatedCustomer);
        return updatedCustomer;
    }
    /**
     * Delete a customer
     */
    async deleteCustomer(customerId) {
        const customer = await this.getCustomer(customerId);
        if (!customer) {
            return false;
        }
        // Check if customer has any accounts
        for (const [_, account] of this.db.accounts) {
            if (account.customerId === customerId) {
                throw new Error('Cannot delete customer with active accounts');
            }
        }
        // Delete the customer
        this.db.customers.delete(customerId);
        return true;
    }
    /**
     * Get customer accounts
     */
    async getCustomerAccounts(customerId) {
        const accountIds = [];
        for (const [id, account] of this.db.accounts) {
            if (account.customerId === customerId && account.bankId === this.bankId) {
                accountIds.push(id);
            }
        }
        return accountIds;
    }
}
exports.CustomerService = CustomerService;
