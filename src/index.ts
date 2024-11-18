// Bloxverse main file....
import axios from "axios";
import * as net from "net";
import * as fs from "fs";
import zlib from "zlib";

import * as path from "path";
import { UserConfig } from "./types/UserConfig";

import GameInstance, { Game } from "./Class/Game";
import PlayerManager from "./Class/PlayerManager";
import PacketHandler from "./PacketHandler/PacketHandler";
export { GameInstance };

export async function StartServer(config: UserConfig) {
  console.log("Starting server!");

  GameInstance.serverSettings = Object.assign(
    {},
    {
      ServerApi: "http://localhost:6920",
    }
  );
  GameInstance.customConfig = Object.assign({}, config);

  if (GameInstance.customConfig.map && GameInstance.customConfig.map)
    GameInstance.LoadMap();
  else console.log("Map/Map Dir is empty"); // i hope it shouldnt....

  if (config.localhost) console.log("Local Host Server");
  else {
    const { default: HostGame } = await import("./Utils/HostGame");

    var HostResponse = await HostGame(config);

    if (HostResponse.error) {
      console.error(HostResponse.error);
      return;
    }

    console.log(
      `Game is hosted at http://localhost:2000/games/${HostResponse.GameId}`
    );
    setInterval(() => HostGame(config), 60000);
  }

  server.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

// i cant just so .value as like javascript....
export interface ClientSocket extends net.Socket {
  IsAuth: boolean;
  User: PlayerManager;
}

const server = net.createServer((socket) =>
  clientServer(socket as ClientSocket)
);

async function clientServer(client: ClientSocket) {
  try {
    client.IsAuth = false;

    client.on("data", async (data) => {
      try {
        PacketHandler(data, client)
        // var parsedMessage = JSON.parse(message);

        //if (parsedMessage) {
        // gotta add this to the parser
        //if (!client.IsAuth && !GameInstance.customConfig.localhost) {
        //if (parsedMessage.type == "authToken") {
        //var VerifyResponse = await verifyToken(parsedMessage.data);
        //if (VerifyResponse && !VerifyResponse.error) {
        //   console.log("Connected user display " + VerifyResponse.displayName);
        //}
        // verifyToken first

        //} else client.destroy(); // yeah!
        //}

        //{
        //packetId
        //}

        // TODO: Add Parser...
        //}
      } catch (err) {
        console.log(err); // just if outof data client, modded responses
      }
    });

    client.on("end", () => {
      // remove player
    });

    client.on("error", (err) => {
      console.log(err);
    });
  } catch (err) {
    console.error(err);
  }
}
