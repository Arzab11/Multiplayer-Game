const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

const createMap = require("./createMap");

const  RATE = 30;
const FAST = 5;
const SPEED = 7;

const input_id = {};
let bullets = []
let players = [];

function Speed(change) {
  for (const player of players) {
    const inputs = input_id[player.id];
    if (inputs.up) {
      player.y -= FAST;
    }
    else if (inputs.down) {
      player.y += FAST;
    }
    if (inputs.left) {
      player.x -= FAST;
    }
    else if (inputs.right) {
      player.x += FAST;
    }
  }

  for (const bullet of bullets) {
    bullet.x += Math.cos(bullet.angle) * SPEED;
    bullet.y += Math.sin(bullet.angle) * SPEED;
    bullet.time -= change;

    for (const x_player of players) {
      if (x_player.id === bullet.id) continue;
      const measurement = Math.sqrt(x_player.x + 11.5 - bullet.x) ** 2 + (x_player.y + 11.5 - bullet.y) ** 2; 
      if (measurement <= 11.5) {
        x_player.x = 0;
        x_player.y = 0;
        bullet.time = -1;
        break;
      }
    }
  }

  bullets = bullets.filter((bullet) => bullet.time > 0);

  io.emit("players", players);
  io.emit("bullets", bullets);
}

async function main() {

  const real_Map = await createMap();

  io.on('connect', (socket) => {
    console.log("user connected", socket.id);

    input_id[socket.id] = {
      up: false,
      down: false,
      left: false,
      right: false,
    }

    players.push({
      id: socket.id,
      x: 0,
      y: 0,
    });

    socket.emit("map", real_Map);

    socket.on('inputs', (inputs) => {
      input_id[socket.id] = inputs;
    });

    socket.on('bullets', (angle) => {
      const player = players.find((player) => player.id === socket.id);
      bullets.push({
        angle, 
        x: player.x,
        y: player.y,
        id: socket.id,
        time: 1000,
      });
    });

    socket.on('disconnect', () => {
      players = players.filter((player) => player.id !== socket.id);
    })
  });


  app.use(express.static("public"));

  httpServer.listen(5000);

  let update = Date.now();
  setInterval(() => {
    const now = Date.now();
    const change = now - update;
    Speed(change);
    update = now;
  }, 1000 / RATE);
}

main();


