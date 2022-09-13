import { System, Inject } from "flat-ecs";
import { Color, ShapeRenderer, Vector2 } from "gdxts";
import { Constants } from "../Constants";

export class ShapeRendererSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("slingPos") slingPos: Vector2;

  initialized() {}

  process(): void {
    this.shapeRenderer.begin();
    this.shapeRenderer.circle(
      true,
      this.slingPos.x,
      this.slingPos.y,
      0.1 * Constants.METER_TO_WORLD,
      Color.BLUE
    );
    this.shapeRenderer.end();
  }
}
