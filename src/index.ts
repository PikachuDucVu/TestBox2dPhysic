import {
  b2Body,
  b2BodyDef,
  b2BodyType,
  b2CircleShape,
  b2Contact,
  b2ContactListener,
  b2FixtureDef,
  b2PolygonShape,
  b2World,
} from "box2d.ts";
import { World } from "flat-ecs";
import {
  Animation,
  AssetManager,
  Color,
  createGameLoop,
  createStage,
  createViewport,
  PolygonBatch,
  ShapeRenderer,
  Vector2,
  ViewportInputHandler,
} from "gdxts";
import { ContactListenerSystem } from "./ContactListenerSystem";
import { BackgroundRenderSystem } from "./system/BackgroundRenderSystem";
import { BirdRenderSystem } from "./system/BirdRenderSystem";
import { BoxesAndPigsRenderSystem } from "./system/BoxesAndPigsRenderSystem";
import { inputHandlerSystem } from "./system/inputHandleSystem";
import { ShapeRendererSystem } from "./system/ShapeRendererSystem";
import { SlingshotRenderSystem } from "./system/SlingshotRenderSystem";

const WORLD_WIDTH = 1300;
const WORLD_HEIGHT = 500;
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
};

const createBall = (
  world: b2World,
  x: number,
  y: number,
  radius: number
): b2Body => {
  const bodyDef = new b2BodyDef();
  bodyDef.type = b2BodyType.b2_staticBody;
  bodyDef.position.Set(x + radius / 2, y + radius / 2);
  const circle = new b2CircleShape();
  circle.m_radius = radius;
  const fixtureDef = new b2FixtureDef();
  fixtureDef.shape = circle;
  fixtureDef.restitution = 0.5; // bounce bird
  fixtureDef.friction = 1;
  fixtureDef.shape = circle;
  fixtureDef.userData = "birdFixture";

  const body = world.CreateBody(bodyDef);
  body.CreateFixture(fixtureDef);
  body.SetUserData("bird");
  return body;
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
  body.CreateFixture(shape);
  return body;
};

const METER_TO_WORLD = 100;

export const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(canvas, WORLD_WIDTH, WORLD_HEIGHT);
  const gl = viewport.getContext();
  const camera = viewport.getCamera();
  const batch = new PolygonBatch(gl);
  const shapeRenderer = new ShapeRenderer(gl);
  const inputHandler = new ViewportInputHandler(viewport);
  const assetManager = new AssetManager(gl);
  const contactListener = new b2ContactListener();

  await assetManager.loadTexture("./background.png", "bg");
  await assetManager.loadTexture("./bird.png", "birdAsset");
  await assetManager.loadTexture("./pigAsset.png", "pigAsset");
  await assetManager.loadTexture("./testAnimation1.png", "boxAsset");
  await assetManager.loadTexture("./slingshot.png", "slingShot");
  await assetManager.loadTexture("./testAnimation1.png", "boxTexture");

  camera.setYDown(true);
  batch.setYDown(true);

  const physicWorld = new b2World({
    x: 0,
    y: 10,
  });
  const BALL_RADIUS = 0.2;
  let bird = createBall(physicWorld, 2, 3.45, BALL_RADIUS);
  const mapData = await fetch("./untitled.tmj").then((res) => res.json());
  const wallData = mapData.layers.find((l: any) => l.name === "walls").objects;

  for (let wall of wallData) {
    createWall(
      physicWorld,
      wall.x / METER_TO_WORLD,
      wall.y / METER_TO_WORLD,
      wall.width / METER_TO_WORLD,
      wall.height / METER_TO_WORLD
    );
  }

  let delayTime = 0;
  const BOX_SIZE = 0.5;
  const PIG_SIZE = 0.3;
  const pigs: b2Body[] = [];
  const boxes: b2Body[] = [];
  let pigNumber = 0;
  let boxNumber = 0;
  let positionBoxX = 6;
  let positionBoxY = 4.3;

  const originPosition = new Vector2(
    bird.GetPosition().x * METER_TO_WORLD,
    bird.GetPosition().y * METER_TO_WORLD
  );
  let slingPos = new Vector2(
    bird.GetPosition().x * METER_TO_WORLD,
    bird.GetPosition().y * METER_TO_WORLD
  );

  for (let i = 0; i < 3; i++) {
    positionBoxX = 6 + i * 0.4;
    for (let j = 0; j <= i; j++) {
      boxes.push(
        createBox(
          physicWorld,
          (positionBoxX += 0.51),
          (positionBoxY -= 0.55),
          BOX_SIZE,
          BOX_SIZE,
          {
            name: `box ${boxNumber++}`,
          }
        )
      );
    }
    if (i < 2) {
      pigs.push(
        createBox(
          physicWorld,
          positionBoxX + 0.5,
          positionBoxY - 0.25,
          PIG_SIZE,
          PIG_SIZE,
          {
            name: `pig ${pigNumber++}`,
          }
        )
      );
    }
  }

  const world = new World();
  world.register("inputHandler", inputHandler);
  world.register("contactListener", contactListener);
  world.register("delayTime", delayTime);
  world.register("gl", gl);
  world.register("shapeRenderer", shapeRenderer);
  world.register("assetManager", assetManager);
  world.register("batch", batch);
  world.register("bird", bird);
  world.register("boxes", boxes);
  world.register("pigs", pigs);
  world.register("originPosition", originPosition);
  world.register("slingPos", slingPos);
  world.register("physicWorld", physicWorld);
  world.addSystem(new BackgroundRenderSystem(), false);
  world.addSystem(new ShapeRendererSystem(), false);
  world.addSystem(new inputHandlerSystem(), false);
  world.addSystem(new BirdRenderSystem(), false);
  world.addSystem(new BoxesAndPigsRenderSystem(), false);
  world.addSystem(new SlingshotRenderSystem(), false);
  world.addSystem(new ContactListenerSystem(), false);

  console.log(contactListener);
  gl.clearColor(0, 0, 0, 1);
  physicWorld.SetContactListener(contactListener);

  createGameLoop((delta: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    batch.setProjection(camera.combined);
    shapeRenderer.setProjection(camera.combined);
    world.setDelta(delta);
    world.processActiveSystem();
    world.processPassiveSystem();
    physicWorld.Step(delta, 8, 3);
  });
};
init();
