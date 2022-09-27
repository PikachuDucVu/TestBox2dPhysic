import {
  b2Body,
  b2BodyDef,
  b2BodyType,
  b2ContactListener,
  b2Filter,
  b2PolygonShape,
  b2World,
} from "box2d.ts";
import { World } from "flat-ecs";
import {
  AssetManager,
  PolygonBatch,
  Screen,
  ShapeRenderer,
  Vector2,
  Viewport,
  ViewportInputHandler,
} from "gdxts";
import { Constants } from "../Constants";
import { LevelState } from "../data/LevelState";
import { BackgroundRenderSystem } from "../system/BackgroundRenderSystem";
import { BirdRenderSystem } from "../system/BirdRenderSystem";
import { BoxAndPigSystem } from "../system/BoxAndPigSystem";
import { BoxesAndPigsRenderSystem } from "../system/BoxesAndPigsRenderSystem";
import { ContactListenerSystem } from "../system/ContactListenerSystem";
import { inputHandlerSystem } from "../system/inputHandleSystem";
import { NextLevelSystem } from "../system/NextLevelSystem";
import { ShapeRendererSystem } from "../system/ShapeRendererSystem";
import { SlingshotRenderSystem } from "../system/SlingshotRenderSystem";
import { createBall } from "../utils/gameUtil";

const levelState: LevelState = {
  birdCount: 0,
  conditionWin: false,
  currentLevel: 1,
  transition: false,
  remainingTimeOfUseSpecialSkill: 3,
};

