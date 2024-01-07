"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@trpc/server/adapters/express");
const routers_1 = require("./routers");
const context_1 = require("./context");
const ws_1 = require("@trpc/server/adapters/ws");
const ws_2 = require("ws");
const app = (0, express_1.default)();
// This middleware allows the frontend to make requests to the backend
app.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
// This middleware basically applies the trpc router on all routes with - http://localhost:3000/trpc
// If we are using a context with trpc, we have to specify it.
app.use("/trpc", (0, express_2.createExpressMiddleware)({ router: routers_1.appRouter, createContext: context_1.createContext }));
const server = app.listen(3000, () => {
    console.log('[Server]: I am running at http://localhost:3000');
});
// Here, we are creating our WS handler which creates a web socket server
(0, ws_1.applyWSSHandler)({
    wss: new ws_2.WebSocket.Server({ server }),
    router: routers_1.appRouter,
    createContext: context_1.createContext
});
