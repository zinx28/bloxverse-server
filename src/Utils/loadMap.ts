import { readdir, readdirSync, readFileSync } from "fs";
import { join } from "path";
import GameInstance, { GameBlocks } from "../Class/Game";
import { NodeVM } from "vm2";
import { Vector3 } from "../Class/Unity/Vector3";
import { Color } from "../Class/Unity/Color";

export default async function loadMap(mapPath: string): Promise<void> {
  try {
    console.log(mapPath);
    const ReadFile = await readFileSync(mapPath, "utf-8");

    if(ReadFile) {
      parseMapData(ReadFile);

      GameInstance.world.playerSpawn = GameInstance.world.blocks.filter(
        (block: GameBlocks) => block.type == "playerSpawn"
      )

      console.log(`Loaded Map with ${GameInstance.world.blocks.length} blocks`);
      console.log(`Map contains ${GameInstance.world.playerSpawn.length} spawns`);
      return Promise.resolve();
    }
   
  } catch (err) {
    console.error("FAILED TO LOAD SCRIPTS");
  }
}

// Map Parser (needs to be worked on)
function parseMapData(rawData: string) {

  const lines = rawData.split("\n");
  GameInstance.world.blocks = []; // empty the map

  for (const line of lines) {
    const parts = line.trim().split(" ");

    if (parts.length < 7) continue;

    const type = parts[0];
    
    const scale = new Vector3(
      parseFloat(parts[1]) || 1,
      parseFloat(parts[2]) || 1,
      parseFloat(parts[3]) || 1
    );

    const position = new Vector3(
      parseFloat(parts[4]) || 0,
      parseFloat(parts[5]) || 0,
      parseFloat(parts[6]) || 0
    );

    const color = new Color(
      parseFloat(parts[7]) || 128,
      parseFloat(parts[8]) || 128,
      parseFloat(parts[9]) || 128,
      parseFloat(parts[10]) || 0
    );

    GameInstance.world.blocks.push({ type, scale, position, color });
  }
};
