// packages/admin-api/src/controllers/admin-customer-controller.ts
import { Request, Response } from 'express';
import { CustomerService } from '@banking-sim/core-banking';

export class AdminCustomerController {
  private bankId: string;
  private customerService: CustomerService;

  constructor(bankId: string) {
    this.bankId = bankId;
    this.customerService = new CustomerService(bankId);
  }

  async createCustomer(req: Request, res: Response): Promise<void> {
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
      
      const customer = await this.customerService.createCustomer(
        firstName,
        lastName,
        email,
        phone
      );
      
      res.status(201).json({
        success: true,
        data: customer
      });
    } catch (error: unknown) {
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

  async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      const customers = await this.customerService.getCustomers();
      
      res.status(200).json({
        success: true,
        data: customers,
        count: customers.length
      });
    } catch (error: unknown) {
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

  async getCustomer(req: Request, res: Response): Promise<void> {
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
    } catch (error: unknown) {
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

  async updateCustomer(req: Request, res: Response): Promise<void> {
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
      
      const updatedCustomer = await this.customerService.updateCustomer(
        customerId,
        { firstName, lastName, email, phone }
      );
      
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
    } catch (error: unknown) {
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

  async deleteCustomer(req: Request, res: Response): Promise<void> {
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
    } catch (error: unknown) {
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
