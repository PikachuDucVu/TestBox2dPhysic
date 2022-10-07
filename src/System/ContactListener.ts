import { b2Contact, b2ContactListener, b2World } from "box2d.ts";
import { System, Inject } from "flat-ecs";

export class ContactListenerSystem extends System{
  @Inject("contactListener") contactListener: b2ContactListener;
  @Inject("physicWorld") physicWorld: b2World;

  initialized(){
    this.contactListener.BeginContact = function (contact: b2Contact){
     const fixtureAData = contact.GetFixtureA().GetBody().GetUserData(); 
     if (fixtureAData.startsWith("person")) {
      fixtureAData.durability += 1;
      console.log("dcm")
    }
  }
    this.physicWorld.SetContactListener(this.contactListener);
  }

  process(): void {
  }

}