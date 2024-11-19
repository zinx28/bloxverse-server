import { Vector3 } from "./Unity/Vector3";
import { EventEmitter } from "stream";

export enum CameraTypes {
  fixed = "Fixed", // Could be used for custom made spectating
  orbit = "Orbit",
  firstperson = "FirstPerson",
}

export default class CameraController extends EventEmitter {
  camera: Vector3;
  cameraType: string;

  constructor() {
    super();

    //
    this.camera = new Vector3(0.001322846, 0.4170581, 0.1029334);
    this.cameraType = CameraTypes.orbit;
    // TODO
    // doesnt effect fixed or firstperson (unless i skunked client)
    // CameraMinDistance
    // CameraMaxDistance
  }

  // Camera POS AND Rotation only works if camera is set to fixed
  //setCameraPosition(playerId, newPosition) {
  //    console.log(`Camera for ${playerId} moved to: ${newPosition}`);
  //}

  //setCameraRotation(playerId, newRotation) {
  //    console.log(`Camera for ${playerId} rotated to: ${newRotation}`);
  //}
}
