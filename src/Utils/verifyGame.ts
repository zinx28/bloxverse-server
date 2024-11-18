import axios from "axios";
import GameInstance from "../Class/Game";

export default async function verifyToken(token: string) {
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
    if (Json.error) {
      console.log(Json.error);
    }

    return response.data;
  } catch (err: any) {
    if (err.errors) {
      err.errors.forEach((singleError: any) => {
        console.error(
          `Address: ${singleError.address}:${singleError.port} | ${singleError.code}`
        );
      });
    }

    return {
      error: "Failed To Verify Token... Verify if token is correct / servers are up?",
    };
  }
}
