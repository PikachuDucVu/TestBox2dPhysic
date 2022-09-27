import { b2Body, b2BodyType, b2World } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { InputEvent, Vector2, ViewportInputHandler } from "gdxts";
import { Constants } from "../Constants";
import { LevelState } from "../data/LevelState";
import { createCloneBird } from "../utils/gameUtil";

export class inputHandlerSystem extends System {
  @Inject("inputHandler") inputHandler: ViewportInputHandler;
  @Inject("originPosition") originPosition: Vector2;
  @Inject("slingPos") slingPos: Vector2;
  @Inject("bird") bird: b2Body[];
  @Inject("boxes") boxes: b2Body[];
  @Inject("birdOnSlingShot") birdOnSlingShot: boolean;
  @Inject("physicWorld") physicWorld: b2World;
  @Inject("levelState") levelState: LevelState;
  @Inject("specialSkillOfYellowBird") specialSkillOfYellowBird: b2Body[];
  flyStatus: boolean;
  setNewBird: boolean;

  initialized(): void {
    this.flyStatus = false;
    this.setNewBird = true;

    this.inputHandler.addEventListener(InputEvent.TouchMove, () => {
      if (this.inputHandler.isTouched()) {
        this.slingPos.setVector(this.inputHandler.getTouchedWorldCoord());
      }
    });

    this.inputHandler.addEventListener(InputEvent.TouchEnd, () => {
      if (
        this.levelState.conditionWin === false &&
        this.flyStatus === false &&
        this.setNewBird === true
      ) {
        if (this.levelState.birdCount < 4) {
          this.bird[this.levelState.birdCount].SetType(
            b2BodyType.b2_dynamicBody
          );
          this.bird[this.levelState.birdCount].ApplyLinearImpulseToCenter(
            {
              x:
                (7 * (this.originPosition.x - this.slingPos.x)) /
                Constants.METER_TO_WORLD,
              y:
                (7 * (this.originPosition.y - this.slingPos.y)) /
                Constants.METER_TO_WORLD,
            },
            true
          );
        }
        this.flyStatus = true;
        this.levelState.remainingTimeOfUseSpecialSkill = 4;
        this.levelState.birdCount++;

        if (this.levelState.birdCount + 1 <= 4 && this.bird.length !== 0) {
          this.setNewBird = false;
          setTimeout(() => {
            this.bird[this.levelState.birdCount].SetPositionXY(2, 3.45);
            this.setNewBird = true;
          }, 3500);
        }
      } else {
      }
    });

    this.inputHandler.addEventListener(InputEvent.TouchStart, () => {
      if (
        this.levelState.remainingTimeOfUseSpecialSkill > 0 &&
        this.flyStatus === true &&
        this.bird[this.levelState.birdCount - 1].GetUserData() === "RedBird"
      ) {
        this.bird[this.levelState.birdCount - 1].ApplyLinearImpulseToCenter(
          {
            x: 10,
            y: 0,
          },
          true
        );
        setTimeout(() => {
          this.flyStatus = false; // disable special skill
        }, 150);
      }
      if (
        this.levelState.remainingTimeOfUseSpecialSkill > 0 &&
        this.flyStatus === true &&
        this.bird[this.levelState.birdCount - 1].GetUserData() === "YellowBird"
      ) {
        this.specialSkillOfYellowBird.push(
          createCloneBird(
            this.physicWorld,
            this.bird[this.levelState.birdCount - 1].GetPosition().x,
            this.bird[this.levelState.birdCount - 1].GetPosition().y,
            Constants.BALL_RADIUS,
            "YellowBirdClone"
          )
        );
        this.specialSkillOfYellowBird.push(
          createCloneBird(
            this.physicWorld,
            this.bird[this.levelState.birdCount - 1].GetPosition().x,
            this.bird[this.levelState.birdCount - 1].GetPosition().y,

            Constants.BALL_RADIUS,
            "YellowBirdClone"
          )
        );

        const birdVelocity =
          this.bird[this.levelState.birdCount - 1].GetLinearVelocity();
        const newVelocity1 = new Vector2(birdVelocity.x, birdVelocity.y);
        const newVelocity2 = new Vector2(birdVelocity.x, birdVelocity.y);
        newVelocity1.rotate(15);
        newVelocity2.rotate(-15);
        this.specialSkillOfYellowBird[0].ApplyLinearImpulseToCenter(
          {
            x:
              (1 * (this.originPosition.x - this.slingPos.x)) /
              Constants.METER_TO_WORLD,
            y:
              (1 * (this.originPosition.y - this.slingPos.y)) /
              Constants.METER_TO_WORLD,
          },
          true
        );

        this.specialSkillOfYellowBird[0].SetLinearVelocity({
          x: newVelocity1.x,
          y: newVelocity1.y,
        });
        this.specialSkillOfYellowBird[1].SetLinearVelocity({
          x: newVelocity2.x,
          y: newVelocity2.y,
        });
        this.specialSkillOfYellowBird[0].ApplyLinearImpulseToCenter(
          {
            x:
              (1 * (this.originPosition.x - this.slingPos.x)) /
              Constants.METER_TO_WORLD,
            y:
              (1 * (this.originPosition.y - this.slingPos.y)) /
              Constants.METER_TO_WORLD,
          },
          true
        );

        setTimeout(() => {
          this.physicWorld.DestroyBody(this.specialSkillOfYellowBird[0]);
          this.physicWorld.DestroyBody(this.specialSkillOfYellowBird[1]);
          this.specialSkillOfYellowBird.splice(0, 1);
          this.specialSkillOfYellowBird.splice(0, 1);
        }, 3000);

        setTimeout(() => {
          this.flyStatus = false; // disable special skill
        }, 150);
      }
    });
  }

  process(): void {
    if (this.levelState.remainingTimeOfUseSpecialSkill < 0) {
      this.flyStatus = false;
    }
  }
}
