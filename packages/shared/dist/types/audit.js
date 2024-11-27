"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueSeverity = exports.AuditSource = exports.AuditType = void 0;
var AuditType;
(function (AuditType) {
    AuditType["BASIC"] = "basic";
    AuditType["COMPREHENSIVE"] = "comprehensive";
    AuditType["CONVERSION"] = "conversion";
    AuditType["ACCESSIBILITY"] = "accessibility";
    AuditType["DESIGN_SYSTEM"] = "design_system";
})(AuditType || (exports.AuditType = AuditType = {}));
var AuditSource;
(function (AuditSource) {
    AuditSource["URL"] = "url";
    AuditSource["FIGMA"] = "figma";
    AuditSource["IMAGE"] = "image";
    AuditSource["PDF"] = "pdf";
})(AuditSource || (exports.AuditSource = AuditSource = {}));
var IssueSeverity;
(function (IssueSeverity) {
    IssueSeverity["CRITICAL"] = "critical";
    IssueSeverity["HIGH"] = "high";
    IssueSeverity["MEDIUM"] = "medium";
    IssueSeverity["LOW"] = "low";
    IssueSeverity["INFO"] = "info";
})(IssueSeverity || (exports.IssueSeverity = IssueSeverity = {}));
