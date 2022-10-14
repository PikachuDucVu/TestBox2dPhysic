import { b2Body } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { AssetManager, Viewport } from "gdxts";
import { Game } from "gdxts/dist/lib/Game";
import { StateGame } from "../dataGame/stateGame";
import { createGameScreen } from "../GameScreen/GameScreen";

export class NextLevelSystem extends System {
  @Inject("Team1") Team1: b2Body[];
  @Inject("Team2") Team2: b2Body[];
  @Inject("StateGame") StateGame: StateGame;
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("viewport") viewport: Viewport;

  process(): void {
    if (
      (this.Team1.length === 0 || this.Team2.length === 0) &&
      this.StateGame.CooldownTime < 0
    ) {
      this.StateGame.conditionWin = true;
      this.StateGame.currentLevel++;
      this.StateGame.CooldownTime = 999;
      this.StateGame.WhoisTurning = 1;
      this.StateGame.changeTurn = false;

      setTimeout(() => {
        const screen = createGameScreen(this.assetManager, this.viewport);
        screen.then((screen) => {
          this.StateGame.conditionWin = false;
          Game.shared.setScreen(screen);
        });
      }, 5000);
    }
  }
}
