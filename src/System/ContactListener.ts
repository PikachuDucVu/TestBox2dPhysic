import { b2Body, b2Contact, b2ContactListener, b2World } from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { StateGame } from "../dataGame/stateGame";

export class ContactListenerSystem extends System {
  @Inject("contactListener") contactListener: b2ContactListener;
  @Inject("physicWorld") physicWorld: b2World;
  @Inject("Team1") Team1: b2Body[];
  @Inject("Team2") Team2: b2Body[];
  @Inject("StateGame") StateGame: StateGame;

  initialized() {
    this.contactListener.BeginContact = function (contact: b2Contact) {
      const fixtureAData = contact.GetFixtureA().GetBody().GetUserData();
      if (fixtureAData.name && fixtureAData.name.startsWith("Person")) {
        fixtureAData.durability += 1;
      }
    };
    this.physicWorld.SetContactListener(this.contactListener);
  }

  process(): void {
    for (let i = 0; i < this.Team1.length; i++) {
      if (typeof this.Team1[i].GetUserData().durability === "number") {
        if (this.Team1[i].GetUserData().durability <= 3) {
        } else {
          this.physicWorld.DestroyBody(this.Team1[i]);
          this.Team1.splice(i, 1);
        }
      }
    }
    for (let i = 0; i < this.Team2.length; i++) {
      if (typeof this.Team2[i].GetUserData().durability === "number") {
        if (this.Team2[i].GetUserData().durability <= 3) {
        } else {
          this.physicWorld.DestroyBody(this.Team2[i]);
          this.Team2.splice(i, 1);
        }
      }
    }
    for (let i = 0; i < this.Team1.length; i++) {
      if (this.Team1[i].GetPosition().y <= 3) {
        this.physicWorld.DestroyBody(this.Team1[i]);
        this.Team1.splice(i, 1);
      }
    }
    for (let i = 0; i < this.Team2.length; i++) {
      if (this.Team2[i].GetPosition().y <= 3) {
        this.physicWorld.DestroyBody(this.Team2[i]);
        this.Team2.splice(i, 1);
      }
    }
  }
}
