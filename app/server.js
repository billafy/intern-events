/* central server setup */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");

const socketConnection = require("./socket/socketConnection");
const { authenticateToken } = require("./utils/auth");

const accountsRouter = require("./routers/accountsRouter");
const internshipsRouter = require("./routers/internshipsRouter");
const socialRouter = require("./routers/socialRouter");

require("dotenv").config();

/* app configurations */

const app = express();
const port = process.env.PORT || 5000;

/* middlewares */

app.use(
	cors({
		origin: [
			"https://restify.vercel.app",
			"http://localhost:3000",
			"https://internly.vercel.app",
		],
		credentials: true,
		sameSite: "None",
		secure: true,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("media"));

/* mongodb database connection */

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});
mongoose.connection.on("error", () => {
	console.log("Error connecting to database");
});
mongoose.connection.on("open", () => {
	console.log("Connected to database");
});

/* api */

app.use("/accounts", accountsRouter);
app.use("/internships", internshipsRouter);
app.use("/social", socialRouter);

/* making the app listen to a port */

const server = app.listen(port, () => {
	console.log(`App listening port ${port}`);
});

/* socket */

const io = socketIo(server);
io.on("connection", socketConnection);

module.exports = app;
