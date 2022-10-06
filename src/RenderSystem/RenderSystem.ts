import { b2Body } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { Color, ShapeRenderer, Vector2 } from "gdxts";
import { Constants } from "../Constant";

export class RenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("Team1") Team1: b2Body[];
  @Inject("Team2") Team2: b2Body[];
  @Inject("groundData") groundData: any;
  @Inject("ballsTeam1") ballsTeam1: b2Body[];
  @Inject("originPosition") originPosition: Vector2;
  @Inject("dragPositioning") dragPositioning: Vector2;

  BOX_SIZE = 0.25;

  process(): void {
    this.shapeRenderer.begin();

    this.shapeRenderer.rect(
      true,
      this.dragPositioning.x,
      this.dragPositioning.y,
      30,
      30
    );

    this.shapeRenderer.end();
  }
}
