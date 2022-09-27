import { b2Body, b2World } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { LevelState } from "./LevelState";

export class Level2System extends System {
  @Inject("levelState") levelState: LevelState;
  @Inject("physicWorld") physicWorld: b2World;
  @Inject("bird") bird: b2Body[];
  @Inject("pigs") pigs: b2Body[];
  @Inject("createBall") createBall: b2Body[];

  initialized() {}
  process(): void {}
}
