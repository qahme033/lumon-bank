// // packages/admin-api/src/controllers/admin-transaction-controller.ts
// import { Request, Response } from 'express';
// // import { transactionAPI } from '@banking-sim/common';

// export class AdminTransactionController {
//   private bankId: string;

//   constructor(bankId: string) {
//     this.bankId = bankId;
//   }
// /**
//  * Retrieve a single transaction.
//  */
// async getTransaction(req: Request, res: Response): Promise<void> {
//   try {
//     const transactionId = req.params.transactionId;
//     if (!transactionId) {
//       res.status(400).json({
//         success: false,
//         error: 'Bad Request',
//         message: 'transactionId is required',
//       });
//       return;
//     }
    
//     const transaction = await transactionAPI.getTransaction(transactionId);
    
//     if (!transaction) {
//       res.status(404).json({
//         success: false,
//         error: 'Not Found',
//         message: `Transaction with ID ${transactionId} not found`,
//       });
//       return;
//     }
    
//     res.status(200).json({
//       success: true,
//       data: transaction,
//     });
//   } catch (error: any) {
//     console.error(`Error in getTransaction: ${error.message}`);
//     if (error.response) {
//       res.status(error.response.status).json({
//         success: false,
//         error: error.response.statusText,
//         message: error.response.data.message || 'An error occurred',
//       });
//     } else if (error.request) {
//       res.status(503).json({
//         success: false,
//         error: 'Service Unavailable',
//         message: 'No response from transaction service',
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         error: 'Internal Server Error',
//         message: error.message,
//       });
//     }
//   }
// }
// }
