import { EventEmitter } from "stream";
import { ClientSocket, GameInstance } from "..";
import { Vector3 } from "./Unity/Vector3";
import { Quaternion } from "./Unity/Quaternion";
import { Color } from "./Unity/Color";

export default class CharacterController extends EventEmitter {
    socket: ClientSocket;
    position: Vector3;
    rotation: Quaternion;
    equippedItems: { [part: string]: { item: string; color: Color } };

    constructor(socket: ClientSocket) {
        super()

        this.socket = socket;

        this.position = new Vector3(0, 1, 0);
        this.rotation = new Quaternion(0, 0, 0, 0);

        this.equippedItems = {
            head: { item: "", color: new Color(255,229,180,0) },
            torso: { item: "", color: new Color(255,229,180,0) },
            leftArm: { item: "", color: new Color(255,229,180,0) },
            rightArm: { item: "", color: new Color(255,229,180,0) },
            leftLeg: { item: "", color: new Color(255,229,180,0) },
            rightLeg: { item: "", color: new Color(255,229,180,0) },
        };
    }
}