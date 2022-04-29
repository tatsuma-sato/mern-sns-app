require("dotenv").config();
require("express-async-errors");
const express = require("express");
const colors = require("colors");

const path = require("path");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const cloudinary = require("cloudinary").v2;
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");

connectDB();

// Security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

// aplication initialization
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// const start = async () => {
//   try {
//     await connectDB(process.env.MONGO_URI);
//     server.listen(PORT, () => {
//       console.log(`Server is running on ${PORT}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use('/api/posts',postRoute)

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
