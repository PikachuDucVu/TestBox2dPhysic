import { b2Body } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { AssetManager, PolygonBatch, Texture } from "gdxts";
import { Constants } from "../Constants";

export class BirdRenderSystem extends System {
  birdAsset: Texture;

  @Inject("gl") gl: WebGLRenderingContext;
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("batch") batch: PolygonBatch;
  @Inject("bird") bird: b2Body;
  initialized(): void {
    this.birdAsset = this.assetManager.getTexture("birdAsset") as Texture;
  }
  process(): void {
    this.batch.begin();
    this.batch.draw(
      this.birdAsset,
      this.bird.GetPosition().x * Constants.METER_TO_WORLD - 25,
      this.bird.GetPosition().y * Constants.METER_TO_WORLD - 25,
      Constants.BOX_SIZE * Constants.METER_TO_WORLD,
      Constants.BOX_SIZE * Constants.METER_TO_WORLD
    );
    this.batch.end();
  }
}
