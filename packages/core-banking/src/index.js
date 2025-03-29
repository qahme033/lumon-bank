"use strict";
// packages/core-banking/src/index.ts
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
exports.getGreeting = void 0;
exports.testCoreBanking = testCoreBanking;
const common_1 = require("@banking-sim/common");
function testCoreBanking() {
    return `${(0, common_1.getGreeting)('Tester')} Core Banking Module v${common_1.VERSION} is working!`;
}
// Export the test function
var common_2 = require("@banking-sim/common");
Object.defineProperty(exports, "getGreeting", { enumerable: true, get: function () { return common_2.getGreeting; } });
// Export models
__exportStar(require("./models/account"), exports);
// Export services
__exportStar(require("./services/account-service"), exports);
// Export database
__exportStar(require("./data/in-memory-db"), exports);
