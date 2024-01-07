import { createTRPCProxyClient, createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import {AppRouter} from "../../server/server";

// Here, we create a websocket client to connect to the server
const wsClient = createWSClient({
  url:"ws://localhost:3000/trpc"
})

// We can call TRPC APIs using normal HTTP requests like any other REST API
// But to make use of TRPC's typesafety features, we need to create a client 
// which knows the procedures defined in the backend.
// For better understanding, think of it this way - it continuously listens to 
// the changes in the procedures in the backend and shows errors on the frontend
const client = createTRPCProxyClient<AppRouter>({
  // Links enable you to customize the flow of data between the tRPC Client and Server
  // httpLink is a terminating link that sends a tRPC operation to a tRPC procedure over HTTP.
  // httpBatchLink is a terminating link that batches an array of individual tRPC operations 
  // into a single HTTP request that's sent to a single tRPC procedure.
  links: [
    // splitLink checks for the type of operation 
    splitLink({
      condition: op=>{
        return op.type === "subscription"
      },
      // if it is a 'subscription', use websocket
      true: wsLink({
        client: wsClient
      }),
      // else use http batching
      false: httpBatchLink({
        url: "http://localhost:3000/trpc",
        headers: {"Authorization":"Token"}
      })
    }),
  ]
})

async function main() {
  client.users.onUpdate.subscribe(undefined, {
    onData: id=>{
      console.log("updated ", id);
      
    }
  })
}

main();