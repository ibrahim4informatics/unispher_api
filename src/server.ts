import { createServer } from "node:http";
import app from "./app";


const PORT=3000;
const server = createServer(app);

server.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})