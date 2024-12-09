import { Socket } from "net";
import { EventEmitter } from "stream";
import { Vector3 } from "./Unity/Vector3";
import { Quaternion } from "./Unity/Quaternion";
import { ClientSocket, GameInstance } from "..";
import CameraController from "./CameraController";
import PacketBuilder from "../PacketHandler/PacketBuilder";
import { GAME_PACKET } from "../types/Enums";
import CharacterController from "./CharacterController";

export default class PlayerManager extends EventEmitter {
    id: string; // Player ID
    displayName: string; // Player Name
    health: number;
    socket: ClientSocket;
    camera: CameraController;
    character: CharacterController;
    isActive: boolean;

    constructor(socket: ClientSocket)
    {
        super()
        
        this.id = null!;
        this.displayName = null!;
      
        // camera
        this.health = 100;
        this.socket = socket;
        this.camera = new CameraController(socket);
        this.isActive = true; 
        // userinterface
        this.character = new CharacterController(socket);
    }



    SpawnMap(){
        // 3 LOAD MAP
        for (let i = 0; i < GameInstance.world.blocks.length; i++) {
            var brick = GameInstance.world.blocks[i];
            console.log(brick)
            new PacketBuilder(GAME_PACKET.SpawnMap)
            .write("string", brick.type)
            .write("vector3", brick.position)
            .write("vector3", brick.scale)
            .write("color", brick.color)
            // prob more things in the future
            .sendToClient(this.socket);
        }

        new PacketBuilder(GAME_PACKET.SpawnMap)
        .write("string", "BlocksEnd")
        .sendToClient(this.socket);
    }
}