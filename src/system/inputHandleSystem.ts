import { b2Body, b2BodyType } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { InputEvent, Vector2, ViewportInputHandler } from "gdxts";
import { Constants } from "../Constants";

export class inputHandlerSystem extends System {
  @Inject("inputHandler") inputHandler: ViewportInputHandler;
  @Inject("originPosition") originPosition: Vector2;
  @Inject("slingPos") slingPos: Vector2;
  @Inject("bird") bird: b2Body;

  initialized(): void {
    this.inputHandler.addEventListener(InputEvent.TouchMove, () => {
      if (this.inputHandler.isTouched()) {
        this.slingPos.setVector(this.inputHandler.getTouchedWorldCoord());
      }
    });
    this.inputHandler.addEventListener(InputEvent.TouchEnd, () => {
      this.bird.SetType(b2BodyType.b2_dynamicBody);
      this.bird.ApplyLinearImpulseToCenter(
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
    });
  }

  process(): void {}
}
