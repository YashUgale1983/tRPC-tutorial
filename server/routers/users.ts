import { observable } from "@trpc/server/observable";
import {t} from "../trpc";
import {z} from "zod";
import { EventEmitter } from "stream";

// This is a way to create a procedure pipeline which can be used in multiple procedures
// Here, we have used zod for input validation
const userProcedure = t.procedure.input(z.object({userId: z.string()}));
// Here, we are creating an instance of event emitter to use websockets
const eventEmitter = new EventEmitter();

// Here, we are creating another router specifically for user related procedures
export const userRouter = t.router({
    get: userProcedure.query(({input})=>{
        return {id: input.userId}
    }),
    // .input(name) defined here is added to the .input(userId) defined in the userProcedure 
    update: userProcedure.input(z.object({name: z.string()})).mutation(req=>{
        console.log(`updating user ${req.input.userId} to have the name ${req.input.name}`);
        // Every time this procedure is called, an event is emitted called 'update' and some data is passed
        eventEmitter.emit("update", req.input.userId);
        return {
            id: req.input.userId,
            name: req.input.name,
            password: "sdfsdf"
        }
    }),
    // This procedure continuously listens to the WS server for 'update' event
    onUpdate: t.procedure.subscription(()=>{
        return observable<string>(emit=>{
            eventEmitter.on("update", emit.next);
            return ()=>{
                eventEmitter.off("update", emit.next);
            }
        })
    })
})