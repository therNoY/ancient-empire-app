const getters = {
  // 游戏用户有关
  user: state => state.user.user,
  token: state => state.user.token,
  setting: state => state.user.setting,
  systemInfo: state => state.user.systemInfo,
  // 游戏核心数据
  game: state => state.gameCore.game,
  template: state => state.gameCore.template,
  mapState: state => state.gameCore.mapState,
  levelInfo: state => state.gameCore.levelInfo,
  buyUnitDialog: state => state.gameCore.buyUnitDialog,
  cUnit: state => state.gameCore.game.curr_unit,
  cRegion: state => state.gameCore.game.curr_region,

  // 移动有关
  moveAreas: state => state.move.moveAreas,
  moveLine: state => state.move.moveLine,
  moveLength: state => state.move.moveLength,
  // 行为有关
  actionState: state => state.action,
  action: state => state.action.action,
  leftChanges: state => state.action.leftChanges,
  animates: state => state.action.animates,
  // 攻击有关
  attachArea: state => state.attach.attachArea,
  attachPoint: state => state.attach.attachPoint,

  unitInfo: state => state.info.unitInfo,
  currentUnitInfo: state => state.info.currentUnitInfo,
  regionInfo: state => state.info.regionInfo,
  currentRegion: state => state.info.currentRegionInfo,

  // 框架层
  timer300: state => state.counter.signal[300],
  timer500: state => state.counter.signal[500],
  signal: state => state.counter.signal,
};
export default getters
