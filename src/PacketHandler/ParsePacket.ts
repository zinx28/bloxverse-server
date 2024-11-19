import { ClientSocket, GameInstance } from "..";
import PlayerManager from "../Class/PlayerManager";
import verifyToken from "../Utils/verifyGame";
import PacketBuilder from "./PacketBuilder";


// LOCAL HOST DATA ONLY
let PlayerID = 0;
//

export default async function parsePacket(
  packetType: number,
  decompressedData: Buffer,
  client: ClientSocket
) {
  const nullByteIndex = decompressedData.indexOf(0);

  if (packetType != 1 && !client.IsAuth) return; // not auth

  switch (packetType) {
    case 1: // Auth Packet
      const token = decompressedData.toString("utf-8", 0, nullByteIndex);
      const version = decompressedData.toString("utf-8", nullByteIndex + 1);

      // THIS IS REQUIRED NO MATTER WHAT.
      if (version != "1.0.0") {
        // need to grab the package version
        // need to send a message to the server
        return; // gulps
      }

      var PlayerData = new PlayerManager(client);
      if (!client.IsAuth) {
        if (!GameInstance.customConfig.localhost) {
          var VerifyResponse = await verifyToken(token, client);

          if (VerifyResponse) {
            if (typeof VerifyResponse === "string") {
              console.log(VerifyResponse);
              return;
            }

            Object.defineProperties(PlayerData, {
              id: { value: VerifyResponse.playerID },
              displayName: { value: VerifyResponse.playerDisplayName },
            });
          } else {
            return;
          }
        } else {
          PlayerID++
          Object.defineProperties(PlayerData, {
            id: { value: PlayerID },
            displayName: { value: `Player ${PlayerID}` },
          });
        }
        
        client.IsAuth = true;
        client.User = PlayerData;

            // 1 is AUTH
        new PacketBuilder(1)
        .write("int", client.User.id)
        .write("string", client.User.displayName)
        .write("int", GameInstance.world.blocks.length)
        .sendToClient(client.User.socket);

        GameInstance.NewPlayer(client.User); // New Player!
      }

      // TODO: Spawn The Player

      // TEST stuff
      //const packet = new PacketBuilder(69)
      //.write("string", "test fdrfr")
      //.write("string", "Ohhh crappp")
      //.write("bool", true)
      //.write("float", 3.14)
      //.write("int", 42)
      //.write("uint8", 255)
      //.write("uint16", 65535)
      //.sendToClient(client);
      //.build();

      break;

    default:
      console.log(`${packetType} is not supported`);
      break;
  }
}
