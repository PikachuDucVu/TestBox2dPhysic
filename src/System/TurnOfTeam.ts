import { b2Body, b2BodyType, b2World } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Constants } from "../Constant";
import { StateGame } from "../dataGame/stateGame";
import { createBall } from "./utils";

export class TurnOfTeam extends System {
  @Inject("StateGame") StateGame: StateGame;
  @Inject("ballsTeam1") ballsTeam1: b2Body[];
  @Inject("ballsTeam2") ballsTeam2: b2Body[];
  @Inject("Team1") Team1: b2Body[];
  @Inject("Team2") Team2: b2Body[];
  @Inject("physicWorld") physicWorld: b2World;
  @Inject("originPosition") originPosition: Vector2;
  @Inject("mapData") mapData: any;

  MAP_HEIGHT = 1000;
  ball1: any;
  ball2: any;

  initialized() {
    this.ball1 = this.mapData.layers.find(
      (b: any) => b.name === "ball1"
    ).objects;
    this.ball2 = this.mapData.layers.find(
      (b: any) => b.name === "ball2"
    ).objects;
  }

  process(): void {
    // if (this.Team1.length === 0 || this.Team2.length === 0 ) {
    //   this.StateGame.conditionWin = true;
    // }
    if (
      this.StateGame.CooldownTime < 0 &&
      this.StateGame.changeTurn &&
      this.StateGame.conditionWin === false
    ) {
      switch (this.StateGame.WhoisTurning) {
        case 1:
          this.StateGame.WhoisTurning = 2;
          for (let i = this.ballsTeam1.length - 1; i >= 0; i--) {
            this.physicWorld.DestroyBody(this.ballsTeam1[i]);
            this.ballsTeam1.splice(i, 1);
          }
          for (let i = this.Team1.length - 1; i >= 0; i--) {
            this.Team1[i].SetActive(true);
          }
          for (let i = 0; i < this.Team2.length; i++) {
            this.Team2[i].SetActive(false);
          }
          for (let i = 0; i < this.Team2.length; i++) {
            this.ballsTeam2.push(
              createBall(
                this.physicWorld,
                this.Team2[i].GetPosition().x + 0.2,
                this.Team2[i].GetPosition().y + 0.1,
                0.15,
                Constants.BALLTEAM2_CATEGORY_BIT,
                Constants.BALLTEAM2_MASK_BIT
              )
            );
          }
          this.StateGame.changeTurn = false;
          if (this.StateGame.conditionWin === false) {
            this.originPosition.set(
              this.ballsTeam2[0].GetPosition().x *
                Constants.METER_TO_PHYSIC_WORLD,
              this.ballsTeam2[0].GetPosition().y *
                Constants.METER_TO_PHYSIC_WORLD
            );
          }
          break;
        case 2:
          for (let i = this.ballsTeam2.length - 1; i >= 0; i--) {
            this.physicWorld.DestroyBody(this.ballsTeam2[i]);
            this.ballsTeam2.splice(i, 1);
          }
          for (let i = this.Team2.length - 1; i >= 0; i--) {
            this.Team2[i].SetActive(true);
          }
          for (let i = this.Team1.length - 1; i >= 0; i--) {
            this.Team1[i].SetActive(false);
            this.StateGame.WhoisTurning = 1;
          }
          for (let i = 0; i < this.Team1.length; i++) {
            this.ballsTeam1.push(
              createBall(
                this.physicWorld,
                this.Team1[i].GetPosition().x + 0.2,
                this.Team1[i].GetPosition().y + 0.1,
                0.15,
                Constants.BALLTEAM1_CATEGORY_BIT,
                Constants.BALLTEAM1_MASK_BIT
              )
            );
          }

          this.StateGame.changeTurn = false;
          this.originPosition.set(
            this.ballsTeam1[0].GetPosition().x *
              Constants.METER_TO_PHYSIC_WORLD,
            this.ballsTeam1[0].GetPosition().y * Constants.METER_TO_PHYSIC_WORLD
          );
          break;
        default:
          break;
      }
    }
  }
}
