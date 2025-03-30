// packages/core-banking/src/data/seed-data.ts
import { v4 as uuidv4 } from 'uuid';
import { IBank, InMemoryDatabase } from './in-memory-db';
import { AccountType, AccountStatus } from '@banking-sim/common';
import { DatabaseService } from '../services/database-service';

export function seedBankData(bankId: string): void {
  const db = InMemoryDatabase.getInstance();
  
  // Clear any existing data for this bank
  db.reset(bankId);
  
  // Create test customers
  const customer1Id = uuidv4();
  const customer2Id = uuidv4();
  
  db.customers.set(customer1Id, {
    id: customer1Id,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    bankId
  });
  
  db.customers.set(customer2Id, {
    id: customer2Id,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    bankId
  });
  
  // Create accounts for customers
  const account1Id = uuidv4();
  const account2Id = uuidv4();
  const account3Id = uuidv4();
  
  // John's checking account
  db.accounts.set(account1Id, {
    id: account1Id,
    customerId: customer1Id,
    bankId,
    accountType: AccountType.CURRENT,
    accountName: 'Main Checking',
    currency: 'USD',
    status: AccountStatus.ACTIVE,
    departmentCode: 'MDR',
    createdAt: new Date()
  });
  
  // John's savings account
  db.accounts.set(account2Id, {
    id: account2Id,
    customerId: customer1Id,
    bankId,
    accountType: AccountType.SAVINGS,
    accountName: 'Vacation Savings',
    currency: 'USD',
    status: AccountStatus.ACTIVE,
    departmentCode: 'MDR',
    createdAt: new Date()
  });
  
  // Jane's checking account
  db.accounts.set(account3Id, {
    id: account3Id,
    customerId: customer2Id,
    bankId,
    accountType: AccountType.CURRENT,
    accountName: 'Primary Account',
    currency: 'USD',
    status: AccountStatus.ACTIVE,
    departmentCode: 'MDR',
    createdAt: new Date()
  });
  
  // Set account balances
  db.balances.set(account1Id, {
    available: 5000.75,
    current: 5000.75,
    pending: 0
  });
  
  db.balances.set(account2Id, {
    available: 12500.50,
    current: 12500.50,
    pending: 0
  });
  
  db.balances.set(account3Id, {
    available: 7350.25,
    current: 7350.25,
    pending: 0
  });
  
  // Add some transaction history
  db.transactions.set(account1Id, [
    {
      id: uuidv4(),
      accountId: account1Id,
      amount: -25.50,
      description: 'Coffee Shop',
      type: 'DEBIT',
      status: 'COMPLETED',
      timestamp: new Date(Date.now() - 86400000) // Yesterday
    },
    {
      id: uuidv4(),
      accountId: account1Id,
      amount: 1200.00,
      description: 'Salary Deposit',
      type: 'CREDIT',
      status: 'COMPLETED',
      timestamp: new Date(Date.now() - 7 * 86400000) // A week ago
    }
  ]);
  
  db.transactions.set(account2Id, [
    {
      id: uuidv4(),
      accountId: account2Id,
      amount: 500.00,
      description: 'Transfer from Checking',
      type: 'CREDIT',
      status: 'COMPLETED',
      timestamp: new Date(Date.now() - 14 * 86400000) // Two weeks ago
    }
  ]);
  
  db.transactions.set(account3Id, [
    {
      id: uuidv4(),
      accountId: account3Id,
      amount: -120.30,
      description: 'Grocery Store',
      type: 'DEBIT',
      status: 'COMPLETED',
      timestamp: new Date(Date.now() - 2 * 86400000) // Two days ago
    },
    {
      id: uuidv4(),
      accountId: account3Id,
      amount: -45.99,
      description: 'Online Subscription',
      type: 'DEBIT',
      status: 'COMPLETED',
      timestamp: new Date(Date.now() - 5 * 86400000) // Five days ago
    }
  ]);
    
  const dbService = new DatabaseService(bankId);
  
    const banks: IBank[] = [
      { id: 'bank1', name: 'First National Bank' },
      { id: 'bank2', name: 'Global Trust Bank' },
      { id: 'bank3', name: 'City Savings Bank' },
      // Add more banks as needed
    ];
  
    for (const bank of banks) {
      try {
        dbService.addBank(bank);
      } catch (error) {
        console.error(`Error adding bank ${bank.id}: ${(error as Error).message}`);
      }
    }

}
