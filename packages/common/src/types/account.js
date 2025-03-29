"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatus = exports.AccountType = void 0;
exports.formatAccountId = formatAccountId;
// packages/common/src/index.ts
// Export enums and interfaces
var AccountType;
(function (AccountType) {
    AccountType["CURRENT"] = "CURRENT";
    AccountType["SAVINGS"] = "SAVINGS";
    AccountType["CREDIT_CARD"] = "CREDIT_CARD";
    AccountType["LOAN"] = "LOAN";
})(AccountType || (exports.AccountType = AccountType = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["INACTIVE"] = "INACTIVE";
    AccountStatus["BLOCKED"] = "BLOCKED";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
// Add a simple utility function to ensure the module is recognized
function formatAccountId(id) {
    return `ACC-${id}`;
}
