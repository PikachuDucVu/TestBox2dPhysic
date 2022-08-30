import {
  b2Body,
  b2BodyDef,
  b2BodyType,
  b2CircleShape,
  b2ContactListener,
  b2FixtureDef,
  b2PolygonShape,
  b2World,
  b2_pi,
} from "box2d.ts";
import {
  Color,
  createGameLoop,
  createStage,
  createViewport,
  InputEvent,
  PolygonBatch,
  ShapeRenderer,
  Texture,
  Vector2,
  ViewportInputHandler,
} from "gdxts";

const WORLD_WIDTH = 1000;
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
  fixtureDef.density = 0.9;
  fixtureDef.restitution = 0.15; // bounce ball
  fixtureDef.friction = 0.7;

  const body = world.CreateBody(bodyDef);
  body.CreateFixture(fixtureDef);
  // body.CreateFixture(shape);
  return body;
};

const createBox = (
  world: b2World,
  x: number,
  y: number,
  width: number,
  height: number
): b2Body => {
  const bodyDef = new b2BodyDef();
  bodyDef.type = b2BodyType.b2_dynamicBody;
  bodyDef.position.Set(x + width / 2, y + height / 2);
  const body = world.CreateBody(bodyDef);
  const shape = new b2PolygonShape();
  shape.SetAsBox(width * 0.5, height * 0.5);
  body.SetAwake(false);
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

  const pig = await Texture.load(gl, "./pig.png");
  const bird = await Texture.load(gl, "./bird.png");
  const background = await Texture.load(gl, "./background.png");
  const mapData = await fetch("./untitled.tmj").then((res) => res.json());
  const wallData = mapData.layers.find((l: any) => l.name === "walls").objects;
  const shapeRenderer = new ShapeRenderer(gl);
  const listener = new b2ContactListener();

  const world = new b2World({
    x: 0,
    y: 10,
  });

  for (let wall of wallData) {
    createWall(
      world,
      wall.x / METER_TO_WORLD,
      wall.y / METER_TO_WORLD,
      wall.width / METER_TO_WORLD,
      wall.height / METER_TO_WORLD
    );
  }

  let spaceOfEachBoxes = 0;
  const BOX_SIZE = 0.5;
  const boxes: b2Body[] = [];
  for (let i = 0; i < 3; i++) {
    boxes.push(
      createBox(world, 8, (spaceOfEachBoxes += 1), BOX_SIZE, BOX_SIZE)
    );
  }

  const BALL_RADIUS = 0.2;
  const ball = createBall(world, 2, 3.5, BALL_RADIUS);
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
    ball.SetType(b2BodyType.b2_dynamicBody);
    ball.ApplyLinearImpulseToCenter(
      {
        x: (originPosition.x - slingPos.x) / METER_TO_WORLD,
        y: (originPosition.y - slingPos.y) / METER_TO_WORLD,
      },
      true
    );
  });

  gl.clearColor(0, 0, 0, 1);
  createGameLoop((delta: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT);
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

    for (let box of boxes) {
      // shapeRenderer.rect(
      //   true,
      //   box.GetPosition().x * METER_TO_WORLD - (BOX_SIZE * METER_TO_WORLD) / 2,
      //   box.GetPosition().y * METER_TO_WORLD - (BOX_SIZE * METER_TO_WORLD) / 2,
      //   BOX_SIZE * METER_TO_WORLD,
      //   BOX_SIZE * METER_TO_WORLD,
      //   Color.GREEN
      // );
      // console.log(box.GetContactList());
    }
    shapeRenderer.end();

    batch.begin();
    for (let box of boxes) {
      batch.draw(
        pig,
        box.GetPosition().x * METER_TO_WORLD - (BOX_SIZE * METER_TO_WORLD) / 2,
        box.GetPosition().y * METER_TO_WORLD - (BOX_SIZE * METER_TO_WORLD) / 2,
        BOX_SIZE * METER_TO_WORLD,
        BOX_SIZE * METER_TO_WORLD
      );
      // console.log(box.GetContactList());
    }

    batch.draw(
      bird,
      ball.GetPosition().x * METER_TO_WORLD - 25,
      ball.GetPosition().y * METER_TO_WORLD - 25,
      BOX_SIZE * METER_TO_WORLD,
      BOX_SIZE * METER_TO_WORLD
    );

    batch.end();
  });
};
init();
