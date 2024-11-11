const tmx = require('tmx-parser');

module.exports = async () => {
    const map = await new Promise((resolve, reject) => {
        tmx.parseFile("./src/map1.tmx", function(err, loadedMap) {
          if (err) throw err;
          resolve(loadedMap);
        });
      })
    
      const layer = map.layers[0];
      const tiles = layer.tiles;
    
      const real_Map = [];
      for (let row = 0; row < map.height; row++) {
        const tile_row = []
        for (let col = 0; col < map.width; col++) {
          tile_row.push(tiles[row * map.height + col]);
        }
        real_Map.push(tile_row);
    }

    return real_Map;
}