import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./utils/envalid";
import mongoose from "mongoose";
import { errorHandler } from "./controllers/errorsController";
import { userRoutes } from "./routes/userRoutes";
import { listingRoutes } from "./routes/listingRoutes";
import { assetRoutes } from "./routes/assetRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { paymentRoutes } from "./routes/paymentRoutes";
import { Server } from "socket.io";
import { sendMessage } from "./controllers/conversationsControllers";
import { conversationRoutes } from "./routes/conversationRoutes";
import { notificationRoutes } from "./routes/notificationRoutes";
import { identityRoutes } from "./routes/identityPhotoRoutes";
import { reservationRoutes } from "./routes/reservationRoutes";
import { bookingRequestRoutes } from "./routes/bookingRequestRoutes";

const app = express();
const server = app
  .listen(env.PORT, () => console.log("Listening to port", env.PORT))
  .once("listening", () =>
    mongoose.connect(env.MONGO_COMPASS_URI).then(() => {
      console.log("Connected to database");
    })
  );

const io = new Server(server, {
  cors: {
    origin: [env.CLIENT_URL, env.ADMIN_URL],
    credentials: true,
  },
});

type TActiveUsers = {
  name: string;
  uid: string;
  socketId: string;
};

let onlineUsers: TActiveUsers[] = [];

function getActiveUsers({ name, uid, socketId }: TActiveUsers) {
  !onlineUsers.some((user) => user.name === name) &&
    onlineUsers.push({ name, uid, socketId });
}

function removeActiveUser(name: string) {
  return (onlineUsers = onlineUsers.filter((user) => user.name != name));
}

function findActiveUser(host: string) {
  return onlineUsers.find((user) => host === user.name);
}

function removeUser(socketId: string) {
  return (onlineUsers = onlineUsers.filter(
    (user) => user.socketId !== socketId
  ));
}

app.get("/", (req, res, next) => {
  res.send("HEllo");
});

io.on("connection", (socket) => {
  socket.on("user-connect", (data) => {
    getActiveUsers({
      name: data.name,
      uid: data.uid,
      socketId: socket.id,
    });
  });

  socket.on("chat-message", async (data) => {
    const activeUser = findActiveUser(data.receiverName);
    if (activeUser) {
      const res = await sendMessage(data);
      io.to(activeUser.socketId).emit("receive-message", res);
    } else {
      await sendMessage(data);
    }
  });

  socket.on("send-bookingRequest", (data) => {
    const activeUser = findActiveUser(data.receiverName);
    console.log(data);
    if (activeUser) {
      io.to(activeUser.socketId).emit(
        "send-hostNotification",
        data.newHostNotification
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
    socket.on("user-logout", (name) => {
      removeActiveUser(name);
      socket.disconnect();
    });
  });
});

// import ipinfoMiddleware, { defaultIPSelector } from "ipinfo-express";
// app.use(
//   ipinfoMiddleware({
//     token: env.IPINFO_TOKEN,
//     ipSelector: defaultIPSelector,
//     cache: null,
//     timeout: 5000,
//   })
// );

app.use(cookieParser());
app.use(cors({ origin: [env.CLIENT_URL, env.ADMIN_URL], credentials: true }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use("/api", userRoutes);
app.use("/api", listingRoutes);
app.use("/api", assetRoutes);
app.use("/api", adminRoutes);
app.use("/api", paymentRoutes);
app.use("/api", conversationRoutes);
app.use("/api", notificationRoutes);
app.use("/api", identityRoutes);
app.use("/api", reservationRoutes);
app.use("/api", bookingRequestRoutes);
app.use(errorHandler);
