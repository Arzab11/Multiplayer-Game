const mapImage = new Image();
mapImage.src = '/grass.png';

const detective = new Image();
detective.src = '/detective.png';

const canvas_map = document.getElementById("canvas");
canvas_map.width = window.innerWidth;
canvas_map.height = window.innerHeight;
const canvas = canvas_map.getContext("2d");

const socket = io(`ws://localhost:5000`);

let map = [[]];
let players = [];
let bullets = [];

const TILE_SIZE = 16;

socket.on("connect", () => {
    console.log("connected");
});

socket.on('map', (createmap) => {
    map = createmap;
}) 

socket.on('players', (serverPlayers) => {
    players = serverPlayers;
});

socket.on('bullets', (serverBullets) => {
    bullets = serverBullets;  // Update the bullets array with the latest from the server
});

const inputs = {
    up: false,
    down: false,
    left: false,
    right: false,
};

window.addEventListener('keydown', (e) => {
    if (e.key === 'w') {
        inputs["up"] = true;
    }
    else if (e.key === 'a') {
        inputs["left"] = true;
    }
    else if (e.key === 's') {
        inputs["down"] = true;
    }
    else if (e.key === 'd') {
        inputs["right"] = true;
    }

    socket.emit("inputs", inputs);
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w') {
        inputs["up"] = false;
    }
    else if (e.key === 'a') {
        inputs["left"] = false;
    }
    else if (e.key === 's') {
        inputs["down"] = false;
    }
    else if (e.key === 'd') {
        inputs["right"] = false;
    }

    socket.emit("inputs", inputs);
});

window.addEventListener('click', (e) => {
    const angle = Math.atan2(e.clientY - canvas_map.height / 2, e.clientX - canvas_map.width / 2);
    socket.emit("bullets", angle);
});

function loop() {
    canvas.clearRect(0, 0, canvas_map.width, canvas_map.height);

    const cur_player = players.find((player) => player.id === socket.id);
    let perspective = 0;
    let perspective_y = 0;
    if (cur_player) {
        perspective = parseInt(cur_player.x - canvas_map.width / 2);
        perspective_y = parseInt(cur_player.y - canvas_map.height / 2);
    }
    const TILES_ROW = 8;

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[0].length; col++) {
            const { id } = map[row][col];
            const imageRow = parseInt(id / TILES_ROW);
            const imageCol = id % TILES_ROW;
            canvas.drawImage(mapImage, 
                imageCol * TILE_SIZE, 
                imageRow * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE,
                col * TILE_SIZE - perspective,
                row * TILE_SIZE - perspective_y,
                TILE_SIZE,
                TILE_SIZE
            );
        }
    }

    // Render players
    for (const player of players) {
        canvas.drawImage(detective, player.x - perspective, player.y - perspective_y);
    }

    for (const bullet of bullets) {
        canvas.fillStyle = "#FFFFF";  
        canvas.beginPath();
        canvas.arc(bullet.x - perspective, bullet.y - perspective_y, 3, 0, 2 * Math.PI);
        canvas.fill();
    }
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);