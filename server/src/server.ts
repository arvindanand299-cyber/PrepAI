import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import http from "http";
import serverless from "serverless-http";

const port = process.env.PORT || 8000;

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports.handler = serverless(app);