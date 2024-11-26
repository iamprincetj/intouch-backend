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
exports.runMigrations = exports.rollBackMigrations = exports.sequelize = exports.connectToDatabase = void 0;
// Desc: Database connection and migration setup
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
const umzug_1 = require("umzug");
const sequelize = new sequelize_1.Sequelize(config_1.DATABASE_URL, {
    dialect: 'postgres',
    host: 'localhost'
});
exports.sequelize = sequelize;
// const sequelize = new Sequelize(DATABASE_URL, {
//     dialect: 'postgres',
//     host: 'localhost'
// });
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        return process.exit(1);
    }
    return null;
});
exports.connectToDatabase = connectToDatabase;
const migrationConf = {
    migrations: {
        glob: 'migrations/*.ts',
    },
    storage: new umzug_1.SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
};
const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    const migrator = new umzug_1.Umzug(migrationConf);
    const migrations = yield migrator.up();
    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name)
    });
});
exports.runMigrations = runMigrations;
const rollBackMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.authenticate();
    const migrator = new umzug_1.Umzug(migrationConf);
    yield migrator.down();
});
exports.rollBackMigrations = rollBackMigrations;
