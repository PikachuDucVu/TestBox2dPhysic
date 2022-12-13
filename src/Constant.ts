import { constants } from "buffer";

export class Constants {
  public static readonly WORLD_WIDTH = 750;
  public static readonly WORLD_HEIGHT = 1500;
  public static readonly METER_TO_PHYSIC_WORLD = 100;
  public static readonly PERSON_HEIGHT = 75;
  public static readonly PERSON_WIDTH = 35;

  public static readonly GROUND_CATEGORY_BIT = 1 << 0;
  public static readonly BALLTEAM1_CATEGORY_BIT = 1 << 1;
  public static readonly BALLTEAM2_CATEGORY_BIT = 1 << 2;

  public static readonly BODY_CATEGORY_BIT = 1 << 3;

  public static readonly HEAD_BODY_CATEGORY_BIT = 1 << 10;
  public static readonly TORSO1_BODY_CATEGORY_BIT = 1 << 11;
  public static readonly TORSO2_BODY_CATEGORY_BIT = 1 << 12;
  public static readonly TORSO3_BODY_CATEGORY_BIT = 1 << 13;
  public static readonly LEFTARM_BODY_CATEGORY_BIT = 1 << 14;
  public static readonly RIGHTARM_BODY_CATEGORY_BIT = 1 << 15;
  public static readonly UPPERLEFTLEG_BODY_CATEGORY_BIT = 1 << 16;
  public static readonly UPPERRIGHTLEG_BODY_CATEGORY_BIT = 1 << 17;
  public static readonly LOWERLEFTLEG_BODY_CATEGORY_BIT = 1 << 18;
  public static readonly LOWERRIGHTLEG_BODY_CATEGORY_BIT = 1 << 19;

  public static readonly GROUND_MASK_BIT =
    Constants.BALLTEAM1_CATEGORY_BIT | Constants.BALLTEAM2_CATEGORY_BIT;

  public static readonly BALLTEAM1_MASK_BIT = Constants.GROUND_CATEGORY_BIT;
  public static readonly BALLTEAM2_MASK_BIT = Constants.GROUND_CATEGORY_BIT;

  public static readonly BODY_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT |
    Constants.BALLTEAM1_CATEGORY_BIT |
    Constants.BALLTEAM2_CATEGORY_BIT;

  //   public static readonly BALLTEAM1_MASK_BIT =
  //     Constants.GROUND_CATEGORY_BIT |
  //     Constants.HEAD_BODY_CATEGORY_BIT |
  //     Constants.TORSO1_BODY_CATEGORY_BIT |
  //     Constants.TORSO2_BODY_CATEGORY_BIT |
  //     Constants.TORSO3_BODY_CATEGORY_BIT |
  //     Constants.LEFTARM_BODY_CATEGORY_BIT |
  //     Constants.RIGHTARM_BODY_CATEGORY_BIT |
  //     Constants.UPPERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.UPPERRIGHTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERRIGHTLEG_BODY_CATEGORY_BIT;
  //   public static readonly BALLTEAM2_MASK_BIT =
  //     Constants.GROUND_CATEGORY_BIT |
  //     Constants.HEAD_BODY_CATEGORY_BIT |
  //     Constants.TORSO1_BODY_CATEGORY_BIT |
  //     Constants.TORSO2_BODY_CATEGORY_BIT |
  //     Constants.TORSO3_BODY_CATEGORY_BIT |
  //     Constants.LEFTARM_BODY_CATEGORY_BIT |
  //     Constants.RIGHTARM_BODY_CATEGORY_BIT |
  //     Constants.UPPERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.UPPERRIGHTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERRIGHTLEG_BODY_CATEGORY_BIT;

