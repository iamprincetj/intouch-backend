"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = exports.User = void 0;
const organizations_1 = __importDefault(require("./organizations"));
exports.Organization = organizations_1.default;
const users_1 = __importDefault(require("./users"));
exports.User = users_1.default;
users_1.default.belongsTo(organizations_1.default);
organizations_1.default.hasMany(users_1.default);
