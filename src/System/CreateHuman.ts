import {
  b2Body,
  b2BodyType,
  b2DegToRad,
  b2RevoluteJointDef,
  b2Vec2,
  b2World,
} from "box2d.ts";
import { parseJsonText } from "typescript";
import { physicWorld } from "../GameScreen/GameScreen";
import {
  head,
  leftArm,
  lowerLeftLeg,
  lowerRightLeg,
  rightArm,
  torso1,
  torso2,
  torso3,
  upperLeftLeg,
  upperRightLeg,
} from "./utils";

export enum HumanPartType {
  Head = 0,
  Torso1,
  Torso2,
  Torso3,
  leftArm,
  rightArm,
  upperLeftLeg,
  upperRightLeg,
  lowerLeftLeg,
  lowerRightLeg,
}
export interface HumanRig {
  parts: b2Body[];
}

export function human(
  physicWorld: b2World,
  startX: number,
  startY: number
): HumanRig {
  const humanRig: HumanRig = {
    parts: [],
  };
  humanRig.parts.push(head(physicWorld, startX, startY));
  humanRig.parts.push(torso1(physicWorld, startX, startY));
  humanRig.parts.push(torso2(physicWorld, startX, startY));
  humanRig.parts.push(torso3(physicWorld, startX, startY));
  humanRig.parts.push(leftArm(physicWorld, startX, startY));
  humanRig.parts.push(rightArm(physicWorld, startX, startY));
  humanRig.parts.push(upperLeftLeg(physicWorld, startX, startY));
  humanRig.parts.push(upperRightLeg(physicWorld, startX, startY));
  humanRig.parts.push(lowerLeftLeg(physicWorld, startX, startY));
  humanRig.parts.push(lowerRightLeg(physicWorld, startX, startY));

  const jd = new b2RevoluteJointDef();
  // Head to shoulders
  jd.lowerAngle = b2DegToRad(0);
  jd.upperAngle = b2DegToRad(0);
  jd.Initialize(
    humanRig.parts[HumanPartType.Torso1],
    humanRig.parts[HumanPartType.Head],
    new b2Vec2(startX, startY - 1.5 / 10)
  );
  jd.enableLimit = true;
  physicWorld.CreateJoint(jd);

  // Upper arm to shoulders
  // L
  jd.lowerAngle = b2DegToRad(-85.0);
  jd.upperAngle = b2DegToRad(130.0);
  jd.Initialize(
    humanRig.parts[HumanPartType.Torso1],
    humanRig.parts[HumanPartType.leftArm],
    new b2Vec2(startX - 1.8 / 10, startY - 2.0 / 10)
  );
  physicWorld.CreateJoint(jd);
  jd.enableLimit = true;

  // R
  jd.lowerAngle = b2DegToRad(-130.0);
  jd.upperAngle = b2DegToRad(85.0);
  jd.Initialize(
    humanRig.parts[HumanPartType.Torso1],
    humanRig.parts[HumanPartType.rightArm],
    new b2Vec2(startX + 1.8 / 10, startY - 2.0 / 10)
  );
  physicWorld.CreateJoint(jd);
  jd.enableLimit = true;

  // Lower arm to upper arm
  // L
  jd.lowerAngle = b2DegToRad(-130.0);
  jd.upperAngle = b2DegToRad(10.0);
  physicWorld.CreateJoint(jd);
  jd.enableLimit = true;

  // R
  jd.lowerAngle = b2DegToRad(-10.0);
  jd.upperAngle = b2DegToRad(130.0);
  physicWorld.CreateJoint(jd);
  jd.enableLimit = true;

  // Shoulders/stomach
  jd.lowerAngle = b2DegToRad(-15.0);
  jd.upperAngle = b2DegToRad(15.0);
  jd.Initialize(
    humanRig.parts[HumanPartType.Torso1],
    humanRig.parts[HumanPartType.Torso2],
    new b2Vec2(startX, startY - 3.5 / 10)
  );
  physicWorld.CreateJoint(jd);
  // Stomach/hips
  jd.Initialize(
    humanRig.parts[HumanPartType.Torso2],
    humanRig.parts[HumanPartType.Torso3],
    new b2Vec2(startX, startY - 5.0 / 10)
  );
  physicWorld.CreateJoint(jd);
  jd.enableLimit = true;

  // Torso to upper leg
  // L
  jd.lowerAngle = b2DegToRad(-25.0);
  jd.upperAngle = b2DegToRad(45.0);
  jd.Initialize(
    humanRig.parts[HumanPartType.Torso3],
    humanRig.parts[HumanPartType.upperLeftLeg],
    new b2Vec2(startX - 0.8 / 10, startY - 7.2 / 10)
  );
  physicWorld.CreateJoint(jd);
  jd.enableLimit = true;

  // R
  jd.lowerAngle = b2DegToRad(-45.0);
  jd.upperAngle = b2DegToRad(25.0);
  jd.Initialize(
    humanRig.parts[HumanPartType.Torso3],
    humanRig.parts[HumanPartType.upperRightLeg],
    new b2Vec2(startX + 0.8 / 10, startY - 7.2 / 10)
  );
  physicWorld.CreateJoint(jd);
  jd.enableLimit = true;

  // Upper leg to lower leg
  // L
  jd.lowerAngle = b2DegToRad(0);
  jd.upperAngle = b2DegToRad(0);
  jd.Initialize(
    humanRig.parts[HumanPartType.upperLeftLeg],
    humanRig.parts[HumanPartType.lowerLeftLeg],
    new b2Vec2(startX - 0.8 / 10, startY - 10.5 / 10)
  );
  physicWorld.CreateJoint(jd);
  jd.enableLimit = true;

  // R
  jd.lowerAngle = b2DegToRad(-115.0);
  jd.upperAngle = b2DegToRad(25);
  jd.Initialize(
    humanRig.parts[HumanPartType.upperRightLeg],
    humanRig.parts[HumanPartType.lowerRightLeg],
    new b2Vec2(startX + 0.8 / 10, startY - 10.5 / 10)
  );
  physicWorld.CreateJoint(jd);
  jd.enableLimit = true;
  for (let i = 0; i < humanRig.parts.length; i++) {
    humanRig.parts[i].SetType(b2BodyType.b2_dynamicBody);
  }

  // humanRig.parts[0].SetType(b2BodyType.b2_staticBody);

  return humanRig;
}
