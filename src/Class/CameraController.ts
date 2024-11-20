import { ClientSocket } from "..";
import PacketBuilder from "../PacketHandler/PacketBuilder";
import { GAME_PACKET } from "../types/Enums";
import { Quaternion } from "./Unity/Quaternion";
import { Vector3 } from "./Unity/Vector3";
import { EventEmitter } from "stream";

export enum CameraTypes {
  fixed = "Fixed", // Could be used for custom made spectating
  orbit = "Orbit",
  firstperson = "FirstPerson",
}

export default class CameraController extends EventEmitter {
  camerapos: Vector3;
  camerarot: Vector3;
  cameraType: string;

  socket: ClientSocket;

  constructor(socket: ClientSocket) {
    super();

    this.socket = socket;
    // data changed here won't replicate please use the functions binded to this
    this.camerapos = new Vector3(0.001322846, 0.4170581, 0.1029334);
    this.camerarot = new Quaternion(0.001322846, 0.4170581, 0.1029334);
    this.cameraType = CameraTypes.orbit;
    // TODO
    // doesnt effect fixed or firstperson (unless i skunked client)
    // CameraMinDistance
    // CameraMaxDistance
  }

  setCameraType(CameraTypeStr: string){
    const validType = Object.values(CameraTypes).find(
      (type) => type.toLowerCase() === CameraTypeStr.toLowerCase()
    );
  
    if (validType) {
      this.cameraType = validType as CameraTypes;

      new PacketBuilder(GAME_PACKET.PlayerUpdates)
      .write("string", "cameraType")
      .write("string", validType)
      .sendToClient(this.socket)
    } else {
      console.error(`Invalid CameraType: ${CameraTypeStr}`);
    }
  }

  // Camera POS AND Rotation only works if camera is set to fixed
  setCameraPosition(newPosition: Vector3) {
      this.camerapos = newPosition;

      new PacketBuilder(GAME_PACKET.PlayerUpdates)
      .write("string", "cameraPosition")
      .write("vector3", newPosition)
      .sendToClient(this.socket);
  }

  setCameraRotation(newRotation: Quaternion) {
    this.camerarot = newRotation;

    new PacketBuilder(GAME_PACKET.PlayerUpdates)
    .write("string", "cameraRotation")
    .write("quaternion", newRotation)
    .sendToClient(this.socket);
  }
}
