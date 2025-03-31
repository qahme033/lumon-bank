"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
// packages/core-banking/src/models/account.ts
const uuid_1 = require("uuid");
const common_1 = require("@banking-sim/common");
class Account {
    constructor(customerId, accountType, accountName, currency, bankId, status = common_1.AccountStatus.ACTIVE, departmentCode = 'MDR', id) {
        this.customerId = customerId;
        this.accountType = accountType;
        this.accountName = accountName;
        this.currency = currency;
        this.status = status;
        this.departmentCode = departmentCode;
        this.id = id || (0, uuid_1.v4)();
        this.createdAt = new Date();
        this.bankId = bankId;
    }
}
exports.Account = Account;
