import { b2Body } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { OrthoCamera } from "gdxts";
import { Constants } from "../Constant";
import { StateGame } from "../dataGame/stateGame";
export class CameraGame extends System {
  @Inject("camera") camera: OrthoCamera;
  @Inject("StateGame") stateGame: StateGame;
  @Inject("ballsTeam1") ballsTeam1: b2Body[];
  @Inject("ballsTeam2") ballsTeam2: b2Body[];
  offsetCameraX: number;
  temp: number;

  initialized(): void {
    this.offsetCameraX = 150;
  }

  process(): void {
    this.camera.update();
    if (this.stateGame.WhoisTurning === 1 && this.ballsTeam1.length) {
      if (this.camera.position.x >= 150 && this.camera.position.x <= 2700) {
        for (let i = 0; i < this.ballsTeam1.length; i++) {
          if (
            this.ballsTeam1[i].GetPosition().x *
              Constants.METER_TO_PHYSIC_WORLD >=
            this.camera.position.x
          ) {
            this.camera.position.set(
              this.ballsTeam1[i].GetPosition().x *
                Constants.METER_TO_PHYSIC_WORLD,
              Constants.WORLD_HEIGHT / 2,
              0
            );
          }
        }
      }
      if (this.camera.position.x <= 150) {
        this.camera.position.set(150, Constants.WORLD_HEIGHT / 2, 0);
      }
      if (this.camera.position.x >= 2700) {
        this.camera.position.set(2700, Constants.WORLD_HEIGHT / 2, 0);
      }
      this.camera.update();
    }
    if (this.stateGame.WhoisTurning === 2 && this.ballsTeam2.length) {
      if (this.camera.position.x >= 150 && this.camera.position.x <= 2700) {
        for (let i = 0; i < this.ballsTeam2.length; i++) {
          if (
            this.ballsTeam2[i].GetPosition().x *
              Constants.METER_TO_PHYSIC_WORLD <=
            this.camera.position.x
          ) {
            this.camera.position.set(
              this.ballsTeam2[i].GetPosition().x *
                Constants.METER_TO_PHYSIC_WORLD,
              Constants.WORLD_HEIGHT / 2,
              0
            );
          }
        }
      }
      if (this.camera.position.x <= 150) {
        this.camera.position.set(150, Constants.WORLD_HEIGHT / 2, 0);
      }
      if (this.camera.position.x >= 2700) {
        this.camera.position.set(2700, Constants.WORLD_HEIGHT / 2, 0);
      }

      this.camera.update();
    }
  }
}
