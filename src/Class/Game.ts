import { EventEmitter } from "stream";
import PlayerManager from "./PlayerManager";
import { UserConfig } from "../types/UserConfig";
import path from "path";
import loadScripts from "../Utils/loadScripts";
import loadMap from "../Utils/loadMap";
import { Vector3 } from "./Unity/Vector3";
import { Color } from "./Unity/Color";
import PacketBuilder from "../PacketHandler/PacketBuilder";

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

  async NewPlayer(player: PlayerManager) {
    this.players.push(player);

    player.SpawnMap();

    // Spawn Player (ALL CLIENTS)
    new PacketBuilder(2)
    .write("int", player.id)
    .write("vector3", player.position)
    .write("quaternion", player.rotation)
    // CAMERA TYPE
    .write("string", player.cameracontroller.cameraType)
    .sendToClient(player.socket);

    // Spawn Player (ALL CLIENTS) ~ CAMERA STUFF SHOULDNT BE INCLUDED
      new PacketBuilder(2)
      .write("int", player.id)
      .write("vector3", player.position)
      .write("quaternion", player.rotation)
      .sendToAllClientsExcept([player.socket]);
    
    this.emit("playerJoin", player);
  }
}

const GameInstance = new Game();
export default GameInstance;
