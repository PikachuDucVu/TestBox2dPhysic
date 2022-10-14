import {
  b2Body,
  b2BodyDef,
  b2BodyType,
  b2CircleShape,
  b2Filter,
  b2FixtureDef,
  b2PolygonShape,
  b2World,
} from "box2d.ts";
import { Constants } from "../Constant";

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
