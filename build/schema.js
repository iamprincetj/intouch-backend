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
exports.resolvers = exports.typeDefs = void 0;
const graphql_1 = require("graphql");
const model_1 = require("./model");
const typeDefs = `
    type User {
        id: ID!
        username: String!
        password: String!
        email: String!
        role: String!
    }

    type Query {
        allUsers: [User!]!
        findUser(username: String!): User
    }

`;
exports.typeDefs = typeDefs;
const resolvers = {
    Query: {
        allUsers: () => __awaiter(void 0, void 0, void 0, function* () {
            const users = model_1.User.findAll();
            return users;
        }),
        findUser: (args) => __awaiter(void 0, void 0, void 0, function* () {
            const { username } = args;
            const user = model_1.User.findOne({
                where: {
                    username,
                },
            });
            if (!user) {
                throw new graphql_1.GraphQLError('User not found');
            }
            return user;
        }),
    },
};
exports.resolvers = resolvers;
