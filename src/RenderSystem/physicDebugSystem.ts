import {
  b2BodyType,
  b2CircleShape,
  b2PolygonShape,
  b2ShapeType,
  b2World,
} from "box2d.ts";
import { Inject, System } from "flat-ecs";
import { Color, ShapeRenderer, Vector2 } from "gdxts";
import { Constants } from "../Constant";

export class PhysicDebugSystem extends System {
  @Inject("physicWorld") physicWorld: b2World;
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;

  tmpVector2 = new Vector2(0, 0);
  vertices: number[] = [];
  debugColors: Map<b2BodyType, Color> = new Map<b2BodyType, Color>();
  initialized() {
    this.debugColors.set(b2BodyType.b2_dynamicBody, Color.MAGENTA);
    this.debugColors.set(b2BodyType.b2_kinematicBody, Color.GREEN);
    this.debugColors.set(b2BodyType.b2_staticBody, Color.GREEN);
    this.debugColors.set(b2BodyType.b2_unknown, Color.WHITE);
  }
  process(): void {
    this.shapeRenderer.begin();
    let body = this.physicWorld.GetBodyList();
    while (body) {
      const fixture = body.GetFixtureList();
      const bodyType = body.GetType();
      const position = body.GetPosition();
      let angle = body.GetAngle();
      if (body.GetUserData() === "Array") {
      }
      if (fixture) {
        const type = fixture.GetType();
        if (type === b2ShapeType.e_circleShape) {
          const data = fixture.GetShape() as b2CircleShape;
          this.shapeRenderer.circle(
            true,
            position.x * Constants.METER_TO_PHYSIC_WORLD,
            position.y * Constants.METER_TO_PHYSIC_WORLD,
            data.m_radius * Constants.METER_TO_PHYSIC_WORLD,
            this.debugColors.get(bodyType)
          );
        }
        if (type === b2ShapeType.e_polygonShape) {
          const data = fixture.GetShape() as b2PolygonShape;
          this.vertices.length = 0;
          if (body.GetUserData().name === "Array") {
            this.shapeRenderer.circle(
              true,
              position.x * Constants.METER_TO_PHYSIC_WORLD,
              position.y * Constants.METER_TO_PHYSIC_WORLD,
              10
            );
          }

          for (let i = 0; i < data.m_vertices.length; i++) {
            // if (body.GetAngle() === 50) {
            //   console.log(data.m_vertices);
            // }
            this.tmpVector2
              .set(data.m_vertices[0].x, data.m_vertices[0].y)
              .rotate(angle)
              .add(position.x, position.y)
              .scale(Constants.METER_TO_PHYSIC_WORLD);
            this.vertices.push(this.tmpVector2.x, this.tmpVector2.y);
            this.tmpVector2
              .set(data.m_vertices[1].x, data.m_vertices[1].y)
              .rotate(angle)
              .add(position.x, position.y)
              .scale(Constants.METER_TO_PHYSIC_WORLD);
            this.vertices.push(this.tmpVector2.x, this.tmpVector2.y);
            this.tmpVector2
              .set(data.m_vertices[2].x, data.m_vertices[2].y)
              .rotate(angle)
              .add(position.x, position.y)
              .scale(Constants.METER_TO_PHYSIC_WORLD);
            this.vertices.push(this.tmpVector2.x, this.tmpVector2.y);
            this.tmpVector2
              .set(data.m_vertices[3].x, data.m_vertices[3].y)
              .rotate(angle)
              .add(position.x, position.y)
              .scale(Constants.METER_TO_PHYSIC_WORLD);
            this.vertices.push(this.tmpVector2.x, this.tmpVector2.y);

            // this.vertices.push(
            //   (data.m_vertices[i].x + position.x) *
            //     Constants.METER_TO_PHYSIC_WORLD
            // );
            // this.vertices.push(
            //   (data.m_vertices[i].y + position.y) *
            //     Constants.METER_TO_PHYSIC_WORLD
            // );
          }
          // this.vertices.push(this.vertices[this.vertices.length - 2]);
          // this.vertices.push(this.vertices[1]);

          this.shapeRenderer.polygon(
            this.vertices,
            0,
            this.vertices.length,
            this.debugColors.get(bodyType)
          );
        }
      }
      body = body.GetNext();
    }

    this.shapeRenderer.end();
  }
}
