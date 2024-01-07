"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProcedure = exports.t = void 0;
const server_1 = require("@trpc/server");
// Whenever we create a new trpc instance using initTRPC, we also have to pipe .context<TContext>
exports.t = server_1.initTRPC.context().create();
// Here, we have created a middleware which needs to access the context to retrieve information
// if the user is an admin or not. If all conditions are passed, use next() to proceed to the 
// next procedure and we can also update the context object like this - next({ctx : { user: {id: 1}}})
const isAdminMiddleware = exports.t.middleware(({ ctx, next }) => {
    if (!ctx.isAdmin) {
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({ ctx: { user: { id: 1 } } });
});
// So this way we can define procedures with adminProcedure in the pipeline which will only allow
// admins to proceed to the next procedure
exports.adminProcedure = exports.t.procedure.use(isAdminMiddleware);
