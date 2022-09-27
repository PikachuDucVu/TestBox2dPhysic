import { b2Body, b2World } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { LevelState } from "../data/LevelState";

export class BoxAndPigSystem extends System {
  @Inject("levelState") levelState: LevelState;
  @Inject("physicWorld") physicWorld: b2World;
  @Inject("boxes") boxes: b2Body[];
  @Inject("pigs") pigs: b2Body[];

  process(): void {
    for (let i = 0; i < this.pigs.length; i++) {
      if (this.pigs[i].GetPosition().x * 100 >= 1312) {
        this.physicWorld.DestroyBody(this.pigs[i]);
        this.pigs.splice(i, 1);
        if (this.pigs.length === 0) {
          this.levelState.conditionWin = true;
        }
      }
    }
    for (let i = 0; i < this.boxes.length; i++) {
      if (typeof this.boxes[i].GetUserData().durability === "number") {
        if (this.boxes[i].GetUserData().durability <= 4) {
        } else {
          this.physicWorld.DestroyBody(this.boxes[i]);
          this.boxes.splice(i, 1);
        }
      }
    }
    for (let i = 0; i < this.pigs.length; i++) {
      if (typeof this.pigs[i].GetUserData().durability === "number") {
        if (this.pigs[i].GetUserData().durability <= 1) {
        } else {
          this.physicWorld.DestroyBody(this.pigs[i]);
          this.pigs.splice(i, 1);
          if (this.pigs.length === 0) {
            this.levelState.conditionWin = true;
          }
        }
      }
    }
  }
}
