"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_FILE_PATH = void 0;
// packages/core-banking/src/data/constants.ts
const path_1 = __importDefault(require("path"));
exports.DATA_FILE_PATH = path_1.default.join(__dirname, 'database.json');
