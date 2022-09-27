import { b2Body, b2World } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import {
  AssetManager,
  PolygonBatch,
  Texture,
  TextureRegion,
  Animation,
  PlayMode,
} from "gdxts";
import { Constants } from "../Constants";
import { LevelState } from "../data/LevelState";
export class BoxesAndPigsRenderSystem extends System {
  boxAsset: Texture;
  pigAsset: Texture;
  boxRegions: TextureRegion[];
  pigRegions: TextureRegion[];
  boxAnimation: any;
  pigAnimation: any;

  @Inject("gl") gl: WebGLRenderingContext;
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("batch") batch: PolygonBatch;
  @Inject("boxes") boxes: b2Body[];
  @Inject("pigs") pigs: b2Body[];
  @Inject("physicWorld") physicWorld: b2World;
  @Inject("levelState") levelState: LevelState;

  initialized(): void {
    this.boxAsset = this.assetManager.getTexture("boxAsset") as Texture;
    this.pigAsset = this.assetManager.getTexture("pigAsset") as Texture;
    const boxesRegions = TextureRegion.splitTexture(this.boxAsset, 1, 4);
    const pigTexture = TextureRegion.splitTexture(this.pigAsset, 2, 1);
    this.boxAnimation = new Animation(
      boxesRegions.slice(0, 4),
      Constants.frameDuration
    );
    this.pigAnimation = new Animation(
      pigTexture.slice(0, 2),
      Constants.frameDuration
    );
    this.boxRegions = [
      this.boxAnimation.getKeyFrame(0, PlayMode.NORMAL),
      this.boxAnimation.getKeyFrame(0, PlayMode.NORMAL),
      this.boxAnimation.getKeyFrame(0, PlayMode.NORMAL),
      this.boxAnimation.getKeyFrame(0, PlayMode.NORMAL),
      this.boxAnimation.getKeyFrame(0, PlayMode.NORMAL),
      this.boxAnimation.getKeyFrame(0, PlayMode.NORMAL),
    ];
    this.pigRegions = [
      this.pigAnimation.getKeyFrame(0, PlayMode.NORMAL),
      this.pigAnimation.getKeyFrame(0, PlayMode.NORMAL),
    ];
  }

  process(): void {
    const updateBoxRegionByDurability = (index: number, durability: number) => {
      this.boxRegions[index] = this.boxAnimation.getKeyFrame(
        Constants.frameDuration * durability,
        PlayMode.NORMAL
      );
    };
    const updatePigRegionByDurability = (index: number, durability: number) => {
      this.pigRegions[index] = this.pigAnimation.getKeyFrame(
        Constants.frameDuration * durability,
        PlayMode.NORMAL
      );
    };

    for (let i = 0; i < this.boxes.length; i++) {
      if (typeof this.boxes[i].GetUserData().durability === "number") {
        if (this.boxes[i].GetUserData().durability <= 4) {
          updateBoxRegionByDurability(
            i,
            this.boxes[i].GetUserData().durability
          );
        }
      }
    }
    for (let i = 0; i < this.pigs.length; i++) {
      if (typeof this.pigs[i].GetUserData().durability === "number") {
        if (this.pigs[i].GetUserData().durability <= 1) {
          updatePigRegionByDurability(i, this.pigs[i].GetUserData().durability);
        }
      }
    }

    this.batch.begin();
    for (let i = 0; i < this.boxes.length; i++) {
      this.boxRegions[i].draw(
        this.batch,
        this.boxes[i].GetPosition().x * Constants.METER_TO_WORLD -
          (Constants.BOX_SIZE * Constants.METER_TO_WORLD) / 2,
        this.boxes[i].GetPosition().y * Constants.METER_TO_WORLD -
          (Constants.BOX_SIZE * Constants.METER_TO_WORLD) / 2,
        Constants.BOX_SIZE * Constants.METER_TO_WORLD,
        Constants.BOX_SIZE * Constants.METER_TO_WORLD
      );
    }
    for (let i = 0; i < this.pigs.length; i++) {
      this.pigRegions[i].draw(
        this.batch,
        this.pigs[i].GetPosition().x * Constants.METER_TO_WORLD -
          (Constants.PIG_SIZE * Constants.METER_TO_WORLD) / 2,
        this.pigs[i].GetPosition().y * Constants.METER_TO_WORLD -
          (Constants.PIG_SIZE * Constants.METER_TO_WORLD) / 2,
        Constants.PIG_SIZE * Constants.METER_TO_WORLD,
        Constants.PIG_SIZE * Constants.METER_TO_WORLD
      );
    }
    this.batch.end();
  }
}
