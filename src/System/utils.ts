import {
  b2Body,
  b2BodyDef,
  b2BodyType,
  b2CircleShape,
  b2FixtureDef,
  b2PolygonShape,
  b2World,
} from "box2d.ts";

export const createGround = (
  physicWorld: b2World,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const bodyDef = new b2BodyDef();
  bodyDef.type = b2BodyType.b2_staticBody;
  bodyDef.position.Set(x, y);
  const body = physicWorld.CreateBody(bodyDef);
  const shape = new b2PolygonShape();
  shape.SetAsBox(width / 2, height / 2, { x: width / 2, y: -height / 2 });

  body.SetUserData("ground");
  body.CreateFixture(shape);
  return body;
};

export const createBall = (
  physicWorld: b2World,
  x: number,
  y: number,
  radius: number,
  categoryBits: number,
  maskBits: number
): b2Body => {
  const bodyDef = new b2BodyDef();
  bodyDef.type = b2BodyType.b2_staticBody;
  bodyDef.position.Set(x + radius / 2, y + radius / 2);
  const circle = new b2CircleShape();
  circle.m_radius = radius;
  const fixtureDef = new b2FixtureDef();
  fixtureDef.shape = circle;

  fixtureDef.filter.categoryBits = categoryBits;
  fixtureDef.filter.maskBits = maskBits;

  const body = physicWorld.CreateBody(bodyDef);
  body.CreateFixture(fixtureDef);
  body.SetUserData("ball");
  return body;
};

export const createPerson = (
  physicWorld: b2World,
  x: number,
  y: number,
  width: number,
  height: number,
  userData: { name: string },
  categoryBits: number,
  maskBits: number
): b2Body => {
  const bodyDef = new b2BodyDef();
  bodyDef.type = b2BodyType.b2_dynamicBody;
  bodyDef.position.Set(x + width / 2, y + height / 2);
  const body = physicWorld.CreateBody(bodyDef);
  const shape = new b2PolygonShape();
  shape.SetAsBox(width / 2, height / 2, { x: width / 2, y: -height / 2 });
  body.SetUserData({
    name: userData.name,
    durability: 0,
  });

  body.CreateFixture(shape);
  return body;
};

export const createArray = (
  physicWorld: b2World,
  x: number,
  y: number,
  width: number,
  height: number,
  angle: number,
  categoryBits: number,
  maskBits: number
): b2Body => {
  const bodyDef = new b2BodyDef();
  bodyDef.type = b2BodyType.b2_staticBody;
  bodyDef.position.Set(x, y);
  const body = physicWorld.CreateBody(bodyDef);
  const shape = new b2PolygonShape();

  shape.SetAsBox(width / 2, height / 2, {
    x: width / 4 - 0.1,
    y: height / 4 - 0.2,
  });
  body.SetUserData("Array");
  body.SetAngle(angle);

  const fixtureDef = new b2FixtureDef();
  fixtureDef.shape = shape;
  fixtureDef.filter.categoryBits = categoryBits;
  fixtureDef.filter.maskBits = maskBits;

  body.CreateFixture(fixtureDef);

  return body;
};

export const head = (physicWorld: b2World, startX: number, startY: number) => {
  const bodyDef = new b2BodyDef();
  bodyDef.type = b2BodyType.b2_dynamicBody;
  const fixtureDef = new b2FixtureDef();
  fixtureDef.shape = new b2CircleShape(1.25 / 10);
  fixtureDef.density = 1;
  fixtureDef.friction = 0.4;
  fixtureDef.restitution = 0.3;
  bodyDef.position.Set(startX, startY);
  const body = physicWorld.CreateBody(bodyDef);
  body.SetUserData("body");
  body.CreateFixture(fixtureDef);
  return body;
};

export const torso1 = (
  physicWorld: b2World,
  startX: number,
  startY: number
) => {
  const bodyDef = new b2BodyDef();
  const shape = new b2PolygonShape();
  const fixtureDef = new b2FixtureDef();
  shape.SetAsBox(1.5 / 10, 1.0 / 10);
  fixtureDef.density = 1.0;
  fixtureDef.friction = 0.4;
  fixtureDef.restitution = 0.1;
  fixtureDef.shape = shape;
  bodyDef.position.Set(startX, startY - 3.8 / 10);
  const body = physicWorld.CreateBody(bodyDef);
  body.SetUserData("body");
  body.CreateFixture(fixtureDef);
  return body;
};

export const torso2 = (
  physicWorld: b2World,
  startX: number,
  startY: number
) => {
  const bodyDef = new b2BodyDef();
  const shape = new b2PolygonShape();
  const fixtureDef = new b2FixtureDef();
  shape.SetAsBox(1.5 / 10, 1.0 / 10);
  fixtureDef.density = 1.0;
  fixtureDef.friction = 0.4;
  fixtureDef.restitution = 0.1;
  fixtureDef.shape = shape;
  bodyDef.position.Set(startX, startY - 4.3 / 10);
  const body = physicWorld.CreateBody(bodyDef);
  body.CreateFixture(fixtureDef);
  body.SetUserData("body");
  return body;
};

