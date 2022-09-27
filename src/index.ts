import {
  AssetManager,
  createGameLoop,
  createStage,
  createViewport,
  Game,
} from "gdxts";
import { Constants } from "./Constants";

import { createGameScreen } from "./screen/GameScreen";

export const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(
    canvas,
    Constants.WORLD_WIDTH,
    Constants.WORLD_HEIGHT
  );
  const gl = viewport.getContext();

  const assetManager = new AssetManager(gl);
  await assetManager.loadTexture("./background.png", "bg");
  await assetManager.loadTexture("./bird.png", "birdAsset");
  await assetManager.loadTexture("./pigAsset.png", "pigAsset");
  await assetManager.loadTexture("./testAnimation1.png", "boxAsset");
  await assetManager.loadTexture("./slingshot.png", "slingShot");
  await assetManager.loadTexture("./testAnimation1.png", "boxTexture");
  await assetManager.loadTexture("./yellowBird.png", "yellowBird");

  Game.shared.setScreen(await createGameScreen(assetManager, viewport));

  createGameLoop((delta: number) => {
    Game.shared.update(delta);
  });
};
init();
