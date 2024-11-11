This is a simple multiplayer tile-based shooter game built using Node.js, Socket.io, and HTML5 Canvas. Players move around a map, shoot bullets in a direction, and interact with other players. The game features real-time updates and multiplayer interactions.

Features

Multiplayer: Multiple players can join the same game and interact with each other in real-time.
Tile-based map: The game map is made up of tiles, dynamically rendered based on a map file.
Player movement: Players can move in four directions (up, down, left, right) using the WASD keys.
Shooting mechanics: Players can shoot bullets in a direction by clicking the mouse. Bullets will move across the screen and can hit other players.
Collision detection: Bullets interact with players, and when a bullet hits a player, the player is "eliminated" (reset to position 0,0).
Tech Stack
Node.js: The server is built using Node.js, handling socket connections, game logic, and player management.
Socket.io: Real-time communication is handled using Socket.io, allowing players to interact with the game.
HTML5 Canvas: The front-end game rendering is handled by HTML5's Canvas API.
TMX Map Parsing: The game uses a tile-based map defined in a .tmx (Tiled) format, parsed and rendered using the tmx-parser package.
