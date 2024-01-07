"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
// context holds data that all of your tRPC procedures will have access to, and is a 
// great place to put things like database connections or authentication information.
// Here, we have created a context and given it initial structure
function createContext() {
    return {
        isAdmin: false
    };
}
exports.createContext = createContext;
