// packages/core-banking/src/models/account.ts
import { v4 as uuidv4 } from 'uuid';
import { AccountType, AccountStatus, IAccount } from '@banking-sim/common';

export class Account implements IAccount {
  public id: string;
  public createdAt: Date;
  public bankId: string;

  constructor(
    public customerId: string,
    public accountType: AccountType,
    public accountName: string,
    public currency: string,
    bankId: string,
    public status: AccountStatus = AccountStatus.ACTIVE,
    public departmentCode: string = 'MDR',
    id?: string
  ) {
    this.id = id || uuidv4();
    this.createdAt = new Date();
    this.bankId = bankId;
  }
}
