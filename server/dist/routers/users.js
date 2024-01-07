"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const observable_1 = require("@trpc/server/observable");
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
const stream_1 = require("stream");
// This is a way to create a procedure pipeline which can be used in multiple procedures
// Here, we have used zod for input validation
const userProcedure = trpc_1.t.procedure.input(zod_1.z.object({ userId: zod_1.z.string() }));
// Here, we are creating an instance of event emitter to use websockets
const eventEmitter = new stream_1.EventEmitter();
// Here, we are creating another router specifically for user related procedures
exports.userRouter = trpc_1.t.router({
    get: userProcedure.query(({ input }) => {
        return { id: input.userId };
    }),
    // .input(name) defined here is added to the .input(userId) defined in the userProcedure 
    update: userProcedure.input(zod_1.z.object({ name: zod_1.z.string() })).mutation(req => {
        console.log(`updating user ${req.input.userId} to have the name ${req.input.name}`);
        // Every time this procedure is called, an event is emitted called 'update' and some data is passed
        eventEmitter.emit("update", req.input.userId);
        return {
            id: req.input.userId,
            name: req.input.name,
            password: "sdfsdf"
        };
    }),
    // This procedure continuously listens to the WS server for 'update' event
    onUpdate: trpc_1.t.procedure.subscription(() => {
        return (0, observable_1.observable)(emit => {
            eventEmitter.on("update", emit.next);
            return () => {
                eventEmitter.off("update", emit.next);
            };
        });
    })
});
