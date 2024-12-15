export interface UserData {
    playerID: string;
    playerDisplayName: string;
    character: {
      headColor: string;
      torsoColor: string;
      leftArmColor: string;
      rightArmColor: string;
      leftLegColor: string;
      rightLegColor: string;
  
      head: { item: string | "" };
      torso: { item: string | "" };
      leftArm: { item: string | "" };
      rightArm: { item: string | ""};
      leftLeg: { item: string | ""};
      rightLeg: { item: string | ""};
    }
  }
  