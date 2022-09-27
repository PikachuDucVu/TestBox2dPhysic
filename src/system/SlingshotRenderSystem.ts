import { b2Body, b2BodyType } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import {
  AssetManager,
  PolygonBatch,
  ShapeRenderer,
  Texture,
  Vector2,
} from "gdxts";
import { Constants } from "../Constants";

export class SlingshotRenderSystem extends System {
  slingShot: Texture;

  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("batch") batch: PolygonBatch;
  @Inject("slingPos") slingPos: Vector2;

  initialized() {
    this.slingShot = this.assetManager.getTexture("slingShot") as Texture;
  }

  process(): void {
    this.batch.begin();
    this.batch.draw(
      this.slingShot,
      2 * Constants.METER_TO_WORLD,
      3.5 * Constants.METER_TO_WORLD,
      0.25 * Constants.METER_TO_WORLD,
      0.7 * Constants.METER_TO_WORLD
    );
    this.batch.end();
  }
}
