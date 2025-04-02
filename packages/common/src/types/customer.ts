// packages/common/src/types/customer.ts

/**
 * Represents a customer in the banking system.
 */
export interface ICustomer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
  }
  