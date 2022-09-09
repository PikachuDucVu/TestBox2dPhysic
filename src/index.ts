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
  InputEvent,
  PlayMode,
  PolygonBatch,
  ShapeRenderer,
  Texture,
  TextureRegion,
  Vector2,
  ViewportInputHandler,
} from "gdxts";
import { BackgroundRenderSystem } from "./system/BackgroundRenderSystem";
import { BirdRenderSystem } from "./system/BirdRenderSystem";

const WORLD_WIDTH = 1300;
const WORLD_HEIGHT = 500;

const contactListener = new b2ContactListener();

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
  // fixtureDef.density = 1;
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

const WALL_COLOR = new Color(0.5, 0.5, 0.5, 1);
const METER_TO_WORLD = 100;

export const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(canvas, WORLD_WIDTH, WORLD_HEIGHT);
  const gl = viewport.getContext();
  const camera = viewport.getCamera();
  const batch = new PolygonBatch(gl);

  const assetManager = new AssetManager(gl);
  await assetManager.loadTexture("./background.png", "bg");
  await assetManager.loadTexture("./bird.png", "birdAsset");

  camera.setYDown(true);
  batch.setYDown(true);

  const physicWorld = new b2World({
    x: 0,
    y: 10,
  });
  const BALL_RADIUS = 0.2;
  let bird = createBall(physicWorld, 2, 3.45, BALL_RADIUS);

  const world = new World();
  world.register("gl", gl);
  world.register("assetManager", assetManager);
  world.register("batch", batch);
  world.register("bird", bird);
  world.addSystem(new BackgroundRenderSystem(), false);
  world.addSystem(new BirdRenderSystem(), false);

  const slingShot = await Texture.load(gl, "./slingshot.png");
  const pigAsset = await Texture.load(gl, "./pigAsset.png");
  const mapData = await fetch("./untitled.tmj").then((res) => res.json());
  const wallData = mapData.layers.find((l: any) => l.name === "walls").objects;
  const shapeRenderer = new ShapeRenderer(gl);

  const boxTexture = await Texture.load(gl, "./testAnimation1.png");
  const boxesRegions = TextureRegion.splitTexture(boxTexture, 1, 4);
  const pigTexture = await TextureRegion.splitTexture(pigAsset, 2, 1);

  let frameDuration = 0.01;
  const boxAnimation = new Animation(boxesRegions.slice(0, 4), frameDuration);
  const pigAnimation = new Animation(pigTexture.slice(0, 2), frameDuration);

  const boxRegions = [
    boxAnimation.getKeyFrame(0, PlayMode.NORMAL),
    boxAnimation.getKeyFrame(0, PlayMode.NORMAL),
    boxAnimation.getKeyFrame(0, PlayMode.NORMAL),
    boxAnimation.getKeyFrame(0, PlayMode.NORMAL),
    boxAnimation.getKeyFrame(0, PlayMode.NORMAL),
    boxAnimation.getKeyFrame(0, PlayMode.NORMAL),
  ];
  const pigRegions = [
    pigAnimation.getKeyFrame(0, PlayMode.NORMAL),
    pigAnimation.getKeyFrame(0, PlayMode.NORMAL),
  ];

  for (let wall of wallData) {
    createWall(
      physicWorld,
      wall.x / METER_TO_WORLD,
      wall.y / METER_TO_WORLD,
      wall.width / METER_TO_WORLD,
      wall.height / METER_TO_WORLD
    );
  }

  const BOX_SIZE = 0.5;
  const PIG_SIZE = 0.3;
  const pigs: b2Body[] = [];
  const boxes: b2Body[] = [];
  let pigNumber = 0;
  let boxNumber = 0;
  let positionBoxX = 6;
  let positionBoxY = 4.3;

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

  let hasBirdOnSlingShot = true;
  const originPosition = new Vector2(
    bird.GetPosition().x * METER_TO_WORLD,
    bird.GetPosition().y * METER_TO_WORLD
  );
  let slingPos = new Vector2(
    bird.GetPosition().x * METER_TO_WORLD,
    bird.GetPosition().y * METER_TO_WORLD
  );

  const inputHandler = new ViewportInputHandler(viewport);

  inputHandler.addEventListener(InputEvent.TouchMove, () => {
    if (inputHandler.isTouched()) {
      slingPos = inputHandler.getTouchedWorldCoord();
    }
  });
  inputHandler.addEventListener(InputEvent.TouchEnd, () => {
    if (hasBirdOnSlingShot) {
      bird.SetType(b2BodyType.b2_dynamicBody);
      bird.ApplyLinearImpulseToCenter(
        {
          x: (7 * (originPosition.x - slingPos.x)) / METER_TO_WORLD,
          y: (7 * (originPosition.y - slingPos.y)) / METER_TO_WORLD,
        },
        true
      );
      hasBirdOnSlingShot = false;
    }
  });
  let delayTime = 0;

  window.addEventListener("keydown", function (e) {
    if (!hasBirdOnSlingShot && e.key === "r") {
      physicWorld.DestroyBody(bird);
      bird = createBall(physicWorld, 2, 3.5, BALL_RADIUS);
      hasBirdOnSlingShot = true;
    }
  });

  gl.clearColor(0, 0, 0, 1);
  contactListener.BeginContact = function (contact: b2Contact) {
    if (delayTime >= 1) {
      const fixtureAData = contact.GetFixtureA().GetBody().GetUserData();
      const fixtureBData = contact.GetFixtureB().GetBody().GetUserData();

      // if (fixtureBData !== "bird") return;

      if (fixtureAData.name && fixtureAData.name.startsWith("box")) {
        fixtureAData.durability += 1;
      }
      if (fixtureAData.name && fixtureAData.name.startsWith("pig")) {
        fixtureAData.durability += 1;
      }
    }
    // console.log(
    //   contact.GetFixtureA().GetBody().GetUserData(),
    //   contact.GetFixtureB().GetBody().GetUserData()
    // );
    // console.log(contact);
  };

  physicWorld.SetContactListener(contactListener);

  const updateBoxRegionByDurability = (index: number, durability: number) => {
    boxRegions[index] = boxAnimation.getKeyFrame(
      frameDuration * durability,
      PlayMode.NORMAL
    );
  };
  const updatePigRegionByDurability = (index: number, durability: number) => {
    pigRegions[index] = pigAnimation.getKeyFrame(
      frameDuration * durability,
      PlayMode.NORMAL
    );
  };
  createGameLoop((delta: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT);

    batch.setProjection(camera.combined);
    world.setDelta(delta);
    world.processActiveSystem();
    world.processPassiveSystem();

    for (let i = 0; i < boxes.length; i++) {
      const elementBox = boxes[i];
      const boxDurability = elementBox.GetUserData().durability;
      if (typeof boxDurability === "number") {
        if (boxDurability <= 4) {
          updateBoxRegionByDurability(i, boxDurability);
        } else {
          physicWorld.DestroyBody(boxes[i]);
          boxes.splice(i, 1);
        }
      }
    }
    for (let i = 0; i < pigs.length; i++) {
      const elementPig = pigs[i];
      const pigDurability = elementPig.GetUserData().durability;
      if (typeof pigDurability === "number") {
        if (pigDurability <= 1) {
          updatePigRegionByDurability(i, pigDurability);
        } else {
          physicWorld.DestroyBody(pigs[i]);
          pigs.splice(i, 1);
        }
      }
    }

    physicWorld.Step(delta, 8, 3);

    shapeRenderer.setProjection(camera.combined);
    shapeRenderer.begin();

    shapeRenderer.circle(
      true,
      slingPos.x,
      slingPos.y,
      0.1 * METER_TO_WORLD,
      Color.BLUE
    );
    shapeRenderer.end();

    batch.begin();

    for (let i = 0; i < boxes.length; i++) {
      boxRegions[i].draw(
        batch,
        boxes[i].GetPosition().x * METER_TO_WORLD -
          (BOX_SIZE * METER_TO_WORLD) / 2,
        boxes[i].GetPosition().y * METER_TO_WORLD -
          (BOX_SIZE * METER_TO_WORLD) / 2,
        BOX_SIZE * METER_TO_WORLD,
        BOX_SIZE * METER_TO_WORLD
      );
    }

    batch.draw(
      slingShot,
      2 * METER_TO_WORLD,
      3.5 * METER_TO_WORLD,
      0.25 * METER_TO_WORLD,
      0.7 * METER_TO_WORLD
    );
    for (let i = 0; i < pigs.length; i++) {
      pigRegions[i].draw(
        batch,
        pigs[i].GetPosition().x * METER_TO_WORLD -
          (PIG_SIZE * METER_TO_WORLD) / 2,
        pigs[i].GetPosition().y * METER_TO_WORLD -
          (PIG_SIZE * METER_TO_WORLD) / 2,
        PIG_SIZE * METER_TO_WORLD,
        PIG_SIZE * METER_TO_WORLD
      );
    }
    // console.log(box.GetContactList());

    delayTime += delta;
    batch.end();
  });
};
init();
