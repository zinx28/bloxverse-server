import { Socket } from "net";
import { EventEmitter } from "stream";
import { Vector3 } from "./Unity/Vector3";
import { Quaternion } from "./Unity/Quaternion";
import { ClientSocket } from "..";

export default class PlayerManager extends EventEmitter {
    id: string; // Player ID
    displayName: string; // Player Name
    position: Vector3;
    rotation: Quaternion;
    health: number;
    socket: ClientSocket;
    isActive: boolean;

    constructor(socket: ClientSocket)
    {
        super()

        this.id = null!;
        this.displayName = null!;
        this.position = new Vector3(0, 1, 0);
        this.rotation = new Quaternion(0, 0, 0, 0);
        // camera
        this.health = 100;
        this.socket = socket;
        this.isActive = true; 
        // userinterface
    }
}