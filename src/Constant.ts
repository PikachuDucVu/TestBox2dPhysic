export class Constants {
  public static readonly WORLD_WIDTH = 3000;
  public static readonly WORLD_HEIGHT = 1500;
  public static readonly METER_TO_PHYSIC_WORLD = 100;
  public static readonly PERSON_HEIGHT = 75;
  public static readonly PERSON_WIDTH = 35;

  public static readonly GROUND_CATEGORY_BIT = 1 << 0;
  public static readonly BALLTEAM1_CATEGORY_BIT = 1 << 3;
  public static readonly BALLTEAM2_CATEGORY_BIT = 1 << 4;

  public static readonly HEAD_CATEGORY_BIT = 1 << 10;
  public static readonly TORSO1_CATEGORY_BIT = 1 << 11;
  public static readonly TORSO2_CATEGORY_BIT = 1 << 12;
  public static readonly TORSO3_CATEGORY_BIT = 1 << 13;
  public static readonly LEFTARM_CATEGORY_BIT = 1 << 14;
  public static readonly RIGHTARM_CATEGORY_BIT = 1 << 15;
  public static readonly UPPERLEFTLEG_CATEGORY_BIT = 1 << 16;
  public static readonly UPPERRIGHTLEG_CATEGORY_BIT = 1 << 17;
  public static readonly LOWERLEFTLEG_CATEGORY_BIT = 1 << 18;
  public static readonly LOWERRIGHTLEG_CATEGORY_BIT = 1 << 19;

  public static readonly GROUND_MASK_BIT =
    Constants.BALLTEAM1_CATEGORY_BIT | Constants.BALLTEAM2_CATEGORY_BIT;
  public static readonly BALLTEAM1_MASK_BIT = Constants.GROUND_CATEGORY_BIT;
  public static readonly BALLTEAM2_MASK_BIT = Constants.GROUND_CATEGORY_BIT;

  public static readonly HEAD_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT |
    Constants.BALLTEAM1_CATEGORY_BIT |
    Constants.BALLTEAM2_CATEGORY_BIT |
    Constants.TORSO1_CATEGORY_BIT |
    Constants.TORSO2_CATEGORY_BIT |
    Constants.TORSO3_CATEGORY_BIT |
    Constants.LEFTARM_CATEGORY_BIT |
    Constants.RIGHTARM_CATEGORY_BIT |
    Constants.UPPERLEFTLEG_CATEGORY_BIT |
    Constants.UPPERRIGHTLEG_CATEGORY_BIT |
    Constants.LOWERLEFTLEG_CATEGORY_BIT |
    Constants.LOWERRIGHTLEG_CATEGORY_BIT;
  public static readonly TORSO1_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT |
    Constants.BALLTEAM1_CATEGORY_BIT |
    Constants.BALLTEAM2_CATEGORY_BIT |
    Constants.HEAD_CATEGORY_BIT |
    Constants.TORSO2_CATEGORY_BIT |
    Constants.TORSO3_CATEGORY_BIT |
    Constants.LEFTARM_CATEGORY_BIT |
    Constants.RIGHTARM_CATEGORY_BIT |
    Constants.UPPERLEFTLEG_CATEGORY_BIT |
    Constants.UPPERRIGHTLEG_CATEGORY_BIT |
    Constants.LOWERLEFTLEG_CATEGORY_BIT |
    Constants.LOWERRIGHTLEG_CATEGORY_BIT;
  public static readonly TORSO2_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT |
    Constants.BALLTEAM1_CATEGORY_BIT |
    Constants.BALLTEAM2_CATEGORY_BIT |
    Constants.HEAD_CATEGORY_BIT |
    Constants.TORSO1_CATEGORY_BIT |
    Constants.TORSO3_CATEGORY_BIT |
    Constants.LEFTARM_CATEGORY_BIT |
    Constants.RIGHTARM_CATEGORY_BIT |
    Constants.UPPERLEFTLEG_CATEGORY_BIT |
    Constants.UPPERRIGHTLEG_CATEGORY_BIT |
    Constants.LOWERLEFTLEG_CATEGORY_BIT |
    Constants.LOWERRIGHTLEG_CATEGORY_BIT;
  public static readonly TORSO3_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT |
    Constants.BALLTEAM1_CATEGORY_BIT |
    Constants.BALLTEAM2_CATEGORY_BIT |
    Constants.HEAD_CATEGORY_BIT |
    Constants.TORSO1_CATEGORY_BIT |
    Constants.TORSO2_CATEGORY_BIT |
    Constants.LEFTARM_CATEGORY_BIT |
    Constants.RIGHTARM_CATEGORY_BIT |
    Constants.UPPERLEFTLEG_CATEGORY_BIT |
    Constants.UPPERRIGHTLEG_CATEGORY_BIT |
    Constants.LOWERLEFTLEG_CATEGORY_BIT |
    Constants.LOWERRIGHTLEG_CATEGORY_BIT;
  public static readonly LEFTARM_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT |
    Constants.BALLTEAM1_CATEGORY_BIT |
    Constants.BALLTEAM2_CATEGORY_BIT |
    Constants.HEAD_CATEGORY_BIT |
    Constants.TORSO1_CATEGORY_BIT |
    Constants.TORSO2_CATEGORY_BIT |
    Constants.TORSO3_CATEGORY_BIT |
    Constants.RIGHTARM_CATEGORY_BIT |
    Constants.UPPERLEFTLEG_CATEGORY_BIT |
    Constants.UPPERRIGHTLEG_CATEGORY_BIT |
    Constants.LOWERLEFTLEG_CATEGORY_BIT |
    Constants.LOWERRIGHTLEG_CATEGORY_BIT;
  public static readonly RIGHTARM_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT |
    Constants.BALLTEAM1_CATEGORY_BIT |
    Constants.BALLTEAM2_CATEGORY_BIT |
    Constants.HEAD_CATEGORY_BIT |
    Constants.TORSO1_CATEGORY_BIT |
    Constants.TORSO2_CATEGORY_BIT |
    Constants.TORSO3_CATEGORY_BIT |
    Constants.LEFTARM_CATEGORY_BIT |
    Constants.UPPERLEFTLEG_CATEGORY_BIT |
    Constants.UPPERRIGHTLEG_CATEGORY_BIT |
    Constants.LOWERLEFTLEG_CATEGORY_BIT |
    Constants.LOWERRIGHTLEG_CATEGORY_BIT;
  public static readonly UPPERLEFTLEG_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT |
    Constants.BALLTEAM1_CATEGORY_BIT |
    Constants.BALLTEAM2_CATEGORY_BIT |
    Constants.HEAD_CATEGORY_BIT |
    Constants.TORSO1_CATEGORY_BIT |
    Constants.TORSO2_CATEGORY_BIT |
    Constants.TORSO3_CATEGORY_BIT |
    Constants.LEFTARM_CATEGORY_BIT |
    Constants.RIGHTARM_CATEGORY_BIT |
    Constants.UPPERRIGHTLEG_CATEGORY_BIT |
    Constants.LOWERLEFTLEG_CATEGORY_BIT |
    Constants.LOWERRIGHTLEG_CATEGORY_BIT;
  public static readonly UPPERRIGHTLEG_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT |
    Constants.BALLTEAM1_CATEGORY_BIT |
    Constants.BALLTEAM2_CATEGORY_BIT |
    Constants.HEAD_CATEGORY_BIT |
    Constants.TORSO1_CATEGORY_BIT |
    Constants.TORSO2_CATEGORY_BIT |
    Constants.TORSO3_CATEGORY_BIT |
    Constants.LEFTARM_CATEGORY_BIT |
    Constants.RIGHTARM_CATEGORY_BIT |
    Constants.UPPERLEFTLEG_CATEGORY_BIT |
    Constants.LOWERLEFTLEG_CATEGORY_BIT |
    Constants.LOWERRIGHTLEG_CATEGORY_BIT;
  public static readonly LOWERLEFTLEG_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT |
    Constants.BALLTEAM1_CATEGORY_BIT |
    Constants.BALLTEAM2_CATEGORY_BIT |
    Constants.HEAD_CATEGORY_BIT |
    Constants.TORSO1_CATEGORY_BIT |
    Constants.TORSO2_CATEGORY_BIT |
    Constants.TORSO3_CATEGORY_BIT |
    Constants.LEFTARM_CATEGORY_BIT |
    Constants.RIGHTARM_CATEGORY_BIT |
    Constants.UPPERLEFTLEG_CATEGORY_BIT |
    Constants.UPPERRIGHTLEG_CATEGORY_BIT |
    Constants.LOWERRIGHTLEG_CATEGORY_BIT;
  public static readonly LOWERRIGHTLEG_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT |
    Constants.BALLTEAM1_CATEGORY_BIT |
    Constants.BALLTEAM2_CATEGORY_BIT |
    Constants.HEAD_CATEGORY_BIT |
    Constants.TORSO1_CATEGORY_BIT |
    Constants.TORSO2_CATEGORY_BIT |
    Constants.TORSO3_CATEGORY_BIT |
    Constants.LEFTARM_CATEGORY_BIT |
    Constants.RIGHTARM_CATEGORY_BIT |
    Constants.UPPERLEFTLEG_CATEGORY_BIT |
    Constants.UPPERRIGHTLEG_CATEGORY_BIT |
    Constants.LOWERLEFTLEG_CATEGORY_BIT;
}
