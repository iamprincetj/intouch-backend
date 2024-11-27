"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (_a) => __awaiter(void 0, [_a], void 0, function* ({ context: queryInterface }) {
        yield queryInterface.createTable('organizations', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            organization_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            organization_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            organization_password: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            organization_location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
        });
        yield queryInterface.createTable('users', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            first_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            phone_number: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
            },
            role: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            organization_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'organizations', key: 'id' },
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
        });
    }),
    down: (_a) => __awaiter(void 0, [_a], void 0, function* ({ context: queryInterface }) {
        yield queryInterface.dropTable('users');
        yield queryInterface.dropTable('organizations');
    }),
};
