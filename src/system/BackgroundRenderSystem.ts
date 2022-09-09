import { b2Body } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { AssetManager, PolygonBatch, Texture } from "gdxts";
import { Constants } from "../Constants";

export class BackgroundRenderSystem extends System {
  @Inject("gl") gl: WebGLRenderingContext;
  @Inject("batch") batch: PolygonBatch;
  @Inject("assetManager") assetManager: AssetManager;

  background: Texture;
  initialized(): void {
    this.background = this.assetManager.getTexture("bg") as Texture;
  }
  dispose(): void {}
  process(): void {
    this.batch.begin();
    this.batch.draw(
      this.background,
      0,
      0,
      Constants.WORLD_WIDTH,
      Constants.WORLD_HEIGHT
    );
    this.batch.end();
  }
}
