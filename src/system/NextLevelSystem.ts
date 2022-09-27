import { b2Body, b2World } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { AssetManager, Game, Viewport } from "gdxts";
import { LevelState } from "../data/LevelState";
import { createGameScreen } from "../screen/GameScreen";

export class NextLevelSystem extends System {
  @Inject("physicWorld") physicWorld: b2World;
  @Inject("levelState") levelState: LevelState;
  @Inject("bird") bird: b2Body[];
  @Inject("pigs") pigs: b2Body[];
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("viewport") viewport: Viewport;

  initialized(): void {
    this.levelState.transition = false;
  }
  process(): void {
    if (this.levelState.conditionWin && this.levelState.transition === false) {
      this.levelState.transition = true;

      setTimeout(() => {
        this.levelState.currentLevel++;
        const screen = createGameScreen(this.assetManager, this.viewport);
        screen.then((screen) => {
          Game.shared.setScreen(screen);
        });
      }, 1500);
    }
  }
}
