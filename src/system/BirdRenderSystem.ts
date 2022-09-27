import { b2Body } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { AssetManager, PolygonBatch, Texture } from "gdxts";
import { Constants } from "../Constants";

export class BirdRenderSystem extends System {
  birdAsset: Texture;
  yellowBird: Texture;
  rotation = 0;

  @Inject("gl") gl: WebGLRenderingContext;
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("batch") batch: PolygonBatch;
  @Inject("bird") bird: b2Body[];
  @Inject("specialSkillOfYellowBird") specialSkillOfYellowBird: b2Body[];

  initialized(): void {
    this.birdAsset = this.assetManager.getTexture("birdAsset") as Texture;
    this.yellowBird = this.assetManager.getTexture("yellowBird") as Texture;
  }
  process(): void {
    this.batch.begin();
    for (let i = 0; i < this.bird.length; i++) {
      this.batch.draw(
        this.bird[i].GetUserData() === "RedBird"
          ? this.birdAsset
          : this.yellowBird,
        this.bird[i].GetPosition().x * Constants.METER_TO_WORLD - 25,
        this.bird[i].GetPosition().y * Constants.METER_TO_WORLD - 25,
        Constants.BOX_SIZE * Constants.METER_TO_WORLD,
        Constants.BOX_SIZE * Constants.METER_TO_WORLD
      );
    }
    this.batch.end();
    this.batch.begin();
    for (let i = 0; i < this.specialSkillOfYellowBird.length; i++) {
      this.batch.draw(
        this.yellowBird,
        this.specialSkillOfYellowBird[i].GetPosition().x *
          Constants.METER_TO_WORLD -
          25,
        this.specialSkillOfYellowBird[i].GetPosition().y *
          Constants.METER_TO_WORLD -
          25,
        Constants.BOX_SIZE * Constants.METER_TO_WORLD,
        Constants.BOX_SIZE * Constants.METER_TO_WORLD
      );
    }
    this.batch.end();
  }
}