  //   public static readonly HEAD_BODY_MASK_BIT =
  //     Constants.GROUND_CATEGORY_BIT |
  //     Constants.BALLTEAM1_CATEGORY_BIT |
  //     Constants.BALLTEAM2_CATEGORY_BIT |
  //     Constants.TORSO1_BODY_CATEGORY_BIT |
  //     Constants.TORSO2_BODY_CATEGORY_BIT |
  //     Constants.TORSO3_BODY_CATEGORY_BIT |
  //     Constants.LEFTARM_BODY_CATEGORY_BIT |
  //     Constants.RIGHTARM_BODY_CATEGORY_BIT |
  //     Constants.UPPERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.UPPERRIGHTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERRIGHTLEG_BODY_CATEGORY_BIT;

  //   public static readonly TORSO1_BODY_MASK_BIT =
  //     Constants.GROUND_CATEGORY_BIT |
  //     Constants.BALLTEAM1_CATEGORY_BIT |
  //     Constants.BALLTEAM2_CATEGORY_BIT |
  //     Constants.HEAD_BODY_CATEGORY_BIT |
  //     Constants.TORSO2_BODY_CATEGORY_BIT |
  //     Constants.TORSO3_BODY_CATEGORY_BIT |
  //     Constants.LEFTARM_BODY_CATEGORY_BIT |
  //     Constants.RIGHTARM_BODY_CATEGORY_BIT |
  //     Constants.UPPERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.UPPERRIGHTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERRIGHTLEG_BODY_CATEGORY_BIT;

  //   public static readonly TORSO2_BODY_MASK_BIT =
  //     Constants.GROUND_CATEGORY_BIT |
  //     Constants.BALLTEAM1_CATEGORY_BIT |
  //     Constants.BALLTEAM2_CATEGORY_BIT |
  //     Constants.HEAD_BODY_CATEGORY_BIT |
  //     Constants.TORSO1_BODY_CATEGORY_BIT |
  //     Constants.TORSO3_BODY_CATEGORY_BIT |
  //     Constants.LEFTARM_BODY_CATEGORY_BIT |
  //     Constants.RIGHTARM_BODY_CATEGORY_BIT |
  //     Constants.UPPERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.UPPERRIGHTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERRIGHTLEG_BODY_CATEGORY_BIT;

  //   public static readonly TORSO3_BODY_MASK_BIT =
  //     Constants.GROUND_CATEGORY_BIT |
  //     Constants.BALLTEAM1_CATEGORY_BIT |
  //     Constants.BALLTEAM2_CATEGORY_BIT |
  //     Constants.HEAD_BODY_CATEGORY_BIT |
  //     Constants.TORSO1_BODY_CATEGORY_BIT |
  //     Constants.TORSO2_BODY_CATEGORY_BIT |
  //     Constants.LEFTARM_BODY_CATEGORY_BIT |
  //     Constants.RIGHTARM_BODY_CATEGORY_BIT |
  //     Constants.UPPERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.UPPERRIGHTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERRIGHTLEG_BODY_CATEGORY_BIT;

  //   public static readonly LEFTARM_BODY_MASK_BIT =
  //     Constants.GROUND_CATEGORY_BIT |
  //     Constants.BALLTEAM1_CATEGORY_BIT |
  //     Constants.BALLTEAM2_CATEGORY_BIT |
  //     Constants.HEAD_BODY_CATEGORY_BIT |
  //     Constants.TORSO1_BODY_CATEGORY_BIT |
  //     Constants.TORSO2_BODY_CATEGORY_BIT |
  //     Constants.TORSO3_BODY_CATEGORY_BIT |
  //     Constants.RIGHTARM_BODY_CATEGORY_BIT |
  //     Constants.UPPERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.UPPERRIGHTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERRIGHTLEG_BODY_CATEGORY_BIT;