export const torso3 = (
  physicWorld: b2World,
  startX: number,
  startY: number
) => {
  const bodyDef = new b2BodyDef();
  const shape = new b2PolygonShape();
  const fixtureDef = new b2FixtureDef();
  shape.SetAsBox(1.5 / 10, 1.0 / 10);
  fixtureDef.density = 1.0;
  fixtureDef.friction = 0.4;
  fixtureDef.restitution = 0.1;
  fixtureDef.shape = shape;
  bodyDef.position.Set(startX, startY - 5.8 / 10);
  const body = physicWorld.CreateBody(bodyDef);
  body.SetUserData("body");
  body.CreateFixture(fixtureDef);
  return body;
};

export const leftArm = (
  physicWorld: b2World,
  startX: number,
  startY: number
) => {
  const bodyDef = new b2BodyDef();
  const shape = new b2PolygonShape();
  const fixtureDef = new b2FixtureDef();
  fixtureDef.density = 1;
  fixtureDef.friction = 0.4;
  fixtureDef.restitution = 0.1;
  fixtureDef.shape = shape;
  shape.SetAsBox(0.65 / 10, 1.8 / 10);
  bodyDef.position.Set(startX - 3.0 / 10, startY - 4.0 / 10);
  const body = physicWorld.CreateBody(bodyDef);
  body.SetUserData("body");
  body.CreateFixture(fixtureDef);
  return body;
};

export const rightArm = (
  physicWorld: b2World,
  startX: number,
  startY: number
) => {
  const bodyDef = new b2BodyDef();
  const shape = new b2PolygonShape();
  const fixtureDef = new b2FixtureDef();
  shape.SetAsBox(0.65 / 10, 1.8 / 10);
  fixtureDef.density = 1;
  fixtureDef.friction = 0.4;
  fixtureDef.restitution = 0.1;
  fixtureDef.shape = shape;
  bodyDef.position.Set(startX + 3.0 / 10, startY - 4.0 / 10);
  const body = physicWorld.CreateBody(bodyDef);
  body.SetUserData("body");
  body.CreateFixture(fixtureDef);
  return body;
};

export const upperLeftLeg = (
  physicWorld: b2World,
  startX: number,
  startY: number
) => {
  const bodyDef = new b2BodyDef();
  const shape = new b2PolygonShape();
  const fixtureDef = new b2FixtureDef();
  shape.SetAsBox(0.75 / 10, 2.2 / 10);
  fixtureDef.density = 1;
  fixtureDef.friction = 0.4;
  fixtureDef.restitution = 0.1;
  fixtureDef.shape = shape;
  bodyDef.position.Set(startX - 0.8 / 10, startY - 8.5 / 10);
  const body = physicWorld.CreateBody(bodyDef);
  body.SetUserData("body");
  body.CreateFixture(fixtureDef);
  return body;
};

export const upperRightLeg = (
  physicWorld: b2World,
  startX: number,
  startY: number
) => {
  const bodyDef = new b2BodyDef();
  const shape = new b2PolygonShape();
  const fixtureDef = new b2FixtureDef();
  shape.SetAsBox(0.75 / 10, 2.2 / 10);
  fixtureDef.density = 1;
  fixtureDef.friction = 0.4;
  fixtureDef.restitution = 0.1;
  fixtureDef.shape = shape;
  bodyDef.position.Set(startX + 0.8 / 10, startY - 8.5 / 10);
  const body = physicWorld.CreateBody(bodyDef);
  body.SetUserData("body");
  body.CreateFixture(fixtureDef);
  return body;
};

export const lowerLeftLeg = (
  physicWorld: b2World,
  startX: number,
  startY: number
) => {
  const bodyDef = new b2BodyDef();
  const shape = new b2PolygonShape();
  const fixtureDef = new b2FixtureDef();
  shape.SetAsBox(0.6 / 10, 2.0 / 10);
  fixtureDef.density = 1;
  fixtureDef.friction = 0.4;
  fixtureDef.restitution = 0.1;
  fixtureDef.shape = shape;
  bodyDef.position.Set(startX - 0.8 / 10, startY - 12.0 / 10);
  const body = physicWorld.CreateBody(bodyDef);
  body.SetUserData("body");
  body.CreateFixture(fixtureDef);
  return body;
};

export const lowerRightLeg = (
  physicWorld: b2World,
  startX: number,
  startY: number
) => {
  const bodyDef = new b2BodyDef();
  const shape = new b2PolygonShape();
  const fixtureDef = new b2FixtureDef();
  shape.SetAsBox(0.6 / 10, 2.0 / 10);
  fixtureDef.density = 1;
  fixtureDef.friction = 0.4;
  fixtureDef.restitution = 0.1;
  fixtureDef.shape = shape;
  bodyDef.position.Set(startX + 0.8 / 10, startY - 12.0 / 10);
  const body = physicWorld.CreateBody(bodyDef);
  body.SetUserData("body");
  body.CreateFixture(fixtureDef);
  return body;
};
