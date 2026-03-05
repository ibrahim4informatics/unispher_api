 
// or whatever your payload type is

declare global {
  namespace Express {
    interface Request {
      user?: any; // 👈 your custom type
    }
  }
}

export {};