  //   public static readonly RIGHTARM_BODY_MASK_BIT =
  //     Constants.GROUND_CATEGORY_BIT |
  //     Constants.BALLTEAM1_CATEGORY_BIT |
  //     Constants.BALLTEAM2_CATEGORY_BIT |
  //     Constants.HEAD_BODY_CATEGORY_BIT |
  //     Constants.TORSO1_BODY_CATEGORY_BIT |
  //     Constants.TORSO2_BODY_CATEGORY_BIT |
  //     Constants.TORSO3_BODY_CATEGORY_BIT |
  //     Constants.LEFTARM_BODY_CATEGORY_BIT |
  //     Constants.UPPERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.UPPERRIGHTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERRIGHTLEG_BODY_CATEGORY_BIT;

  //   public static readonly UPPERLEFTLEG_BODY_MASK_BIT =
  //     Constants.GROUND_CATEGORY_BIT |
  //     Constants.BALLTEAM1_CATEGORY_BIT |
  //     Constants.BALLTEAM2_CATEGORY_BIT |
  //     Constants.HEAD_BODY_CATEGORY_BIT |
  //     Constants.TORSO1_BODY_CATEGORY_BIT |
  //     Constants.TORSO2_BODY_CATEGORY_BIT |
  //     Constants.TORSO3_BODY_CATEGORY_BIT |
  //     Constants.LEFTARM_BODY_CATEGORY_BIT |
  //     Constants.RIGHTARM_BODY_CATEGORY_BIT |
  //     Constants.UPPERRIGHTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERRIGHTLEG_BODY_CATEGORY_BIT;

  //   public static readonly UPPERRIGHTLEG_BODY_MASK_BIT =
  //     Constants.GROUND_CATEGORY_BIT |
  //     Constants.BALLTEAM1_CATEGORY_BIT |
  //     Constants.BALLTEAM2_CATEGORY_BIT |
  //     Constants.HEAD_BODY_CATEGORY_BIT |
  //     Constants.TORSO1_BODY_CATEGORY_BIT |
  //     Constants.TORSO2_BODY_CATEGORY_BIT |
  //     Constants.TORSO3_BODY_CATEGORY_BIT |
  //     Constants.LEFTARM_BODY_CATEGORY_BIT |
  //     Constants.RIGHTARM_BODY_CATEGORY_BIT |
  //     Constants.UPPERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERRIGHTLEG_BODY_CATEGORY_BIT;

  //   public static readonly LOWERLEFTLEG_BODY_MASK_BIT =
  //     Constants.GROUND_CATEGORY_BIT |
  //     Constants.BALLTEAM1_CATEGORY_BIT |
  //     Constants.BALLTEAM2_CATEGORY_BIT |
  //     Constants.HEAD_BODY_CATEGORY_BIT |
  //     Constants.TORSO1_BODY_CATEGORY_BIT |
  //     Constants.TORSO2_BODY_CATEGORY_BIT |
  //     Constants.TORSO3_BODY_CATEGORY_BIT |
  //     Constants.LEFTARM_BODY_CATEGORY_BIT |
  //     Constants.RIGHTARM_BODY_CATEGORY_BIT |
  //     Constants.UPPERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.UPPERRIGHTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERRIGHTLEG_BODY_CATEGORY_BIT;

  //   public static readonly LOWERRIGHTLEG_BODY_MASK_BIT =
  //     Constants.GROUND_CATEGORY_BIT |
  //     Constants.BALLTEAM1_CATEGORY_BIT |
  //     Constants.BALLTEAM2_CATEGORY_BIT |
  //     Constants.HEAD_BODY_CATEGORY_BIT |
  //     Constants.TORSO1_BODY_CATEGORY_BIT |
  //     Constants.TORSO2_BODY_CATEGORY_BIT |
  //     Constants.TORSO3_BODY_CATEGORY_BIT |
  //     Constants.LEFTARM_BODY_CATEGORY_BIT |
  //     Constants.RIGHTARM_BODY_CATEGORY_BIT |
  //     Constants.UPPERLEFTLEG_BODY_CATEGORY_BIT |
  //     Constants.UPPERRIGHTLEG_BODY_CATEGORY_BIT |
  //     Constants.LOWERLEFTLEG_BODY_CATEGORY_BIT;
}
