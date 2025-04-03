
    export interface ITransaction {
        id: string;
        accountId: string;
        amount: number;
        description: string;
        type: 'CREDIT' | 'DEBIT';
        status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
        timestamp: Date;
    }