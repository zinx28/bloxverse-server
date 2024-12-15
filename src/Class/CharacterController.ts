import { EventEmitter } from "stream";
import { ClientSocket, GameInstance } from "..";
import { Vector3 } from "./Unity/Vector3";
import { Quaternion } from "./Unity/Quaternion";
import { Color } from "./Unity/Color";
import { UserData } from "../types/UserData";

export default class CharacterController extends EventEmitter {
  socket: ClientSocket;
  position: Vector3;
  rotation: Quaternion;
  equippedItems: { [part: string]: { item: string; color: Color } };

  constructor(socket: ClientSocket) {
    super();

    this.socket = socket;

    this.position = new Vector3(0, 1, 0);
    this.rotation = new Quaternion(0, 0, 0, 0);

    this.equippedItems = {
      head: { item: "", color: new Color(255, 229, 180, 0) },
      torso: { item: "", color: new Color(255, 229, 180, 0) },
      leftArm: { item: "", color: new Color(255, 229, 180, 0) },
      rightArm: { item: "", color: new Color(255, 229, 180, 0) },
      leftLeg: { item: "", color: new Color(255, 229, 180, 0) },
      rightLeg: { item: "", color: new Color(255, 229, 180, 0) },
    };
  }

  // should also be reused on respawning (just need to replicate it!)
  updateEquipedItems(items: UserData["character"] | null) {
    if (items != null) {
        this.equippedItems["head"].item = items.head.item;
        this.equippedItems["head"].color = new Color().hexToRgba(items.headColor);
        this.equippedItems["torso"].item = items.torso.item;
        this.equippedItems["torso"].color = new Color().hexToRgba(items.torsoColor);
        this.equippedItems["leftArm"].item = items.leftArm.item;
        this.equippedItems["leftArm"].color = new Color().hexToRgba(items.leftArmColor);
        this.equippedItems["rightArm"].item = items.rightArm.item;
        this.equippedItems["rightArm"].color = new Color().hexToRgba(items.rightArmColor);
        this.equippedItems["leftLeg"].item = items.leftLeg.item;
        this.equippedItems["leftLeg"].color = new Color().hexToRgba(items.leftLegColor);
        this.equippedItems["rightLeg"].item = items.rightLeg.item;
        this.equippedItems["rightLeg"].color = new Color().hexToRgba(items.leftLegColor);
    }
  }
}   
