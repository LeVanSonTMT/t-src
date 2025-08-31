import os from "os";
import fs from "fs";
import http from "http";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import cluster from "cluster";
import express from "express";
import bodyParser from "body-parser";

import { setupPaths } from "./src/constant/setupPaths";
import { initializeSocket } from "./src/constant/socketHandler";
import reAuthAccountActions from "./src/actions/reAuthAccountActions";

import helpers from "./src/common/helpers";
import reAuthAccountRedis from "./src/config/reAuthAccountRedis";

dotenv.config();

const app = express();

// Number of CPU cores of the system
const numCPUs = Number(process.env.NUM_CPU || 1);

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
};

// If this is the master process, create workers
if (cluster.isPrimary) {
	console.log(`Master process started. Number of CPU cores: ${numCPUs}`);

	// Fork workers for each CPU core
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	// When a worker fails, recreate a new worker
	cluster.on("exit", (worker: any, code: any, signal: any) => {
		console.log(`Worker ${worker.process.pid} died`);
		cluster.fork(); // Re-initialize workers when a worker dies
	});
} else {
	setTimeout(() => {
		if (helpers.convertStringToBoolean(process.env.ENABLE_RUN_OFFLINE || "")) {
			app.use(express.static(path.join(__dirname, "build")));
			app.get("/fe/*", (req, res) => {
				res.sendFile(path.join(__dirname, "build", "index.html"));
			});
		};

		app.use(express.json({ limit: "1000mb" }));
		app.use(express.urlencoded({ extended: true, limit: "1000mb" }));

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));

		app.use(
			cors({
				origin: "*",// [process.env.URL_FRONTEND],
				methods: ["GET", "POST", "DELETE"],
				exposedHeaders: [
					"X-Status",
					"X-Message",
					"X-File-Url",
					"X-File-Name",
					"X-File-Type",
				], // Allow write status and file name when export excel API
				// credentials: true, //pass header
			})
		);

		const server = http.createServer(app);

		if (helpers.convertStringToBoolean(process.env.ENABLE_CONSOLE_CALL_ANY_API || "")) {
			app.use((req, res, next) => {
				const timestamp = new Date();
				console.log(`User ${req.socket.remoteAddress} accessed at: ${timestamp}`, req.originalUrl);
				next();
			});
		};

		reAuthAccountRedis.on("ready", () => {
			console.log("Redis reAuthAccountRedis is connected, application can now start.");
		});

		reAuthAccountActions.loadReAuthAccountIntoCache();

		// Setting Path
		setupPaths(app);

		// Create Socket.IO
		initializeSocket(server);

		const port = Number(process.env.PORT_SERVER || 5001);
		if (helpers.convertStringToBoolean(process.env.ENABLE_RUN_OFFLINE || "")) {
			server.listen(port, process.env.IP_SERVER, () => {
				console.log(`App listening on port ${port}`);
			});
		} else {
			server.listen(port, () => {
				console.log(`App listening on port ${port}`);
			});
		}

		server.timeout = Number(process.env.TIMEOUT || 0);
	}, Number(process.env.SERVER_STARTUP_DELAY || 0));
};
