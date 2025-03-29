export declare enum AccountType {
    CURRENT = "CURRENT",
    SAVINGS = "SAVINGS",
    CREDIT_CARD = "CREDIT_CARD",
    LOAN = "LOAN"
}
export declare enum AccountStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}
export interface IAccount {
    id: string;
    customerId: string;
    bankId: string;
    accountType: AccountType;
    accountName: string;
    currency: string;
    status: AccountStatus;
    departmentCode: string;
    createdAt: Date;
}
export declare function formatAccountId(id: string): string;
