"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("../trpc");
const users_1 = require("./users");
// Here, we create a trpc router just like we do const router = express.Router()
exports.appRouter = trpc_1.t.router({
    // each procedure is just an API endpoint
    // .query() is a procedure that gets some data.
    sayHi: trpc_1.t.procedure.query(() => {
        return "Hi";
    }),
    // .mutation() is a procedure that creates, updates, or deletes some data.
    // .input() is used for validation purposes. Can also use validation libraries like zod, yup, etc.
    logToServer: trpc_1.t.procedure
        .input(v => {
        if (typeof v === 'string')
            return v;
        throw new Error("Invalid input: expected string");
    }).mutation(req => {
        console.log(`Client says - ${req.input}`);
        return true;
    }),
    // this procedure should be accessible to only admins. Hence, used adminProcedure
    secretData: trpc_1.adminProcedure.query(({ ctx }) => {
        console.log(ctx.user);
        return "super secret client data";
    }),
    // Here, userRouter is another router specifically for user related procedures.
    // This is a way to include multiple routers inside one common router
    users: users_1.userRouter,
});
