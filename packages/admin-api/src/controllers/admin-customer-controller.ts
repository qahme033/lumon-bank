// packages/admin-api/src/controllers/admin-customer-controller.ts
import { Request, Response } from 'express';
import { CoreBankingClient } from '@banking-sim/core-banking-client';

export class AdminCustomerController {
  private client: CoreBankingClient;

  /**
   * Initialize the customer controller with a core banking client.
   * @param bankId The bank ID for this controller
   * @param apiBaseUrl Optional base URL for the core banking API
   */
  constructor(bankId: string, apiBaseUrl?: string) {
    this.client = new CoreBankingClient({
      bankId,
      baseUrl: apiBaseUrl
    });
  }

  /**
   * Create a new customer.
   */
  async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastName, email, phone } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Missing required fields: firstName, lastName, email',
        });
        return;
      }

      const customer = await this.client.createCustomer({
        firstName,
        lastName,
        email,
        phone,
      });

      res.status(201).json({
        success: true,
        data: customer,
      });
    } catch (error: any) {
      console.error(`Error in createCustomer: ${error.message}`);
      
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage,
      });
    }
  }

  /**
   * Retrieve all customers.
   */
  async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      // Pass any query parameters as filters
      const filters = req.query as Record<string, any>;
      const customers = await this.client.getCustomers(filters);

      res.status(200).json({
        success: true,
        data: customers,
        count: customers.length,
      });
    } catch (error: any) {
      console.error(`Error in getCustomers: ${error.message}`);
      
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage,
      });
    }
  }

  /**
   * Retrieve a specific customer by ID.
   */
  async getCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.params.customerId;

      if (!customerId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'customerId is required',
        });
        return;
      }

      const customer = await this.client.getCustomer(customerId);

      if (!customer) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Customer with ID ${customerId} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error: any) {
      console.error(`Error in getCustomer: ${error.message}`);
      
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage,
      });
    }
  }

  /**
   * Update an existing customer.
   */
  async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.params.customerId;
      const { firstName, lastName, email, phone } = req.body;

      if (!customerId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'customerId is required',
        });
        return;
      }

      const updatedCustomer = await this.client.updateCustomer(customerId, {
        firstName,
        lastName,
        email,
        phone,
      });

      res.status(200).json({
        success: true,
        message: 'Customer updated successfully',
        data: updatedCustomer,
      });
    } catch (error: any) {
      console.error(`Error in updateCustomer: ${error.message}`);
      
      // Handle specific 404 error for customer not found
      if (error.response?.status === 404) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Customer not found`,
        });
        return;
      }
      
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage,
      });
    }
  }

  /**
   * Delete a customer.
   */
  async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.params.customerId;

      if (!customerId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'customerId is required',
        });
        return;
      }

      const deleted = await this.client.deleteCustomer(customerId);

      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error: any) {
      console.error(`Error in deleteCustomer: ${error.message}`);
      
      // Handle specific 404 error for customer not found
      if (error.response?.status === 404) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Customer not found`,
        });
        return;
      }
      
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage,
      });
    }
  }
  
  /**
   * Get a customer's accounts.
   */
  async getCustomerAccounts(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.params.customerId;

      if (!customerId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'customerId is required',
        });
        return;
      }

      const accounts = await this.client.getCustomerAccounts(customerId);

      res.status(200).json({
        success: true,
        data: accounts,
        count: accounts.length,
      });
    } catch (error: any) {
      console.error(`Error in getCustomerAccounts: ${error.message}`);
      
      // Handle specific 404 error for customer not found
      if (error.response?.status === 404) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Customer not found`,
        });
        return;
      }
      
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage,
      });
    }
  }
}
