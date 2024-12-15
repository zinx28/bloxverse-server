import { EventEmitter } from "stream";
import PlayerManager from "./PlayerManager";
import { UserConfig } from "../types/UserConfig";
import path from "path";
import loadScripts from "../Utils/loadScripts";
import loadMap from "../Utils/loadMap";
import { Vector3 } from "./Unity/Vector3";
import { Color } from "./Unity/Color";
import PacketBuilder from "../PacketHandler/PacketBuilder";
import { GAME_PACKET } from "../types/Enums";

export interface GameBlocks {
  type: string;
  scale: Vector3;
  position: Vector3;
  color: Color;
}

export interface GameWorld {
  blocks: Array<GameBlocks>;
  gravity: number;
  playerSpawn: Array<GameBlocks>;
}

export interface ServerConfig {
  ServerApi: string;
}

export class Game extends EventEmitter {
  players: Array<PlayerManager>;
  world: GameWorld;
  serverSettings: ServerConfig;
  customConfig: UserConfig;

  constructor() {
    super();

    // any data changed in players dont replicate (functions only!!)
    // changing data may break function searching
    this.players = [];

    this.world = {
      blocks: [],
      gravity: 10.0,
      playerSpawn: [],
    };
    this.serverSettings = null!;
    this.customConfig = null!;
  }

  async LoadMap() {
    const projectRoot = require.main?.filename
      ? path.dirname(require.main.filename)
      : null;

    if (!projectRoot) {
      console.error("Cannot determine project root.");
      process.exit(1);
    }

    if (this.customConfig.scripts)
      await loadScripts(path.join(projectRoot, this.customConfig.scripts));

    if (this.customConfig.map_dir && this.customConfig.map)
      await loadMap(
        path.join(projectRoot, this.customConfig.map_dir, this.customConfig.map)
      );
  }

  OtherClients(player: PlayerManager) {
    this.players.forEach((client) => {
      if (!client.socket.destroyed && !client.socket.closed) {
        if (player != client) {
          new PacketBuilder(GAME_PACKET.SpawnPlayer)
            .write("int", client.id)
            .write("vector3", client.character.position)
            .write("quaternion", client.character.rotation)
            .write("string", JSON.stringify(client.character.equippedItems))
            .write("string", client.displayName)
            .sendToClient(player.socket);
        }
      }
    });
  }

  async NewPlayer(player: PlayerManager) {
    // Need to see if this player is already in the game if so kick the current user
    // if not
    const existingSession = this.players.find((e) => e.id == player.id);
    if (existingSession) {
      if (existingSession.socket && !existingSession.socket.destroyed) {
        console.log("Someone joind the server on a different device");
        new PacketBuilder(GAME_PACKET.Kick)
          .write("string", "Someone has joined on a different device")
          .sendToClient(existingSession.socket);

        existingSession.socket.destroy();
        // disconnect user
      }

      // remove it from the players array
      const index = this.players.indexOf(existingSession);
      if (index !== -1) {
        this.players.splice(index, 1);
      }
    }

    // add the new player!
    this.players.push(player);

    this.OtherClients(player); // LOAD OTHER PLAYERS ON OTHER SCREENS

    player.SpawnMap();

    console.log("E " + player.character.equippedItems);
    // Spawn Player (ONLY CLIENT JOINING)
    new PacketBuilder(GAME_PACKET.SpawnPlayer)
      .write("int", player.id)
      .write("vector3", player.character.position)
      .write("quaternion", player.character.rotation)
      .write("string", JSON.stringify(player.character.equippedItems))
      // CAMERA TYPE
      .write("string", player.camera.cameraType)
      .sendToClient(player.socket);

    // Spawn Player (ALL CLIENTS) ~ CAMERA STUFF SHOULDNT BE INCLUDED
    new PacketBuilder(GAME_PACKET.SpawnPlayer)
      .write("int", player.id)
      .write("vector3", player.character.position)
      .write("quaternion", player.character.rotation)
      .write("string", JSON.stringify(player.character.equippedItems))
      .write("string", player.displayName)
      .sendToAllClientsExcept([player.socket]);

    this.emit("playerJoin", player);
  }
}

const GameInstance = new Game();
export default GameInstance;
