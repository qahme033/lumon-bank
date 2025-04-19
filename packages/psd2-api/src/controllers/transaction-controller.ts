import { Request, Response } from 'express';

export class TransactionController {
  private bankId: string;
  // private transactionService: TransactionService;

  constructor(bankId: string) {
    this.bankId = bankId;
    // this.transactionService = new TransactionService(bankId);
  }

  /**
   * Retrieves all transactions for a given account.
   * Expects `account_id` to be passed in the request parameters.
   */
  // async getAccountTransactions(req: Request, res: Response) {
  //   try {
  //     const accountId = req.params.account_id;
  //     if (!accountId) {
  //       return res.status(400).json({
  //         error: 'Bad Request',
  //         message: 'account_id is required'
  //       });
  //     }

  //     // Retrieve transactions using the TransactionService
  //     // const transactions = await this.transactionService.getTransactionsForAccount(accountId);
      
  //     res.status(200).json({
  //       account_id: accountId,
  //       transactions,
  //       total_count: transactions.length
  //     });
  //   } catch (error: any) {
  //     res.status(500).json({
  //       error: 'Internal Server Error',
  //       message: error.message
  //     });
  //   }
  // }
}
