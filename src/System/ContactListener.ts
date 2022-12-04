import {
  b2Body,
  b2BodyType,
  b2Contact,
  b2ContactListener,
  b2Distance,
  b2DistanceJointDef,
  b2JointDef,
  b2JointType,
  b2RevoluteJointDef,
  b2Vec2,
  b2World,
} from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { join } from "path";
import { StateGame } from "../dataGame/stateGame";
import { physicWorld } from "../GameScreen/GameScreen";
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
      const fixtureA = contact.GetFixtureA().GetBody();
      const fixtureB = contact.GetFixtureB().GetBody();

      if (fixtureB.GetUserData() === "ball") {
        fixtureB.m_activeFlag = false;
      }
      if (
        fixtureB.GetUserData() === "ball" &&
        fixtureA.GetUserData() === "body"
      ) {
      }
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
