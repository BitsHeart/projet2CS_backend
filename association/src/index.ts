import * as dotenv from 'dotenv'
dotenv.config()
import { createServer } from 'http';

import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import * as express from 'express';
import { createClient } from 'redis'
import * as cors from 'cors';
import * as morgan from 'morgan';
import { Server, ServerOptions } from 'socket.io'
import initConnection from './routes'


const app = express()

// using various middlewares
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

// creating an http server to use with socket.io
const server = createServer(app);

// initialising socket.io server
const options: Partial<ServerOptions> = {
    path: "/socket",
};

const socket = new Server(server, options);

const redisClient = createClient({
    host: "Projet2csCache.redis.cache.windows.net",
    port: 6379,
    auth_pass: "gcDPcPY0B3s4oi5VJjyJuEuOmrIWviiy8psJsDyEoro="
});

initConnection(socket, app, redisClient);

// starting http server
createConnection()
.then(async (_connection: Connection) => {
    server.listen(process.env.PORT || 8001, () => {
        console.log("server started.")
    })
})
.catch((error) => {console.log(error)})