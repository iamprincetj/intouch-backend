"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../utils/db");
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
User.init({
    // Users model attributes are defined here
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
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
    organizationId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organization', key: 'id' },
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'user',
    timestamps: true,
    underscored: true,
});
exports.default = User;
