import {
  AssetManager,
  createGameLoop,
  createStage,
  createViewport,
  Game,
} from "gdxts";
import { Constants } from "./Constant";
import { createGameScreen } from "./GameScreen/GameScreen";

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
  await assetManager.loadTexture("./bloodBar.png", "bloodBar");
  await assetManager.loadTexture("./vsAsset.png", "vsAsset");
  await assetManager.loadTexture("./winningAsset.png", "winningAsset");

  Game.shared.setScreen(await createGameScreen(assetManager, viewport));
  createGameLoop((delta: number) => {
    Game.shared.update(delta);
  });
};
init();
