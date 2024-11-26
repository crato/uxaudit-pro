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
exports.APIError = exports.db = void 0;
__exportStar(require("./database"), exports);
__exportStar(require("./errors"), exports);
__exportStar(require("./crud"), exports);
// src/utils/index.ts
var database_1 = require("./database");
Object.defineProperty(exports, "db", { enumerable: true, get: function () { return database_1.db; } });
var shared_1 = require("@uxaudit-pro/shared");
Object.defineProperty(exports, "APIError", { enumerable: true, get: function () { return shared_1.APIError; } });
