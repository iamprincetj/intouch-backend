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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./utils/config");
const model_1 = require("./model/");
const helper_functions_1 = require("./utils/helper-functions");
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlByaW5jZSBUaiIsImlkIjozLCJpYXQiOjE3MzA2NzM3MjB9.uObW6JVnc6JIvHYgD4yGNo1y13sBjC8VDiU14bRU6Qw
const resolvers = {
    Query: {
        allOrganization: () => __awaiter(void 0, void 0, void 0, function* () {
            const organizations = yield model_1.Organization.findAll();
            return organizations;
        }),
        allUsersInOrganization: (_1, args_1, _a) => __awaiter(void 0, [_1, args_1, _a], void 0, function* (_, args, { currentUser }) {
            let id;
            if (currentUser) {
                const currentUserJson = (0, helper_functions_1.dataToJson)(currentUser);
                id = currentUserJson.organizationId;
            }
            else {
                const { organizationId } = args;
                id = organizationId;
            }
            const currentUserOrganization = yield model_1.Organization.findByPk(id, {
                include: {
                    model: model_1.User,
                },
            });
            const organizationJson = (0, helper_functions_1.dataToJson)(currentUserOrganization);
            const modifiedUsers = organizationJson.users.map((item) => {
                return Object.assign(Object.assign({}, item), { createdAt: item.createdAt.toString() });
            });
            return modifiedUsers;
        }),
        allUsers: () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield model_1.User.findAll();
            return users;
        }),
        findUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { username } = args;
            const user = yield model_1.User.findOne({
                where: {
                    username: username,
                },
            });
            if (!user) {
                throw new graphql_1.GraphQLError('Invalid User', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: username,
                    },
                });
            }
            return user;
        }),
        me: (_1, _args_1, _a) => __awaiter(void 0, [_1, _args_1, _a], void 0, function* (_, _args, { currentUser }) {
            return currentUser;
        }),
    },
    Mutation: {
        createOrganizationAndLeader: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            // destruct the argument
            const { organizationName, organizationType, organizationLocation, organizationPassword, leaderFirstName, leaderLastName, leaderNumber, leaderPassword, } = args;
            const organization = yield model_1.Organization.findOne({
                where: {
                    organizationName,
                },
            });
            if (organization) {
                throw new graphql_1.GraphQLError('An organization with that name already exists', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: organizationName,
                    },
                });
            }
            const organizationPwdHash = yield bcrypt_1.default.hash(organizationPassword, 10);
            // create the organization
            const leaderOrganization = yield model_1.Organization.create({
                organizationName,
                organizationType,
                organizationLocation,
                organizationPassword: organizationPwdHash,
            });
            // parse the returned value of the creations to json format
            const leaderOrganizationJson = (0, helper_functions_1.dataToJson)(leaderOrganization);
            // hash the password for encryption
            const passwordHash = yield bcrypt_1.default.hash(leaderPassword, 10);
            // now create the user with all the above for it's property
            // 2. organization id
            yield model_1.User.create({
                firstName: leaderFirstName,
                lastName: leaderLastName,
                phoneNumber: leaderNumber,
                password: passwordHash,
                role: 'leader',
                organizationId: leaderOrganizationJson.id,
            });
            return Object.assign(Object.assign({}, leaderOrganizationJson), { leaderFirstName,
                leaderLastName,
                leaderNumber });
        }),
        addAdmin: (_1, args_1, _a) => __awaiter(void 0, [_1, args_1, _a], void 0, function* (_, args, { currentUser }) {
            const currentUserJson = (0, helper_functions_1.dataToJson)(currentUser);
            if (!(currentUserJson && currentUserJson.role === 'leader')) {
                throw new graphql_1.GraphQLError('not authenticated, action for a Leader only');
            }
            const { firstName, lastName, phoneNumber, password, role } = args;
            if (role.toLowerCase() === 'leader') {
                throw new graphql_1.GraphQLError(`A Leader already exist in this Organization with username: ${currentUserJson.username}`);
            }
            const passwordHash = yield bcrypt_1.default.hash(password, 10);
            const user = yield model_1.User.create({
                firstName,
                lastName,
                password: passwordHash,
                phoneNumber,
                role,
                organizationId: currentUserJson.organizationId,
            });
            return user;
        }),
        addUser: (_1, args_1, _a) => __awaiter(void 0, [_1, args_1, _a], void 0, function* (_, args, { currentUser }) {
            const currentUserJson = (0, helper_functions_1.dataToJson)(currentUser);
            if (!(currentUserJson && currentUserJson.role === 'admin')) {
                throw new graphql_1.GraphQLError('Action for an Admin only');
            }
            const { firstName, lastName, phoneNumber, role } = args;
            if (role.toLowerCase() === 'admin') {
                throw new graphql_1.GraphQLError('not authenticated, action for a Leader only');
            }
            const user = yield model_1.User.create({
                firstName,
                lastName,
                phoneNumber,
                role,
                organizationId: currentUserJson.organizationId,
            });
            return user;
        }),
        editUser: (_1, args_1, _a) => __awaiter(void 0, [_1, args_1, _a], void 0, function* (_, args, { currentUser }) {
            if (!currentUser) {
                throw new graphql_1.GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            }
            const userJson = currentUser.toJSON();
            const user = yield model_1.User.findByPk(userJson.id);
            if (!user) {
                throw new graphql_1.GraphQLError('Unknown User', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            }
            const updatedUser = yield user.update(args);
            // const userJson = user.toJSON();
            return updatedUser;
        }),
        loginToOrganization: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { organizationName, organizationPassword } = args;
            const organization = yield model_1.Organization.findOne({
                where: {
                    organizationName,
                },
            });
            if (!organization) {
                throw new graphql_1.GraphQLError(`No organization with name: ${organizationName}`, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: organizationName,
                    },
                });
            }
            const organizationJson = (0, helper_functions_1.dataToJson)(organization);
            const passwordCorrect = yield bcrypt_1.default.compare(organizationPassword, organizationJson.organizationPassword);
            if (!passwordCorrect) {
                throw new graphql_1.GraphQLError('Incorrect password!', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: organizationPassword,
                    },
                });
            }
            return {
                id: organizationJson.id,
                organizationName: organizationJson.organizationName,
                organizationType: organizationJson.organizationType,
                organizationLocation: organizationJson.organizationLocation,
            };
        }),
        login: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { phoneNumber, password } = args;
            const user = yield model_1.User.findOne({
                where: {
                    phoneNumber: phoneNumber,
                },
            });
            const userJson = user === null || user === void 0 ? void 0 : user.toJSON();
            const passwordCorrect = yield bcrypt_1.default.compare(password, userJson.password);
            if (!user) {
                throw new graphql_1.GraphQLError(`No user with phone number: ${phoneNumber}`, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: phoneNumber
                    },
                });
            }
            if (!passwordCorrect) {
                throw new graphql_1.GraphQLError(`Incorrect password`, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            }
            const dataForToken = {
                phoneNumber: userJson.phoneNumber,
                id: userJson.id,
            };
            const token = jsonwebtoken_1.default.sign(dataForToken, config_1.JWT_SECRET);
            return { token: { value: token }, user: userJson };
        }),
    },
};
exports.default = resolvers;
