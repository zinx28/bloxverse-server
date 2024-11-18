import { ClientSocket, GameInstance } from "..";
import PlayerManager from "../Class/PlayerManager";
import verifyToken from "../Utils/verifyGame";

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
      console.log("Decompressed TOKEN (string):", token);
      const version = decompressedData.toString("utf-8", nullByteIndex + 1);
      console.log("Decompressed Version (string):", version);

      if (!client.IsAuth && !GameInstance.customConfig.localhost) {
        if (version != "1.0.0") {
          // need to grab the package version
          // need to send a message to the server
          return; // gulps
        }

        var VerifyResponse = await verifyToken(token);
        if (VerifyResponse && !VerifyResponse.error) {
            client.User = new PlayerManager(client);
            
            Object.defineProperties(client.User, {
                id: { value: VerifyResponse.displayName }
            })
            
            console.log("Connected user display " + client.User.id);
        }
      }

      // TODO: Spawn The Player
      break;

    default:
      console.log(`${packetType} is not supported`);
      break;
  }
}
