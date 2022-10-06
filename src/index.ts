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
<<<<<<< HEAD
=======
  console.log("dcm");
>>>>>>> 092415aba4194bcac0210e236acd190ebd6fb226
  const assetManager = new AssetManager(gl);
  Game.shared.setScreen(await createGameScreen(assetManager, viewport));
  createGameLoop((delta: number) => {
    Game.shared.update(delta);
  });
};
init();