export const createGameScreen = async (
  assetManager: AssetManager,
  viewport: Viewport
): Promise<Screen> => {
  const createWall = (
    world: b2World,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const bodyDef = new b2BodyDef();
    bodyDef.type = b2BodyType.b2_staticBody;
    bodyDef.position.Set(x + width / 2, y + height / 2);
    const body = world.CreateBody(bodyDef);
    const shape = new b2PolygonShape();
    shape.SetAsBox(width / 2, height / 2);
    body.SetUserData("ground");
    body.CreateFixture(shape);

    const filter = new b2Filter();
    filter.categoryBits = Constants.GROUND_CATEGORY_BIT;
    filter.maskBits = Constants.GROUND_MASK_BIT;
  };

  const createBox = (
    world: b2World,
    x: number,
    y: number,
    width: number,
    height: number,
    userData: {
      name: string;
    }
  ): b2Body => {
    const bodyDef = new b2BodyDef();
    bodyDef.type = b2BodyType.b2_dynamicBody;
    bodyDef.position.Set(x + width / 2, y + height / 2);
    const body = world.CreateBody(bodyDef);
    const shape = new b2PolygonShape();
    shape.SetAsBox(width * 0.5, height * 0.5);
    body.SetUserData({
      name: userData.name,
      durability: 0,
    });
    const filter = new b2Filter();
    filter.categoryBits = Constants.BOX_CATEGORY_BIT;
    filter.maskBits = Constants.BOX_CATEGORY_BIT;
    body.CreateFixture(shape);
    return body;
  };

  const createPig = (
    world: b2World,
    x: number,
    y: number,
    width: number,
    height: number,
    userData: {
      name: string;
    }
  ): b2Body => {
    const bodyDef = new b2BodyDef();
    bodyDef.type = b2BodyType.b2_dynamicBody;
    bodyDef.position.Set(x + width / 2, y + height / 2);
    const body = world.CreateBody(bodyDef);
    const shape = new b2PolygonShape();
    shape.SetAsBox(width * 0.5, height * 0.5);
    body.SetUserData({
      name: userData.name,
      durability: 0,
    });
    const filter = new b2Filter();
    filter.categoryBits = Constants.PIG_CATEGORY_BIT;
    filter.maskBits = Constants.PIG_MASK_BIT;
    body.CreateFixture(shape);
    return body;
  };

  const gl = viewport.getContext();
  const shapeRenderer = new ShapeRenderer(gl);
  const inputHandler = new ViewportInputHandler(viewport);
  const camera = viewport.getCamera();
  const batch = new PolygonBatch(gl);
  camera.setYDown(true);
  batch.setYDown(true);

  const physicWorld = new b2World({
    x: 0,
    y: 10,
  });
  const BALL_RADIUS = 0.2;

  let offset = 0.5;
  let birdNumber = 1;
  let bird: b2Body[] = [
    createBall(physicWorld, 2, 3.45, BALL_RADIUS, "YellowBird"),
  ];

  for (let i = 0; i < 1; i++) {
    bird.push(
      createBall(physicWorld, 1.5 - offset * i, 3.85, BALL_RADIUS, "RedBird")
    );
  }
  for (let i = 1; i < 3; i++) {
    bird.push(
      createBall(physicWorld, 1.5 - offset * i, 3.85, BALL_RADIUS, "YellowBird")
    );
  }
  const BOX_SIZE = 0.5;
  const PIG_SIZE = 0.3;
  let pigs: b2Body[] = [];
  let boxes: b2Body[] = [];
  let birdOnSlingShot = true;
  let mapData: any;
  levelState.transition = false;
  levelState.birdCount = 0;
  levelState.conditionWin = false;

  mapData = await fetch(`./level${levelState.currentLevel}.tmj`).then((res) =>
    res.json()
  );

  let wallData = mapData.layers.find((l: any) => l.name === "walls").objects;
  let boxData = mapData.layers.find((b: any) => b.name === "boxes").objects;
  let pigsData = mapData.layers.find((p: any) => p.name === "pigs").objects;

  for (let wall of wallData) {
    createWall(
      physicWorld,
      wall.x / Constants.METER_TO_WORLD,
      wall.y / Constants.METER_TO_WORLD,
      wall.width / Constants.METER_TO_WORLD,
      wall.height / Constants.METER_TO_WORLD
    );
  }
  for (let box of boxData) {
    boxes.push(
      createBox(
        physicWorld,
        box.x / Constants.METER_TO_WORLD,
        box.y / Constants.METER_TO_WORLD,
        BOX_SIZE,
        BOX_SIZE,
        {
          name: `box`,
        }
      )
    );
  }
  for (let pig of pigsData) {
    pigs.push(
      createPig(
        physicWorld,
        pig.x / Constants.METER_TO_WORLD,
        pig.y / Constants.METER_TO_WORLD,
        PIG_SIZE,
        PIG_SIZE,
        {
          name: `pig`,
        }
      )
    );
  }

  const originPosition = new Vector2(
    bird[0].GetPosition().x * Constants.METER_TO_WORLD,
    bird[0].GetPosition().y * Constants.METER_TO_WORLD
  );
  let slingPos = new Vector2(
    bird[0].GetPosition().x * Constants.METER_TO_WORLD,
    bird[0].GetPosition().y * Constants.METER_TO_WORLD
  );
  let specialSkillOfYellowBird: b2Body[] = [];

  const world = new World();
  const contactListener = new b2ContactListener();

  gl.clearColor(0, 0, 0, 1);
  physicWorld.SetContactListener(contactListener);

  world.register("inputHandler", inputHandler);
  world.register("contactListener", contactListener);
  world.register("gl", gl);
  world.register("shapeRenderer", shapeRenderer);
  world.register("assetManager", assetManager);
  world.register("viewport", viewport);
  world.register("batch", batch);
  world.register("bird", bird);
  world.register("levelState", levelState);
  world.register("boxes", boxes);
  world.register("pigs", pigs);
  world.register("originPosition", originPosition);
  world.register("slingPos", slingPos);
  world.register("physicWorld", physicWorld);
  world.register("birdOnSlingShot", birdOnSlingShot);
  world.register("birdNumber", birdNumber);
  world.register("specialSkillOfYellowBird", specialSkillOfYellowBird);

  world.addSystem(new BackgroundRenderSystem(), false);
  world.addSystem(new ShapeRendererSystem(), false);
  world.addSystem(new inputHandlerSystem(), false);
  world.addSystem(new BirdRenderSystem(), false);
  world.addSystem(new BoxesAndPigsRenderSystem(), false);
  world.addSystem(new BoxAndPigSystem(), false);
  world.addSystem(new SlingshotRenderSystem(), false);
  world.addSystem(new ContactListenerSystem(), false);
  world.addSystem(new NextLevelSystem(), false);

  return {
    update(delta: number) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      batch.setProjection(camera.combined);
      shapeRenderer.setProjection(camera.combined);
      world.setDelta(delta);
      world.processActiveSystem();
      world.processPassiveSystem();
      physicWorld.Step(delta, 8, 3);
      levelState.remainingTimeOfUseSpecialSkill -= delta;
    },
    dispose(): void {
      batch.dispose();
      inputHandler.cleanup();
    },
  };
};
