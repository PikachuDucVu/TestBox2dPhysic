import {
  b2Body,
  b2BodyType,
  b2Contact,
  b2ContactListener,
  b2JointDef,
  b2JointType,
  b2World,
} from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { StateGame } from "../dataGame/stateGame";
import { HumanPartType, HumanRig } from "./CreateHuman";

export class ContactListenerSystem extends System {
  @Inject("contactListener") contactListener: b2ContactListener;
  @Inject("physicWorld") physicWorld: b2World;
  @Inject("Team1") Team1: HumanRig[];
  @Inject("Team2") Team2: HumanRig[];
  @Inject("ballsTeam1") ballsTeam1: b2Body[];
  @Inject("StateGame") StateGame: StateGame;

  initialized() {
    this.contactListener.BeginContact = function (contact: b2Contact) {
      const fixtureAData = contact.GetFixtureA().GetBody().GetUserData();
      const fixtureBData = contact.GetFixtureB().GetBody().GetUserData();
      if (fixtureAData === fixtureBData) {
      } else {
        console.log(fixtureAData, fixtureBData);
        if (fixtureBData === "ball" && fixtureAData.name !== "Person") {
          contact.GetFixtureB().GetBody().m_activeFlag = false;
        }
      }
      // if (fixtureBData.name) {

      // }
    };

    setTimeout(() => {
      this.physicWorld.SetContactListener(this.contactListener);
    }, 500);
  }

  process(): void {
    for (let i = 0; i < this.Team1.length; i++) {
      if (
        this.Team1[i].parts[HumanPartType.Head].GetPosition().y <= 2.42 &&
        this.Team1[i].parts[HumanPartType.Head].GetPosition().y <= 2.42
      ) {
        for (let j = this.Team1[i].parts.length - 1; j >= 0; j--) {
          this.physicWorld.DestroyBody(this.Team1[i].parts[j]);
          this.Team1[i].parts.splice(j, 1);
        }
        this.Team1.splice(i, 1);
      }
    }
    for (let i = 0; i < this.Team2.length; i++) {
      if (
        this.Team2[i].parts[HumanPartType.Head].GetPosition().y <= 2.42 &&
        this.Team2[i].parts[HumanPartType.Head].GetPosition().y <= 2.42
      ) {
        for (let j = this.Team2[i].parts.length - 1; j >= 0; j--) {
          this.physicWorld.DestroyBody(this.Team2[i].parts[j]);
          this.Team2[i].parts.splice(j, 1);
        }
        this.Team2.splice(i, 1);
      }
    }
  }
}
