import { b2Body, b2World } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Constants } from "../Constant";
import { StateGame } from "../dataGame/stateGame";
import { createBall } from "./utils";

export class TurnOfTeam extends System {
  @Inject("StateGame") StateGame: StateGame;
  @Inject("ballsTeam1") ballsTeam1: b2Body[];
  @Inject("ballsTeam2") ballsTeam2: b2Body[];
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
    if (this.StateGame.CooldownTime < 0 && this.StateGame.changeTurn) {
      switch (this.StateGame.WhoisTurning) {
        case 1:
          this.StateGame.WhoisTurning = 2;
          for (let i = 3; i >= 0; i--) {
            this.physicWorld.DestroyBody(this.ballsTeam1[i]);
            this.ballsTeam1.splice(i, 1);
          }
          for (let box of this.ball2) {
            this.ballsTeam2.push(
              createBall(
                this.physicWorld,
                box.x / Constants.METER_TO_PHYSIC_WORLD,
                (this.MAP_HEIGHT - box.y) / Constants.METER_TO_PHYSIC_WORLD,
                0.25
              )
            );
          }

          this.StateGame.changeTurn = false;
          this.originPosition.set(
            this.ballsTeam2[1].GetPosition().x *
              Constants.METER_TO_PHYSIC_WORLD,
            this.ballsTeam2[1].GetPosition().y * Constants.METER_TO_PHYSIC_WORLD
          );
          break;
        case 2:
          this.StateGame.WhoisTurning = 1;
          for (let i = 3; i >= 0; i--) {
            this.physicWorld.DestroyBody(this.ballsTeam2[i]);
            this.ballsTeam2.splice(i, 1);
          }
          for (let box of this.ball1) {
            this.ballsTeam1.push(
              createBall(
                this.physicWorld,
                box.x / Constants.METER_TO_PHYSIC_WORLD,
                (this.MAP_HEIGHT - box.y) / Constants.METER_TO_PHYSIC_WORLD,
                0.25
              )
            );
          }
          this.StateGame.changeTurn = false;
          this.originPosition.set(
            this.ballsTeam1[1].GetPosition().x *
              Constants.METER_TO_PHYSIC_WORLD,
            this.ballsTeam1[1].GetPosition().y * Constants.METER_TO_PHYSIC_WORLD
          );
          break;
        default:
          break;
      }
    }
  }
}
