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
  cameraFov: number;
  socket: ClientSocket;

  currentZoom: number;
  maxZoom: number;
  minZoom: number;

  constructor(socket: ClientSocket) {
    super();

    this.socket = socket;
    // data changed here won't replicate please use the functions binded to this
    this.camerapos = new Vector3(0.001322846, 0.4170581, 0.1029334);
    this.camerarot = new Quaternion(0.001322846, 0.4170581, 0.1029334);
    this.cameraType = CameraTypes.orbit;
    this.cameraFov = 85;

    this.currentZoom = 7; // isnt replicated
    this.maxZoom = 7;
    this.minZoom = 0; // gulp
    // TODO
    // doesnt effect fixed or firstperson (unless i skunked client)
    // CameraMinDistance
    // CameraMaxDistance
  }

  setCameraType(CameraTypeStr: string) {
    const validType = Object.values(CameraTypes).find(
      (type) => type.toLowerCase() === CameraTypeStr.toLowerCase()
    );

    if (validType) {
      this.cameraType = validType as CameraTypes;

      new PacketBuilder(GAME_PACKET.PlayerUpdates)
        .write("string", "cameraType")
        .write("string", validType)
        .sendToClient(this.socket);
    } else {
      console.error(`Invalid CameraType: ${CameraTypeStr}`);
    }
  }

  // Camera POS AND Rotation only works if camera is set to fixed
  //newPosition: Vector3
  setCameraPosition(x = 0, y = 0, z = 0) {
    this.camerapos = new Vector3(x, y, z);

    new PacketBuilder(GAME_PACKET.PlayerUpdates)
      .write("string", "cameraPosition")
      .write("vector3", this.camerapos)
      .sendToClient(this.socket);
  }

  // Don't use this in a loop (ofc <3)
  setCameraSmoothPosition(x = 0, y = 0, z = 0, smoothValue = 5) {
    this.camerapos = new Vector3(x, y, z);

    new PacketBuilder(GAME_PACKET.PlayerUpdates)
      .write("string", "cameraSmoothPosition")
      .write("vector3", this.camerapos)
      .write("float", smoothValue)
      .sendToClient(this.socket);
  }

  // Makes Camera Connect To A Object... ~ client sided
  // Call this once !
  // set block to "null" ~ not connected to anything
  // set block to "" ~ defaults back to players head
  setCameraPartAnchor(block: string, smoothValue = 5) {
    // fixed is recommended (due other features may get enabled)
    console.log(block);

    new PacketBuilder(GAME_PACKET.PlayerUpdates)
      .write("string", "cameraSetPartAnchor")
      .write("string", block)
      .write("float", smoothValue)
      .sendToClient(this.socket);
  }

  //newRotation: Quaternion
  setCameraRotation(x = 0, y = 0, z = 0 /*, w = 0*/) {
    this.camerarot = new Vector3(x, y, z /*, w*/);

    new PacketBuilder(GAME_PACKET.PlayerUpdates)
      .write("string", "cameraRotation")
      .write("vector3", this.camerarot)
      .sendToClient(this.socket);
  }

  setCameraMaxDistance(maxValue = 10) {
    if (maxValue < 0) maxValue = 0;

    if (maxValue < this.minZoom) {
      console.error("Max zoom cant be under min value");
      return;
    }

    this.maxZoom = maxValue;

    new PacketBuilder(GAME_PACKET.PlayerUpdates)
      .write("string", "cameraMaxDistance")
      .write("float", maxValue)
      .sendToClient(this.socket);
  }

  setCameraMinDistance(minValue = 10) {
    if (minValue < 0) minValue = 0;

    if (minValue > this.maxZoom) {
      console.error("Min zoom cant be above max value");
      return;
    }

    this.minZoom = minValue;

    new PacketBuilder(GAME_PACKET.PlayerUpdates)
      .write("string", "cameraMinDistance")
      .write("float", minValue)
      .sendToClient(this.socket);
  }

  setCameraDistance(value: number) {
    if (value < 0) value = 0;

    if (value > this.maxZoom) {
      console.error("Value cant be above max value");
      return;
    }

    if (value < this.minZoom) {
      console.error("Value cant be below min value");
      return;
    }

    this.currentZoom = value;

    new PacketBuilder(GAME_PACKET.PlayerUpdates)
      .write("string", "cameraDistance")
      .write("float", value)
      .sendToClient(this.socket);
  }

  setCameraFov(FOV = 85) {
    this.cameraFov = FOV;

    new PacketBuilder(GAME_PACKET.PlayerUpdates)
      .write("string", "cameraFov")
      .write("float", this.cameraFov)
      .sendToClient(this.socket);
  }
}
