# bloxverse-server
just for npm gulp

- if any features requested ill add most likely

# Example

```js
const BloxServer = require("bloxverse-server");

BloxServer.StartServer({
  map: "test.map", // map name
  scripts: "./scripts", // user scripts folder
  map_dir: "./map", // map dir ? maybe different maps?!?!
  port: 8080, // server port
  server_data: {
    // max players (pretty sure its useless)
    max_players: 100, // should actually be data from the server
  },
  localhost: true, // Local host disable hostkey checks (anyone can join with ip/port (token is useless))
  host_key: "", // host_key
});
```