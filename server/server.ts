import express, {Express, Request, Response} from 'express';
import cors from "cors";
import {createExpressMiddleware} from "@trpc/server/adapters/express";
import { appRouter } from './routers';
import { createContext } from './context';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocket } from 'ws';

const app: Express = express();
// This middleware allows the frontend to make requests to the backend
app.use(cors({origin: "http://localhost:5173"}));

// This middleware basically applies the trpc router on all routes with - http://localhost:3000/trpc
// If we are using a context with trpc, we have to specify it.
app.use("/trpc", createExpressMiddleware({router: appRouter, createContext}));

const server = app.listen(3000, ()=> {
    console.log('[Server]: I am running at http://localhost:3000');
});

// Here, we are creating our WS handler which creates a web socket server
applyWSSHandler({
    wss : new WebSocket.Server({server}),
    router: appRouter,
    createContext   
})

// Exporting the type of our trpc router helps in mainting type safety between backend and frontend
// Understand it this way - frontend continuously listens to this export statement and if anything is 
// changed in the router at the backend, it shows type error in our frontend code as well.
export type AppRouter = typeof appRouter