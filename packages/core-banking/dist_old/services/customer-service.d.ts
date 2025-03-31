import { ICustomer } from '../data/in-memory-db';
export declare class CustomerService {
    private db;
    private bankId;
    constructor(bankId: string);
    /**
     * Create a new customer
     */
    createCustomer(firstName: string, lastName: string, email: string, phone?: string): Promise<ICustomer>;
    /**
     * Get a customer by ID
     */
    getCustomer(customerId: string): Promise<ICustomer | null>;
    /**
     * Get all customers for this bank
     */
    getCustomers(): Promise<ICustomer[]>;
    /**
     * Update a customer
     */
    updateCustomer(customerId: string, updates: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
    }): Promise<ICustomer | null>;
    /**
     * Delete a customer
     */
    deleteCustomer(customerId: string): Promise<boolean>;
    /**
     * Get customer accounts
     */
    getCustomerAccounts(customerId: string): Promise<string[]>;
}
