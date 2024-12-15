import axios from "axios";
import GameInstance from "../Class/Game";
import { ClientSocket } from "..";
import PlayerManager from "../Class/PlayerManager";
import { UserData } from "../types/UserData";

// Temp data

export default async function verifyToken(
  token: string,
  client: ClientSocket
): Promise<Partial<UserData> | string> {
  try {
    const response = await axios.post(
      `${GameInstance.serverSettings.ServerApi}/api/v1/verifyToken`,
      {},
      {
        headers: {
          UsersToken: token,
          GamesToken: GameInstance.customConfig.host_key,
        },
      }
    );

    var Json = response.data;

    if (typeof Json === "string") {
      //TODO KICK THE PLAYER
      return "FAILED TO AUTHORIZE USER";
    }

    if (Json.error) {
      console.log(Json.error);

      return Json.error;
    } else {
      const userData: Partial<UserData> = {
        playerID: Json.userId,
        playerDisplayName: Json.displayName,
        character: Json.character
      };

      return userData;
    }
  } catch (err: any) {
    if (err.errors) {
      err.errors.forEach((singleError: any) => {
        console.error(
          `Address: ${singleError.address}:${singleError.port} | ${singleError.code}`
        );
      });
    }

    return "Failed To Verify Token... Verify if token is correct / servers are up?";
  }
}
