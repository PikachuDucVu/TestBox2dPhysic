export interface StateGame {
  currentLevel: number;
  WhoisTurning: number;
  CooldownTime: number;
  changeTurn: boolean;
  conditionWin: boolean;
  setupTeam1: boolean;
  setupTeam2: boolean;
}
