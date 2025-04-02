// packages/admin-api/src/controllers/admin-customer-controller.ts
import { Request, Response } from 'express';
import { customerAPI } from '@banking-sim/common';

export class AdminCustomerController {
  /**
   * Create a new customer by delegating to the common package.
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

      const customer = await customerAPI.createCustomer({
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
      if (error.response) {
        // Errors from the core banking service via common package
        res.status(error.response.status).json({
          success: false,
          error: error.response.statusText,
          message: error.response.data.message || 'An error occurred',
        });
      } else if (error.request) {
        // No response received
        res.status(503).json({
          success: false,
          error: 'Service Unavailable',
          message: 'No response from core banking service',
        });
      } else {
        // Other errors
        res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: error.message,
        });
      }
    }
  }

  /**
   * Retrieve all customers.
   */
  async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      const customers = await customerAPI.getCustomers();

      res.status(200).json({
        success: true,
        data: customers,
        count: customers.length,
      });
    } catch (error: any) {
      console.error(`Error in getCustomers: ${error.message}`);
      if (error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.statusText,
          message: error.response.data.message || 'An error occurred',
        });
      } else if (error.request) {
        res.status(503).json({
          success: false,
          error: 'Service Unavailable',
          message: 'No response from core banking service',
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: error.message,
        });
      }
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

      const customer = await customerAPI.getCustomer(customerId);

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
      if (error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.statusText,
          message: error.response.data.message || 'An error occurred',
        });
      } else if (error.request) {
        res.status(503).json({
          success: false,
          error: 'Service Unavailable',
          message: 'No response from core banking service',
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: error.message,
        });
      }
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

      const updatedCustomer = await customerAPI.updateCustomer(customerId, {
        firstName,
        lastName,
        email,
        phone,
      });

      if (!updatedCustomer) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Customer with ID ${customerId} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Customer updated successfully',
        data: updatedCustomer,
      });
    } catch (error: any) {
      console.error(`Error in updateCustomer: ${error.message}`);
      if (error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.statusText,
          message: error.response.data.message || 'An error occurred',
        });
      } else if (error.request) {
        res.status(503).json({
          success: false,
          error: 'Service Unavailable',
          message: 'No response from core banking service',
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: error.message,
        });
      }
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

      const deleted = await customerAPI.deleteCustomer(customerId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Customer with ID ${customerId} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error: any) {
      console.error(`Error in deleteCustomer: ${error.message}`);
      if (error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.statusText,
          message: error.response.data.message || 'An error occurred',
        });
      } else if (error.request) {
        res.status(503).json({
          success: false,
          error: 'Service Unavailable',
          message: 'No response from core banking service',
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: error.message,
        });
      }
    }
  }
}
