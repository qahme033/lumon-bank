"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAdminAPI = exports.AdminServer = void 0;
// packages/admin-api/src/index.ts
// packages/admin-api/src/index.ts
var server_1 = require("./server");
Object.defineProperty(exports, "AdminServer", { enumerable: true, get: function () { return server_1.AdminServer; } });
__exportStar(require("./controllers/admin-account-controller"), exports);
__exportStar(require("./controllers/admin-customer-controller"), exports);
__exportStar(require("./controllers/admin-transaction-controller"), exports);
__exportStar(require("./controllers/admin-system-controller"), exports);
__exportStar(require("./controllers/admin-database-controller"), exports);
const core_banking_1 = require("@banking-sim/core-banking");
function testAdminAPI() {
    return `${(0, core_banking_1.testCoreBanking)()} Admin API Module is connected!`;
}
exports.testAdminAPI = testAdminAPI;
