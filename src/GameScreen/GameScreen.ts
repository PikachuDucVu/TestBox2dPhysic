import { b2Body, b2BodyType, b2ContactListener, b2World } from "box2d.ts";
import { World } from "flat-ecs";
import {
  AssetManager,
  PolygonBatch,
  Screen,
  ShapeRenderer,
  Vector2,
  Viewport,
  ViewportInputHandler,
} from "gdxts";
import { Constants } from "../Constant";
import { StateGame } from "../dataGame/stateGame";
import { PhysicDebugSystem } from "../RenderSystem/physicDebugSystem";
import { RenderSystem } from "../RenderSystem/RenderSystem";
import { ContactListenerSystem } from "../System/ContactListener";
import { InputHandlerSystem } from "../System/inputHandlerSystem";
import { NextLevelSystem } from "../System/NextLevelSystem";
import { TurnOfTeam } from "../System/TurnOfTeam";
import { createBall, createGround, createPerson } from "../System/utils";

const stateGame: StateGame = {
  currentLevel: 1,
  WhoisTurning: 1,
  CooldownTime: 999,
  changeTurn: false,
  conditionWin: false,
};

const MAP_HEIGHT = 1000; // map height
export const createGameScreen = async (
  assetManager: AssetManager,
  viewport: Viewport
): Promise<Screen> => {
  const gl = viewport.getContext();
  const camera = viewport.getCamera();
  const batch = new PolygonBatch(gl);
  const shapeRenderer = new ShapeRenderer(gl);
  gl.clearColor(0, 0, 0, 1);
  batch.setYDown(true);

  const world = new World();
  const physicWorld = new b2World({
    x: 0,
    y: -10,
  });

  const mapData = await fetch(`./level${stateGame.currentLevel}.tmj`).then(
    (res) => res.json()
  );
  const groundData = mapData.layers.find(
    (w: any) => w.name === "Ground"
  ).objects;
  const personTeam1Data = mapData.layers.find(
    (p: any) => p.name === "Team1"
  ).objects;
  const personTeam2Data = mapData.layers.find(
    (p: any) => p.name === "Team2"
  ).objects;

  const ball1 = mapData.layers.find((b: any) => b.name === "ball1").objects;

  let grounds: b2Body[] = [];
  let Team1: b2Body[] = [];
  let Team2: b2Body[] = [];
  let ballsTeam1: b2Body[] = [];
  let ballsTeam2: b2Body[] = [];

  for (let ground of groundData) {
    grounds.push(
      createGround(
        physicWorld,
        ground.x / Constants.METER_TO_PHYSIC_WORLD,
        (MAP_HEIGHT - ground.y) / Constants.METER_TO_PHYSIC_WORLD,
        ground.width / Constants.METER_TO_PHYSIC_WORLD,
        ground.height / Constants.METER_TO_PHYSIC_WORLD
      )
    );
  }
  for (let person1 of personTeam1Data) {
    Team1.push(
      createPerson(
        physicWorld,
        person1.x / Constants.METER_TO_PHYSIC_WORLD,
        (MAP_HEIGHT - person1.y) / Constants.METER_TO_PHYSIC_WORLD,
        person1.width / Constants.METER_TO_PHYSIC_WORLD,
        person1.height / Constants.METER_TO_PHYSIC_WORLD,
        { name: "Person1" },
        Constants.PERSONTEAM1_CATEGORY_BIT,
        Constants.PERSONTEAM1_MASK_BIT
      )
    );
  }

  for (let i = Team1.length - 1; i >= 0; i--) {
    Team1[i].SetActive(false);
  }

  for (let i = 0; i < Team1.length; i++) {
    ballsTeam1.push(
      createBall(
        physicWorld,
        Team1[i].GetPosition().x + 0.2,
        Team1[i].GetPosition().y + 0.2,
        0.15,
        Constants.BALLTEAM1_CATEGORY_BIT,
        Constants.BALLTEAM1_MASK_BIT
      )
    );
  }

  for (let person2 of personTeam2Data) {
    Team2.push(
      createPerson(
        physicWorld,
        person2.x / Constants.METER_TO_PHYSIC_WORLD,
        (MAP_HEIGHT - person2.y) / Constants.METER_TO_PHYSIC_WORLD,
        person2.width / Constants.METER_TO_PHYSIC_WORLD,
        person2.height / Constants.METER_TO_PHYSIC_WORLD,
        { name: "Person2" },
        Constants.PERSONTEAM2_CATEGORY_BIT,
        Constants.PERSONTEAM2_MASK_BIT
      )
    );
  }
  const inputHandle = new ViewportInputHandler(viewport);
  const contactListener = new b2ContactListener();

  const originPosition = new Vector2(
    ballsTeam1[1].GetPosition().x * Constants.METER_TO_PHYSIC_WORLD,
    ballsTeam1[1].GetPosition().y * Constants.METER_TO_PHYSIC_WORLD
  );
  let dragPositioning = new Vector2(
    ballsTeam1[1].GetPosition().x * Constants.METER_TO_PHYSIC_WORLD,
    ballsTeam1[1].GetPosition().y * Constants.METER_TO_PHYSIC_WORLD
  );
  world.register("gl", gl);
  world.register("viewport", viewport);
  world.register("batch", batch);
  world.register("camera", camera);
  world.register("assetManager", assetManager);
  world.register("physicWorld", physicWorld);
  world.register("inputHandle", inputHandle);
  world.register("groundData", groundData);
  world.register("shapeRenderer", shapeRenderer);
  world.register("mapData", mapData);
  world.register("Team1", Team1);
  world.register("Team2", Team2);
  world.register("ballsTeam1", ballsTeam1);
  world.register("ballsTeam2", ballsTeam2);
  world.register("originPosition", originPosition);
  world.register("dragPositioning", dragPositioning);
  world.register("StateGame", stateGame);
  world.register("contactListener", contactListener);

  world.addSystem(new PhysicDebugSystem(), true);
  world.addSystem(new TurnOfTeam(), true);
  world.addSystem(new ContactListenerSystem(), true);
  world.addSystem(new RenderSystem(), false);
  world.addSystem(new InputHandlerSystem(), true);
  world.addSystem(new NextLevelSystem(), true);

  return {
    update(delta: number) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      batch.setProjection(camera.combined);
      shapeRenderer.setProjection(camera.combined);
      world.setDelta(delta);
      world.processActiveSystem();
      world.processPassiveSystem();
      physicWorld.Step(delta, 8, 3);
      stateGame.CooldownTime -= delta;
    },
    dispose(): void {},
  };
};
