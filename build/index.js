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
const express_1 = __importDefault(require("express"));
const config_1 = require("./utils/config");
const db_1 = require("./utils/db");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const schema_1 = require("@graphql-tools/schema");
const cors_1 = __importDefault(require("cors"));
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const http_1 = require("http");
const schema_2 = require("./schema");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_1 = require("./model");
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.connectToDatabase)();
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    const schema = (0, schema_1.makeExecutableSchema)({ typeDefs: schema_2.typeDefs, resolvers: schema_2.resolvers });
    const wsServer = new ws_1.WebSocketServer({
        server: httpServer,
        path: '/',
    });
    const serverCleanup = (0, ws_2.useServer)({ schema }, wsServer);
    const server = new server_1.ApolloServer({
        schema,
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            {
                serverWillStart() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return {
                            drainServer() {
                                return __awaiter(this, void 0, void 0, function* () {
                                    yield serverCleanup.dispose();
                                });
                            }
                        };
                    });
                }
            }
        ]
    });
    yield server.start();
    app.use('/', (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(server, {
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
            const auth = req ? req.headers.authorization : null;
            let currentUser = null;
            if (auth && auth.startsWith('Bearer ')) {
                const decodedToken = jsonwebtoken_1.default.verify(auth.substring(7), config_1.JWT_SECRET);
                currentUser = yield model_1.User.findByPk(decodedToken.id);
            }
            return { currentUser };
        }),
    }));
    httpServer.listen(config_1.PORT, () => {
        console.log(`Server is now running on http://localhost:${config_1.PORT}`);
    });
});
start();
