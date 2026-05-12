import { createServer } from "node:http";
import app from "./app";
import { Server, Socket } from "socket.io";
import { verifyAccessToken } from "./auth/auth.utils";
import { createMessage } from "./messages/messages.services";
import db from "./config/db";


const PORT = process.env.PORT || 3000;
const server = createServer(app);

server.listen(PORT, () => {
    console.log(`server is running on  ${PORT}`)
})


const io = new Server(server, {
    transports: ["websocket"],
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH"],
    },

});

io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token; // safer optional chaining

    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    try {
        const payload = verifyAccessToken(token); // your custom JWT verify
        socket.data.user = payload; // store user info
        next(); // allow connection
    } catch (err) {
        next(new Error("Authentication error: Invalid token"));
    }
});
io.on("connection", (socket) => {
    console.log("a user connected");
    console.log(socket.data.user)
    socket.join(socket.data.user.id); // join a room with user ID for private messaging
    socket.on("enter-chat", async (chat_id) => {
        console.log("join room")
        socket.join(chat_id);
        await db.chatParticipant.update({ where: { user_id_chat_id: { user_id: socket.data.user.id, chat_id:parseInt(chat_id) } }, data: { last_read_at: new Date() } });
    })
    socket.on("leave-chat", (chat_id) => {
        socket.leave(chat_id);
    })

    socket.on("send-message", async (message) => {
        // message should contain chat_id and text
        const { chat_id, text } = message;
        console.log("send")
        // create message in database and get the created message with id and timestamps
        const msg = await createMessage({ chat_id, text, sender_id: socket.data.user.id});
        await db.chat.update({ where: { id: chat_id }, data: { last_message_id: msg.id } });
        await db.chatParticipant.update({ where: { user_id_chat_id: { user_id: socket.data.user.id, chat_id } }, data: { last_read_at: new Date() } });
        const { sender_id, created_at, id } = msg;
        io.to(chat_id.toString()).emit("new-message", { text, sender_id, chat_id, created_at, id });

    })
    socket.on("disconnect", () => {
        console.log("user disconnected");
    })
})

export default server;