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
import {
  Animation,
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
  fixtureDef.restitution = 0.5; // bounce ball
  fixtureDef.friction = 1;
  fixtureDef.shape = circle;
  fixtureDef.userData = "ballFixture";

  const body = world.CreateBody(bodyDef);
  body.CreateFixture(fixtureDef);
  body.SetUserData("ball");
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

  camera.setYDown(true);
  batch.setYDown(true);

  const bird = await Texture.load(gl, "./bird.png");
  const slingShot = await Texture.load(gl, "./slingshot.png");
  const background = await Texture.load(gl, "./background.png");
  const pigAsset = await Texture.load(gl, "./pigAsset.png");
  const mapData = await fetch("./untitled.tmj").then((res) => res.json());
  const wallData = mapData.layers.find((l: any) => l.name === "walls").objects;
  const shapeRenderer = new ShapeRenderer(gl);
  const world = new b2World({
    x: 0,
    y: 10,
  });

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
      world,
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
          world,
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
          world,
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

  const BALL_RADIUS = 0.2;
  let ball = createBall(world, 2, 3.5, BALL_RADIUS);
  let hasBirdOnSlingShot = true;
  const originPosition = new Vector2(
    ball.GetPosition().x * METER_TO_WORLD,
    ball.GetPosition().y * METER_TO_WORLD
  );
  let slingPos = new Vector2(
    ball.GetPosition().x * METER_TO_WORLD,
    ball.GetPosition().y * METER_TO_WORLD
  );

  const inputHandler = new ViewportInputHandler(viewport);

  inputHandler.addEventListener(InputEvent.TouchMove, () => {
    if (inputHandler.isTouched()) {
      slingPos = inputHandler.getTouchedWorldCoord();
    }
  });
  inputHandler.addEventListener(InputEvent.TouchEnd, () => {
    if (hasBirdOnSlingShot) {
      ball.SetType(b2BodyType.b2_dynamicBody);
      ball.ApplyLinearImpulseToCenter(
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
      world.DestroyBody(ball);
      ball = createBall(world, 2, 3.5, BALL_RADIUS);
      hasBirdOnSlingShot = true;
    }
  });

  gl.clearColor(0, 0, 0, 1);
  contactListener.BeginContact = function (contact: b2Contact) {
    if (delayTime >= 1) {
      const fixtureAData = contact.GetFixtureA().GetBody().GetUserData();
      const fixtureBData = contact.GetFixtureB().GetBody().GetUserData();

      // if (fixtureBData !== "ball") return;

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

  world.SetContactListener(contactListener);

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

    for (let i = 0; i < boxes.length; i++) {
      const elementBox = boxes[i];
      const boxDurability = elementBox.GetUserData().durability;
      if (typeof boxDurability === "number") {
        if (boxDurability <= 4) {
          updateBoxRegionByDurability(i, boxDurability);
        } else {
          world.DestroyBody(boxes[i]);
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
          world.DestroyBody(pigs[i]);
          pigs.splice(i, 1);
        }
      }
    }

    world.Step(delta, 8, 3);
    batch.setProjection(camera.combined);

    shapeRenderer.setProjection(camera.combined);
    shapeRenderer.begin();
    shapeRenderer.rect(true, 0, 0, WORLD_WIDTH, WORLD_HEIGHT, Color.WHITE);

    for (let wall of wallData) {
      shapeRenderer.rect(
        true,
        wall.x,
        wall.y,
        wall.width,
        wall.height,
        WALL_COLOR
      );
    }
    shapeRenderer.rect(
      true,
      2 * METER_TO_WORLD,
      3.5 * METER_TO_WORLD,
      0.25 * METER_TO_WORLD,
      0.7 * METER_TO_WORLD,
      Color.MAGENTA
    );
    shapeRenderer.circle(
      true,
      ball.GetPosition().x * METER_TO_WORLD,
      ball.GetPosition().y * METER_TO_WORLD,
      BALL_RADIUS * METER_TO_WORLD,
      Color.RED
    );
    shapeRenderer.end();

    batch.begin();
    batch.draw(background, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    batch.end();

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

    batch.draw(
      bird,
      ball.GetPosition().x * METER_TO_WORLD - 25,
      ball.GetPosition().y * METER_TO_WORLD - 25,
      BOX_SIZE * METER_TO_WORLD,
      BOX_SIZE * METER_TO_WORLD
    );

    delayTime += delta;
    batch.end();
  });
};
init();
