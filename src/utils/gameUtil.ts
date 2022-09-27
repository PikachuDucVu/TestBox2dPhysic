import {
  b2Body,
  b2BodyDef,
  b2BodyType,
  b2CircleShape,
  b2Filter,
  b2FixtureDef,
  b2World,
} from "box2d.ts";
import { Constants } from "../Constants";

export const createBall = (
  world: b2World,
  x: number,
  y: number,
  radius: number,
  userData: string
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

  fixtureDef.filter.categoryBits = Constants.BIRD_CATEGORY_BIT;
  fixtureDef.filter.maskBits = Constants.BIRD_MASK_BIT;

  const body = world.CreateBody(bodyDef);
  body.CreateFixture(fixtureDef);
  body.SetUserData(userData);
  return body;
};

export const createCloneBird = (
  world: b2World,
  x: number,
  y: number,
  radius: number,
  userData: string
): b2Body => {
  const bodyDef = new b2BodyDef();
  bodyDef.type = b2BodyType.b2_dynamicBody;
  bodyDef.position.Set(x + radius / 2, y + radius / 2);
  const circle = new b2CircleShape();
  circle.m_radius = radius;
  const fixtureDef = new b2FixtureDef();
  fixtureDef.shape = circle;
  fixtureDef.restitution = 0.5; // bounce bird
  fixtureDef.friction = 1;
  fixtureDef.shape = circle;

  fixtureDef.filter.categoryBits = Constants.BIRD_CATEGORY_BIT;
  fixtureDef.filter.maskBits = Constants.BIRD_MASK_BIT;

  const body = world.CreateBody(bodyDef);
  body.CreateFixture(fixtureDef);
  body.SetUserData(userData);
  return body;
};
