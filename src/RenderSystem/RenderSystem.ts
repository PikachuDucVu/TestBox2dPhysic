import { b2Body } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import {
  AssetManager,
  PolygonBatch,
  ShapeRenderer,
  Texture,
  Vector2,
} from "gdxts";
import { StateGame } from "../dataGame/stateGame";

export class RenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("Team1") Team1: b2Body[];
  @Inject("Team2") Team2: b2Body[];
  @Inject("groundData") groundData: any;
  @Inject("ballsTeam1") ballsTeam1: b2Body[];
  @Inject("originPosition") originPosition: Vector2;
  @Inject("dragPositioning") dragPositioning: Vector2;
  @Inject("batch") batch: PolygonBatch;
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("StateGame") StateGame: StateGame;

  bloodBar: any;
  vsAsset: any;
  winningAsset: any;
  pointTurn: any;

  initialized() {
    this.bloodBar = this.assetManager.getTexture("bloodBar") as Texture;
    this.vsAsset = this.assetManager.getTexture("vsAsset") as Texture;
    this.winningAsset = this.assetManager.getTexture("winningAsset") as Texture;
    this.pointTurn = this.assetManager.getTexture("paint") as Texture;
  }

  process(): void {
    this.shapeRenderer.begin();

    this.shapeRenderer.end();
    this.batch.setYDown(false);
    this.batch.begin();
    this.batch.draw(
      this.bloodBar,
      1400,
      1300,
      100 * this.Team1.length,
      100,
      1,
      1,
      3.14
    );
    this.batch.draw(this.bloodBar, 1500, 1200, 100 * this.Team2.length, 100);
    this.batch.draw(this.vsAsset, 1400, 1200, 100, 100, 50, 50);

    if (this.StateGame.setupTeam1 === false) {
      this.batch.draw(this.pointTurn, 1000, 1000, 300, 150);
    }

    if (
      this.StateGame.setupTeam1 === true &&
      this.StateGame.setupTeam2 === false
    ) {
      this.batch.draw(this.pointTurn, 1700, 1000, 300, 150);
    }

    if (this.Team1.length === 0 && this.StateGame.setupTeam1) {
      this.batch.draw(this.winningAsset, 1750, 300, 1000, 1000);
    }
    if (this.Team2.length === 0 && this.StateGame.setupTeam2) {
      this.batch.draw(this.winningAsset, 350, 300, 1000, 1000);
    }
    this.batch.end();
  }
}
