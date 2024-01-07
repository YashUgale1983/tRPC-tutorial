

// context holds data that all of your tRPC procedures will have access to, and is a 
// great place to put things like database connections or authentication information.
// Here, we have created a context and given it initial structure
export function createContext(){
    return {
        isAdmin: false
    }
}