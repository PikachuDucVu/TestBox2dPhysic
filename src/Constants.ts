export class Constants {
  public static readonly WORLD_WIDTH = 1300;
  public static readonly WORLD_HEIGHT = 500;
  public static readonly BALL_RADIUS = 0.2;
  public static readonly METER_TO_WORLD = 100;
  public static readonly BOX_SIZE = 0.5;
  public static readonly PIG_SIZE = 0.3;
  public static readonly frameDuration = 0.01;

  public static readonly GROUND_CATEGORY_BIT = 1 << 0;
  public static readonly BIRD_CATEGORY_BIT = 1 << 1;
  public static readonly BOX_CATEGORY_BIT = 1 << 2;
  public static readonly PIG_CATEGORY_BIT = 1 << 3;

  public static readonly BIRD_MASK_BIT =
    Constants.BOX_CATEGORY_BIT |
    Constants.GROUND_CATEGORY_BIT |
    Constants.PIG_CATEGORY_BIT;
  public static readonly GROUND_MASK_BIT =
    Constants.BIRD_CATEGORY_BIT |
    Constants.BOX_CATEGORY_BIT |
    Constants.PIG_CATEGORY_BIT;
  public static readonly BOX_MASK_BIT =
    Constants.BIRD_CATEGORY_BIT |
    Constants.GROUND_CATEGORY_BIT |
    Constants.PIG_CATEGORY_BIT;
  public static readonly PIG_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT |
    Constants.BOX_CATEGORY_BIT |
    Constants.BIRD_CATEGORY_BIT;
}
