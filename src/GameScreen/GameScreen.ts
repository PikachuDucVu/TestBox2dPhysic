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
import {
  createArray,
  createBall,
  createGround,
  createPerson,
} from "../System/utils";

const stateGame: StateGame = {
  currentLevel: 1,
  WhoisTurning: 2,
  CooldownTime: 0,
  changeTurn: false,
  conditionWin: false,
  setupTeam1: false,
  setupTeam2: false,
  botDelayTime: 0,
  delayTime: 0,
};

const MAP_HEIGHT = 1000; // map height
export const createGameScreen = async (
  assetManager: AssetManager,
  viewport: Viewport
): Promise<Screen> => {
  if (stateGame.currentLevel > 3) {
    stateGame.currentLevel %= 3;
  }
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
  // const personTeam1Data = mapData.layers.find(
  //   (p: any) => p.name === "Team1"
  // ).objects;
  // const personTeam2Data = mapData.layers.find(
  //   (p: any) => p.name === "Team2"
  // ).objects;

  // const ball1 = mapData.layex    rs.find((b: any) => b.name === "ball1").objects;

  let grounds: b2Body[] = [];
  let Team1: b2Body[] = [];
  let Team2: b2Body[] = [];
  let ballsTeam1: b2Body[] = [];
  let ballsTeam2: b2Body[] = [];
  stateGame.WhoisTurning = 2;

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
  let inputHandle = new ViewportInputHandler(viewport);
  const contactListener = new b2ContactListener();

  let touchTemp = new Vector2(0, 0);
  let originPosition = new Vector2(0, 0);
  let dragPositioning = new Vector2(0, 0);

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
  world.register("StateGame", stateGame);
  world.register("contactListener", contactListener);

  world.addSystem(new PhysicDebugSystem(), true);
  world.addSystem(new ContactListenerSystem(), true);
  world.addSystem(new RenderSystem(), false);

  let tempX1 = 1;
  let tempY1 = 3.5;
  let tempX2 = 27.25;
  let tempY2 = 10;

  // Team1.push(
  //   createPerson(
  //     physicWorld,
  //     tempX1,
  //     tempY1,
  //     Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
  //     Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
  //     { name: "Person" },
  //     Constants.PERSONTEAM1_CATEGORY_BIT,
  //     Constants.PERSONTEAM1_MASK_BIT
  //   )
  // );
  switch (stateGame.currentLevel) {
    case 1:
      for (let i = 0; i < 4; i++) {
        tempX1++;
        tempY1 = 3.5;
        for (let j = 0; j < 2; j++) {
          Team1.push(
            createPerson(
              physicWorld,
              tempX1,
              tempY1++,
              Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
              Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
              { name: "Person" },
              Constants.PERSONTEAM1_CATEGORY_BIT,
              Constants.PERSONTEAM1_MASK_BIT
            )
          );
        }
        tempX2--;
        tempY2 = 5;
        for (let j = 0; j < 2; j++) {
          Team2.push(
            createPerson(
              physicWorld,
              tempX2,
              tempY2--,
              Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
              Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
              { name: "Person" },
              Constants.PERSONTEAM1_CATEGORY_BIT,
              Constants.PERSONTEAM1_MASK_BIT
            )
          );
        }
      }
      break;
    case 2:
      tempX1 = 2.25;
      tempY1 = 3.5;
      tempX2 = 26.5;

      for (let i = 0; i < 4; i++) {
        tempX1++;
        tempY1 = 3.5;
        for (let j = 0; j < 2; j++) {
          Team1.push(
            createPerson(
              physicWorld,
              tempX1,
              tempY1++,
              Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
              Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
              { name: "Person" },
              Constants.PERSONTEAM1_CATEGORY_BIT,
              Constants.PERSONTEAM1_MASK_BIT
            )
          );
        }
        tempX2--;
        tempY2 = 5;
        for (let j = 0; j < 2; j++) {
          Team2.push(
            createPerson(
              physicWorld,
              tempX2,
              tempY2--,
              Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
              Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
              { name: "Person" },
              Constants.PERSONTEAM1_CATEGORY_BIT,
              Constants.PERSONTEAM1_MASK_BIT
            )
          );
        }
      }
      break;
    case 3:
      tempX1 = 2.25;
      tempY1 = 3.5;
      tempX2 = 26.5;

      for (let i = 0; i < 4; i++) {
        tempX1++;
        tempY1 = 3.5;
        for (let j = 0; j < 2; j++) {
          Team1.push(
            createPerson(
              physicWorld,
              tempX1,
              tempY1++,
              Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
              Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
              { name: "Person" },
              Constants.PERSONTEAM1_CATEGORY_BIT,
              Constants.PERSONTEAM1_MASK_BIT
            )
          );
        }
        tempX2--;
        tempY2 = 5;
        for (let j = 0; j < 2; j++) {
          Team2.push(
            createPerson(
              physicWorld,
              tempX2,
              tempY2--,
              Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
              Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
              { name: "Person" },
              Constants.PERSONTEAM1_CATEGORY_BIT,
              Constants.PERSONTEAM1_MASK_BIT
            )
          );
        }
      }
      break;
    default:
      break;
  }

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
      if (stateGame.WhoisTurning === 2) {
        stateGame.botDelayTime += delta;
        stateGame.delayTime += delta;
      } else {
        stateGame.botDelayTime = 0;
      }

      if (Team1.length === 8 && !stateGame.setupTeam1) {
        stateGame.setupTeam1 = true;
      }
      if (Team2.length === 8 && !stateGame.setupTeam2) {
        stateGame.setupTeam2 = true;
        for (let i = Team2.length - 1; i >= 0; i--) {
          setTimeout(() => {
            Team2[i].SetActive(false);
          }, 1000);
        }
        setTimeout(() => {
          for (let i = 0; i < Team2.length; i++) {
            ballsTeam2.push(
              createBall(
                physicWorld,
                Team2[i].GetPosition().x + 0.2,
                Team2[i].GetPosition().y + 0.2,
                0.15,
                Constants.BALLTEAM2_CATEGORY_BIT,
                Constants.BALLTEAM2_MASK_BIT
              )
            );
          }
          originPosition = new Vector2(
            ballsTeam2[0].GetPosition().x * Constants.METER_TO_PHYSIC_WORLD,
            ballsTeam2[0].GetPosition().y * Constants.METER_TO_PHYSIC_WORLD
          );

          dragPositioning = new Vector2(
            ballsTeam2[0].GetPosition().x * Constants.METER_TO_PHYSIC_WORLD,
            ballsTeam2[0].GetPosition().y * Constants.METER_TO_PHYSIC_WORLD
          );
          world.register("originPosition", originPosition);

          world.register("dragPositioning", dragPositioning);
          world.addSystem(new InputHandlerSystem(), true);
          world.addSystem(new TurnOfTeam(), true);
          world.addSystem(new NextLevelSystem(), true);
        }, 1500);
      }
    },
    dispose(): void {},
  };
};
