import { b2Contact, b2ContactListener, b2World } from "box2d.ts";
import { System, Inject } from "flat-ecs";

export class ContactListenerSystem extends System {
  @Inject("contactListener") contactListener: b2ContactListener;
  @Inject("physicWorld") physicWorld: b2World;
  @Inject("delayTime") delayTime: number;

  initialized(): void {
    this.contactListener.BeginContact = function (contact: b2Contact) {
      const fixtureAData = contact.GetFixtureA().GetBody().GetUserData();
      if (fixtureAData.name && fixtureAData.name.startsWith("box")) {
        fixtureAData.durability += 1;
      }
      if (fixtureAData.name && fixtureAData.name.startsWith("pig")) {
        fixtureAData.durability += 1;
      }
    };
    this.physicWorld.SetContactListener(this.contactListener);
  }

  process(): void {}
}
