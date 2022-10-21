export class Constants {
  public static readonly WORLD_WIDTH = 3000;
  public static readonly WORLD_HEIGHT = 1500;
  public static readonly METER_TO_PHYSIC_WORLD = 100;
  public static readonly PERSON_HEIGHT = 150;
  public static readonly PERSON_WIDTH = 75;
  public static readonly ARRAY_HEIGHT = 75;
  public static readonly ARRAY_WIDTH = 25;

  public static readonly GROUND_CATEGORY_BIT = 1 << 0;
  public static readonly PERSONTEAM1_CATEGORY_BIT = 1 << 1;
  public static readonly PERSONTEAM2_CATEGORY_BIT = 1 << 2;
  public static readonly BALLTEAM1_CATEGORY_BIT = 1 << 3;
  public static readonly BALLTEAM2_CATEGORY_BIT = 1 << 4;

  public static readonly GROUND_MASK_BIT =
    Constants.BALLTEAM1_CATEGORY_BIT |
    Constants.BALLTEAM2_CATEGORY_BIT |
    Constants.PERSONTEAM1_CATEGORY_BIT |
    Constants.PERSONTEAM2_CATEGORY_BIT;
  public static readonly PERSONTEAM1_MASK_BIT =
    Constants.BALLTEAM2_CATEGORY_BIT | Constants.GROUND_CATEGORY_BIT;
  public static readonly BALLTEAM1_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT | Constants.PERSONTEAM2_CATEGORY_BIT;
  public static readonly PERSONTEAM2_MASK_BIT =
    Constants.BALLTEAM1_CATEGORY_BIT | Constants.GROUND_CATEGORY_BIT;
  public static readonly BALLTEAM2_MASK_BIT =
    Constants.GROUND_CATEGORY_BIT | Constants.PERSONTEAM1_CATEGORY_BIT;
}
