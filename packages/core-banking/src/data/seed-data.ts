// packages/core-banking/src/data/seed-data.ts
import { v4 as uuidv4 } from 'uuid';
import { AccountType, AccountStatus, IBank, IAccount, IBalance, ITransaction, ICustomer } from '@banking-sim/common';
import { MongoDBService } from '../services/mongodb-service.js';
import { ObjectId } from 'mongodb';

export async function seedBankData(bankId: string | ObjectId): Promise<void> {
  // Get MongoDB service instance
  const dbService = await MongoDBService.getInstance();
  
  // Convert bankId to ObjectId if it's a string
  const bankOId = bankId instanceof ObjectId ? bankId : new ObjectId(bankId);
  
  // Clear any existing data for this bank
  await dbService.reset(bankOId);
  
  // Create test customers
  const customer1Id = new ObjectId();
  const customer2Id = new ObjectId();
  
  const customer1: ICustomer = {
    id: customer1Id,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    bankId: bankOId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const customer2: ICustomer = {
    id: customer2Id,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    bankId: bankOId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Add customers
  await dbService.addCustomer(customer1);
  await dbService.addCustomer(customer2);
  
  // Create accounts for customers
  const account1Id = new ObjectId();
  const account2Id = new ObjectId();
  const account3Id = new ObjectId();
  
  // John's checking account
  const account1: IAccount = {
    id: account1Id,
    customerId: customer1Id,
    bankId: bankOId,
    accountType: AccountType.CURRENT,
    accountName: 'Main Checking',
    currency: 'USD',
    status: AccountStatus.ACTIVE,
    departmentCode: 'MDR',
    createdAt: new Date(),
    updatedAt: new Date()

  };
  
  // John's savings account
  const account2: IAccount = {
    id: account2Id,
    customerId: customer1Id,
    bankId: bankOId,
    accountType: AccountType.SAVINGS,
    accountName: 'Vacation Savings',
    currency: 'USD',
    status: AccountStatus.ACTIVE,
    departmentCode: 'MDR',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Jane's checking account
  const account3: IAccount = {
    id: account3Id,
    customerId: customer2Id,
    bankId: bankOId,
    accountType: AccountType.CURRENT,
    accountName: 'Primary Account',
    currency: 'USD',
    status: AccountStatus.ACTIVE,
    departmentCode: 'MDR',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Add accounts
  await dbService.addAccount(account1);
  await dbService.addAccount(account2);
  await dbService.addAccount(account3);
  
  // Set account balances
  const balance1: IBalance = {
    id: new ObjectId(),
    available: 5000.75,
    current: 5000.75,
    pending: 0
  };
  
  const balance2: IBalance = {
    id: new ObjectId(),
    available: 12500.50,
    current: 12500.50,
    pending: 0
  };
  
  const balance3: IBalance = {
    id: new ObjectId(),
    available: 7350.25,
    current: 7350.25,
    pending: 0
  };
  
  await dbService.setBalance(account1Id, balance1);
  await dbService.setBalance(account2Id, balance2);
  await dbService.setBalance(account3Id, balance3);
  
  // Add some transaction history
  const transaction1: ITransaction = {
    id: new ObjectId(),
    accountId: account1Id,
    amount: -25.50,
    description: 'Coffee Shop',
    type: 'DEBIT',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 86400000) // Yesterday
  };
  
  const transaction2: ITransaction = {
    id: new ObjectId(),
    accountId: account1Id,
    amount: 1200.00,
    description: 'Salary Deposit',
    type: 'CREDIT',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 7 * 86400000) // A week ago
  };
  
  const transaction3: ITransaction = {
    id: new ObjectId(),
    accountId: account2Id,
    amount: 500.00,
    description: 'Transfer from Checking',
    type: 'CREDIT',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 14 * 86400000) // Two weeks ago
  };
  
  const transaction4: ITransaction = {
    id: new ObjectId(),
    accountId: account3Id,
    amount: -120.30,
    description: 'Grocery Store',
    type: 'DEBIT',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 2 * 86400000) // Two days ago
  };
  
  const transaction5: ITransaction = {
    id: new ObjectId(),
    accountId: account3Id,
    amount: -45.99,
    description: 'Online Subscription',
    type: 'DEBIT',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 5 * 86400000) // Five days ago
  };
  
  await dbService.addTransaction(transaction1);
  await dbService.addTransaction(transaction2);
  await dbService.addTransaction(transaction3);
  await dbService.addTransaction(transaction4);
  await dbService.addTransaction(transaction5);
  
  // Add sample banks
  const banks: IBank[] = [
    { id: new ObjectId('000000000000000000000001'), name: 'First National Bank' },
    { id: new ObjectId('000000000000000000000002'), name: 'Global Trust Bank' },
    { id: new ObjectId('000000000000000000000003'), name: 'City Savings Bank' },
    // Add more banks as needed
  ];

  for (const bank of banks) {
    try {
      await dbService.addBank(bank);
    } catch (error) {
      console.error(`Error adding bank ${bank.id}: ${(error as Error).message}`);
    }
  }
}
