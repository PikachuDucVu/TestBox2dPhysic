import { b2Body, b2BodyType } from "box2d.ts";
import { Inject, System } from "flat-ecs";
import { InputEvent, Vector2, ViewportInputHandler } from "gdxts";
import { Constants } from "../Constant";
import { StateGame } from "../dataGame/stateGame";
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export class InputHandlerSystem extends System {
  @Inject("ballsTeam1") ballsTeam1: b2Body[];
  @Inject("ballsTeam2") ballsTeam2: b2Body[];
  @Inject("inputHandle") inputHandle: ViewportInputHandler;
  @Inject("originPosition") originPosition: Vector2;
  @Inject("dragPositioning") dragPositioning: Vector2;
  @Inject("StateGame") StateGame: StateGame;

  hasFired = false;

  initialized() {
    this.inputHandle.addEventListener(InputEvent.TouchMove, () => {
      if (this.inputHandle.isTouched()) {
        this.dragPositioning.setVector(this.inputHandle.getTouchedWorldCoord());
      }
    });

    this.inputHandle.addEventListener(InputEvent.TouchEnd, () => {
      if (this.hasFired === false) {
        switch (this.StateGame.WhoisTurning) {
          case 1:
            for (let ball of this.ballsTeam1) {
              ball.SetType(b2BodyType.b2_dynamicBody);
              ball.ApplyLinearImpulseToCenter({
                x:
                  (4 * (this.originPosition.x - this.dragPositioning.x)) /
                    Constants.METER_TO_PHYSIC_WORLD +
                  getRandomInt(-1, 1),
                y:
                  (4 * (this.originPosition.y - this.dragPositioning.y)) /
                    Constants.METER_TO_PHYSIC_WORLD +
                  getRandomInt(-1, 1),
              });
            }
            this.StateGame.CooldownTime = 5;
            this.hasFired = true;
            setTimeout(() => {
              this.StateGame.changeTurn = true;
            }, 5000);
            break;
          case 2:
            for (let ball of this.ballsTeam2) {
              ball.SetType(b2BodyType.b2_dynamicBody);
              ball.ApplyLinearImpulseToCenter({
                x:
                  (4 * (this.originPosition.x - this.dragPositioning.x)) /
                    Constants.METER_TO_PHYSIC_WORLD +
                  getRandomInt(-1, 1),
                y:
                  (4 * (this.originPosition.y - this.dragPositioning.y)) /
                    Constants.METER_TO_PHYSIC_WORLD +
                  getRandomInt(-1, 1),
              });
            }
            this.StateGame.CooldownTime = 5;
            this.hasFired = true;
            setTimeout(() => {
              this.StateGame.changeTurn = true;
            }, 5000);
            break;
          default:
            break;
        }
      }
    });
  }

  process(): void {
    if (this.StateGame.CooldownTime < 0) {
      this.hasFired = false;
    }
  }
}
