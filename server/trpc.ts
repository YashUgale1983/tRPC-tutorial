import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { createContext } from "./context";

// Whenever we create a new trpc instance using initTRPC, we also have to pipe .context<TContext>
export const t = initTRPC.context<inferAsyncReturnType<typeof createContext>>().create();

// Here, we have created a middleware which needs to access the context to retrieve information
// if the user is an admin or not. If all conditions are passed, use next() to proceed to the 
// next procedure and we can also update the context object like this - next({ctx : { user: {id: 1}}})
const isAdminMiddleware = t.middleware(({ctx, next})=>{
    if(!ctx.isAdmin){
        throw new TRPCError({code: "UNAUTHORIZED"});
    }

    return next({ctx : { user: {id: 1}}});
})

// So this way we can define procedures with adminProcedure in the pipeline which will only allow
// admins to proceed to the next procedure
export const adminProcedure = t.procedure.use(isAdminMiddleware);