import axios from "axios";
import { UserConfig } from "../types/UserConfig";
import GameInstance from "../Class/Game";

export default async function HostGame(data: UserConfig) {
  try {
    const response = await axios.post(
      `${GameInstance.serverSettings.ServerApi}/api/v1/hosting/games/post`,
      {},
      {
        headers: {
          hostKey: data.host_key,
          hostPort: data.port,
        },
      }
    );

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
      error: "Failed To Connect To Server",
    };
  }
}
