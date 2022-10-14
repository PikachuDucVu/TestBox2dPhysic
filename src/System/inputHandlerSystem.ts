import { b2Body, b2BodyType } from "box2d.ts";
import { Inject, System } from "flat-ecs";
import {
  Color,
  InputEvent,
  OrthoCamera,
  ShapeRenderer,
  Vector2,
  ViewportInputHandler,
} from "gdxts";
import { Constants } from "../Constant";
import { StateGame } from "../dataGame/stateGame";

const MAX_IMPULSE_POWER = 20;
const MAX_DRAGGING_RANGE = 1;

const tmpV = new Vector2(0, 0);
const tmpP = new Vector2(0, 0);
const tmpG = new Vector2(0, 0);
const GRAVITY = -10;

// function getRandomInt(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min)) + min;
// }
const getTrajectoryPoint = (
  startPos: Vector2,
  startV: Vector2,
  n: number
): Vector2 => {
  const t = 10 / 60;
  tmpV.setVector(startV).scale(t).scale(n).scale(-GRAVITY);
  tmpG
    .set(0, GRAVITY)
    .scale(t * t)
    .scale(0.5 * (n * n + n));
  tmpP.setVector(startPos);
  return tmpP.addVector(tmpV).addVector(tmpG);
};
const tmpV2 = new Vector2(0, 0);
const trajectories: number[] = [];
const calculateImpulse = (
  originPosition: Vector2,
  dragPositioning: Vector2
) => {
  tmpV2
    .set(
      originPosition.x / Constants.METER_TO_PHYSIC_WORLD,
      originPosition.y / Constants.METER_TO_PHYSIC_WORLD
    )
    .sub(
      dragPositioning.x / Constants.METER_TO_PHYSIC_WORLD,
      dragPositioning.y / Constants.METER_TO_PHYSIC_WORLD
    );
  if (tmpV2.len2() >= MAX_DRAGGING_RANGE * MAX_DRAGGING_RANGE) {
    tmpV2.nor().scale(MAX_DRAGGING_RANGE);
  }
  tmpV2.scale(1 / MAX_DRAGGING_RANGE).scale(MAX_IMPULSE_POWER);
  return tmpV2;
};

export class InputHandlerSystem extends System {
  @Inject("ballsTeam1") ballsTeam1: b2Body[];
  @Inject("ballsTeam2") ballsTeam2: b2Body[];
  @Inject("inputHandle") inputHandle: ViewportInputHandler;
  @Inject("originPosition") originPosition: Vector2;
  @Inject("dragPositioning") dragPositioning: Vector2;
  @Inject("StateGame") StateGame: StateGame;
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("camera") camera: OrthoCamera;

  hasFired = false;
  dragging = false;

  initialized() {
    this.inputHandle.addEventListener(InputEvent.TouchStart, () => {});
  }

  process(): void {
    if (this.StateGame.CooldownTime < 0) {
      this.hasFired = false;
    }
    this.dragPositioning = this.inputHandle.getTouchedWorldCoord();
    if (this.inputHandle.isTouched() && this.StateGame.conditionWin === false) {
      if (!this.dragging) {
        this.dragging = true;
      }
    } else {
      if (this.dragging && this.hasFired === false) {
        const impulse = calculateImpulse(
          this.originPosition,
          this.dragPositioning
        );
        if (this.StateGame.WhoisTurning === 1 && this.hasFired === false) {
          for (let ball of this.ballsTeam1) {
            ball.SetType(b2BodyType.b2_dynamicBody);
            ball.ApplyLinearImpulseToCenter(impulse);
          }
        }
        if (this.StateGame.WhoisTurning === 2 && this.hasFired === false) {
          for (let ball of this.ballsTeam2) {
            ball.SetType(b2BodyType.b2_dynamicBody);
            ball.ApplyLinearImpulseToCenter(impulse);
          }
        }
        this.hasFired = true;
        this.StateGame.CooldownTime = 6;
        setTimeout(() => {
          this.StateGame.changeTurn = true;
        }, 6000);
        this.dragging = false;
      }
    }
    this.shapeRenderer.begin();

    if (this.dragging && this.hasFired === false) {
      tmpV2
        .set(this.originPosition.x, this.originPosition.y)
        .sub(this.dragPositioning.x, this.dragPositioning.y);
      if (tmpV2.len2() <= MAX_DRAGGING_RANGE * MAX_DRAGGING_RANGE) {
        tmpV2.nor().scale(-MAX_DRAGGING_RANGE);
        tmpV2.add(this.originPosition.x, this.originPosition.y);
      } else {
        tmpV2.setVector(this.dragPositioning);
      }
      this.shapeRenderer.rectLine(
        true,
        this.originPosition.x,
        this.originPosition.y,
        tmpV2.x,
        tmpV2.y,
        10
      );

      trajectories.length = 0;
      const impulse = calculateImpulse(
        this.originPosition,
        this.dragPositioning
      );
      for (let i = 0; i < 180; i++) {
        const pos = getTrajectoryPoint(this.originPosition, impulse, i);
        trajectories.push(pos.x, pos.y);
      }
      for (let i = 0; i < trajectories.length; i += 2) {
        this.shapeRenderer.circle(
          true,
          trajectories[i],
          trajectories[i + 1],
          5,
          Color.BLUE,
          10
        );
      }
    }
    this.shapeRenderer.end();
  }
}
