import { b2Body } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { AssetManager, Viewport } from "gdxts";
import { Game } from "gdxts/dist/lib/Game";
import { controlCameraGame, StateGame } from "../dataGame/stateGame";
import { createGameScreen, physicWorld } from "../GameScreen/GameScreen";
import { HumanRig } from "./CreateHuman";

export class NextLevelSystem extends System {
  @Inject("cameraControl") cameraControl: controlCameraGame;
  @Inject("Team1") Team1: HumanRig[];
  @Inject("Team2") Team2: HumanRig[];
  @Inject("StateGame") StateGame: StateGame;
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("viewport") viewport: Viewport;
  @Inject("grounds") grounds: b2Body[];
  @Inject("ballsTeam1") ballsTeam1: b2Body[];
  @Inject("ballsTeam2") ballsTeam2: b2Body[];

  process(): void {
    if (
      (this.Team1.length === 0 || this.Team2.length === 0) &&
      this.StateGame.CooldownTime < 0 &&
      this.StateGame.setupTeam2 === true
    ) {
      this.StateGame.CooldownTime = 999;
      this.StateGame.WhoisTurning = 2;
      this.StateGame.currentLevel++;
      this.StateGame.conditionWin = true;
      this.cameraControl.introGame = true;

      for (let i = 0; i < this.Team1.length; i++) {
        for (let j = 0; j < this.Team1[i].parts.length; j++) {
          physicWorld.DestroyBody(this.Team1[i].parts[j]);
        }
      }
      for (let i = 0; i < this.Team2.length; i++) {
        for (let j = 0; j < this.Team2[i].parts.length; j++) {
          physicWorld.DestroyBody(this.Team2[i].parts[j]);
        }
      }
      for (let i = 0; i < this.grounds.length; i++) {
        physicWorld.DestroyBody(this.grounds[i]);
      }
      for (let i = 0; i < this.ballsTeam1.length; i++) {
        physicWorld.DestroyBody(this.ballsTeam1[i]);
      }
      for (let i = 0; i < this.ballsTeam2.length; i++) {
        physicWorld.DestroyBody(this.ballsTeam2[i]);
      }

      const screen = createGameScreen(this.assetManager, this.viewport);
      screen.then((screen) => {
        this.StateGame.conditionWin = false;
        this.StateGame.changeTurn = false;
        this.StateGame.setupTeam1 = false;
        this.StateGame.setupTeam2 = false;

        Game.shared.setScreen(screen);
      });
    }
  }
  dispose(): void {}
}
