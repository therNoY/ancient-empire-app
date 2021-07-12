import { request } from './request'

const GET = "GET";
const POST = "POST";
const DELETE = "DELETE";
const PUT = "PUT";

export const GetTest = (url) => request(url, "", GET);
export const PostTest = (url, args) => request(url, args, POST);

// 用户操作
export const Login = (args, showLoading, handleErr) => request('/user/login', args, POST, showLoading, handleErr);
export const Register = (args, showLoading, handleErr) => request('/user/register', args, POST, showLoading, handleErr);
export const AdminLogin = (args, showLoading, handleErr) => request('/admin/login', args, POST, showLoading, handleErr);
export const GetWeiXinPhone = (args, showLoading, handleErr) => request('/user/getWeiXinPhone', args, POST, showLoading, handleErr);

/**
 * 获取用户名称
 * @param {*} args
 * @returns
 */
export const GetUserNameById = (args, showLoading, handleErr) =>  request('/api/user/name', args, GET, showLoading, handleErr);

/**
 * 保存单位信息
 * @param {} args
 */
export const SaveUnitInfo = (args, showLoading, handleErr) => request('/api/unitMes', args, PUT, showLoading, handleErr);

/**
 * 根据单位id获取等级信息
 * @param {} args
 */
export const GetUnitLevelInfoById = (id, showLoading, handleErr) => request('/api/unitLevel/' + id, '', GET, showLoading, handleErr);
/**
 * 获取模板的所有单位信息 用于缓存
 * @param {*} args
 */
export const GetUnitLevelByTemp = (args, showLoading, handleErr) => request('/api/unitLevel/list/' + args, '', GET, showLoading, handleErr);
/**
 * 获取用户创建的单位分页数据
 * @param {} args
 */
export const GetUserCreateUnitMes = (args, showLoading, handleErr) => request('/api/unitMes/user/list', args, POST, showLoading, handleErr);
/**
 * 根据Id获取单位信息
 * @param {*} id
 * @returns
 */
export const GetUnitMesById = (id) => request('/api/unitMes/' + id, "", GET, showLoading, handleErr);
/**
 * 获取用户可以使用的所有单位信息
 * @param {*} args
 */
export const GetAllUserEnableUnitMes = (args, showLoading, handleErr) => request('/api/unitMes/enable/all', args, POST, showLoading, handleErr);
/**
 * 获取用户下载的单位
 * @param {*} args
 * @returns
 */
export const GetUserDownloadUnitList = (args, showLoading, handleErr) => request('/api/unitMes/user/download', args, POST, showLoading, handleErr);
/**
 * 获取可下载的单位
 * @param {*} args
 * @returns
 */
export const GetCanDownloadUnit = (args, showLoading, handleErr) => request('/api/unitMes/downloadAble/list', args, POST, showLoading, handleErr);

/**
 * 删除下载的单位
 * @param {*} args
 * @returns
 */
export const DeletDownLoadUnit = (args, showLoading, handleErr) => request('/api/unitMes/download', args, DELETE, showLoading, handleErr);

/**
 * 下载单位
 * @param {*} args
 * @returns
 */
export const DownLoadUnit = (args, showLoading, handleErr) => request('/api/unitMes/download', args, PUT, showLoading, handleErr);

/**
 * 删除创建的单位
 * @param {*} args
 * @returns
 */
export const DeleteCreateUnit = (args, showLoading, handleErr) => request('/api/unitMes', args, DELETE, showLoading, handleErr);

/**
 * 更新版本
 * @param {*} args
 * @returns
 */
export const UpdateUnitVersion = (args, showLoading, handleErr) => request('/api/unitMes/version/update', args, POST, showLoading, handleErr);
/**
 * 回退
 * @param {*} args
 * @returns
 */
export const RevertUnitVersion = (args, showLoading, handleErr) => request('/api/unitMes/version/revert', args, POST, showLoading, handleErr);

/**
 * 创建单位图片
 */
export const CreateUnitImg = (args, showLoading, handleErr) => request('/api/unitMes/img/create', args, POST, showLoading, handleErr);


/**
 * 获取单位的能力信息
 * @param {*} id
 */
export const GetUnitAbilityInfo = (id, showLoading, handleErr) => request('/api/unitAbility/' + id, '', GET, showLoading, handleErr);
/**
 * 获取所有的能力信息
 */
export const GetAllAbilityInfo = (showLoading, handleErr) => request('/api/ability/list', '', GET, showLoading, handleErr);

export const GetUnitLevel = (args, showLoading, handleErr) => request('/root/unitLevel', args, GET, showLoading, handleErr);
export const SaveUnitLevel = (args, showLoading, handleErr) => request('/root/unitLevel', args, PUT, showLoading, handleErr);

export const GetRegionData = (args, showLoading, handleErr) => request('/root/region', args, GET, showLoading, handleErr);
export const SaveRegion = (args, showLoading, handleErr) => request('/root/region', args, PUT, showLoading, handleErr);

/**
 * 修改密码
 * @param {*} args
 * @returns
 */
export const ChangePwd = (args, showLoading, handleErr) => request('/api/user/changePwd', args, POST, showLoading, handleErr);
/**
 * 修改用户info
 * @param {*} args
 *
 * @returns
 */
export const ChangeUserInfo = (args, showLoading, handleErr) => request('/api/user', args, PUT, showLoading, handleErr);
/**
 * 修改下次新的地图初始化
 * @param {*} args
 * @returns
 */
export const ChangeUserSetting = (args, showLoading, handleErr) => request('/api/user/useSetting', args, PUT, showLoading, handleErr);

// 用户地图有关
/**
 * 获取初始化地图
 * @returns
 */
export const GetLastEditMap = (args, showLoading, handleErr) => request('/api/userMap/lastEdit', args, POST, showLoading, handleErr);

/**
 * 创建草稿地图
 * @param {*} args
 * @returns
 */
export const CreateDraftMap = (args, showLoading, handleErr) => request('/api/userMap/createDraftMap', args, POST, showLoading, handleErr);

/**
 * 更新下载地图的版本
 * @param {*} args
 * @returns
 */
export const UpdateMapVersion = (args, showLoading, handleErr) => request('/api/userMap/version/update', args, POST, showLoading, handleErr);
/**
 * 修改地图基本信息
 * @param {*} args
 * @returns
 */
export const ChangeBaseInfo = (args, showLoading, handleErr) => request('/api/userMap/changeBaseInfo', args, POST, showLoading, handleErr);
/**
 * 保存地图
 * @param {*} args
 * @returns
 */
export const SaveUserMap = (args, showLoading, handleErr) => request('/api/userMap', args, POST, showLoading, handleErr);
/**
 * 优化地图
 * @param {*} args
 * @returns
 */
export const SimpleDrawing = (args) => request('/api/userMap/simpleDrawing', args, POST, false, false);
/**
 * 获取用户创建的地图
 * @returns
 */
export const GetUserMapList = (args, showLoading, handleErr) => request('/api/userMap/list', args, POST, showLoading, handleErr);
/**
 * 获取用户下载的地图
 * @returns
 */
export const GetUserDownloadMap = (args, showLoading, handleErr) => request('/api/userMap/download/list', args, POST, showLoading, handleErr);
/**
 * 获取世界地图
 * @returns
 */
export const GetWorldMapList = (args, showLoading, handleErr) => request('/api/worldMap/list', args, POST, showLoading, handleErr);
/**
 * 根据ID获取地图 可以不展示某些单位
 * @param {*} id
 * @returns
 */
export const GetUserMapById = (id, showLoading, handleErr) => request('/api/userMap/' + id, '', GET, showLoading, handleErr);
/**
 * 根据ID获取地图 可以不展示某些单位
 * @param {*} id
 * @returns
 */
export const GetUserMapWithConfig = (config, showLoading, handleErr) => request('/api/userMap/withConfig', config, POST, showLoading, handleErr);

/**
 * 删除用户地图
 * @param {*} id
 * @returns
 */
export const DelUserMap = (id, showLoading, handleErr) => request('/api/userMap/' + id, '', DELETE, showLoading, handleErr);

/**
 * 获取遭遇地图
 */
export const GetEncounterMap = (args, showLoading, handleErr) => request("/encounterMap", args, POST, showLoading, handleErr);


/**
 * 下载地图
 * @param {*} args
 * @returns
 */
export const DownloadMap = (args, showLoading, handleErr) =>request("/api/userMap/download", args, POST, showLoading, handleErr);
/**
 * 删除用户下载
 * @param {*} args
 * @returns
 */
export const DelDownloadMap = (args, showLoading, handleErr) =>request("/api/userMap/download/delete", args, POST, showLoading, handleErr);

/**
 * 获取模板详情
 * @param {*} id
 * @returns
 */
export const GetUserTemp = (id, showLoading, handleErr) => request("/api/userTemp/" + id, '', GET, showLoading, handleErr);

// 初始化map 信息
export const InitEncounterMap = (args, showLoading, handleErr) => request("/encounter/initSetting", args, GET, showLoading, handleErr);
/**
 * 根据map开始游戏
 * @param {*} args
 * @returns
 */
export const MapInit = (args, showLoading, handleErr) => request("/api/map/init", args, POST, showLoading, handleErr);
/**
 * 根据存档开始游戏
 * @param {*} args
 * @returns
 */
export const RecordInit = (args, showLoading, handleErr) => request("/api/record/continue", args, POST, showLoading, handleErr);
/**
 * 保存记录
 * @param {*} args
 * @returns
 */
export const RecordSaveAs = (args, showLoading, handleErr) => request("/api/record/saveAs", args, POST, showLoading, handleErr);
/**
 * 根据房间号开始游戏
 * @param {*} args
 * @returns
 */
export const RoomInit = (args, showLoading, handleErr) => request("/api/room/init", args, POST, showLoading, handleErr);

/**
 * 根据Id获取存档
 * @param id
 * @param showLoading
 * @param handleErr
 * @returns {undefined|*|Promise|Promise<unknown>}
 * @constructor
 */
export const GetRecordById = (id, showLoading, handleErr) => request("/record/" + id, '', GET, showLoading, handleErr);
/**
 * 根据Id删除记录
 * @param {*} id
 * @returns
 */
export const DelUserRecord = (id, showLoading, handleErr) => request("/api/record/" + id, '', DELETE, showLoading, handleErr);

// 获取一个单位的详细信息
export const GetUnitInfo = (args, showLoading, handleErr) => request('/unitInfo', args, GET, showLoading, handleErr);
/**
 * 获取用户模板绑定单位
 * @param {*} args
 */
export const GetUserTemplateBindUnit = (args, showLoading, handleErr) => request('/api/userTemp/unitList', args, POST, showLoading, handleErr);
/**
 * 保存模板信息
 * @param {*} args
 */
export const SaveTemplateInfo = (args, showLoading, handleErr) => request('/api/userTemp/saveTemplate', args, POST, showLoading, handleErr);

/**
 * 获取用户模板
 * @param {*} args
 */
export const GetUserTemplate = (args, showLoading, handleErr) => request("/api/userTemp/page", args, POST, showLoading, handleErr);
/**
 * 获取网络模板
 * @param {*} args
 */
export const GetDownloadAbleTemplate = (args, showLoading, handleErr) => request("/api/userTemp/download/page", args, POST, showLoading, handleErr);
/**
 * 下载模板
 * @param {} args
 */
export const DownloadTemplate = (args, showLoading, handleErr) => request("/api/userTemp/downloadTemp", args, POST, showLoading, handleErr);
/**
 * 获取用户下载的模板
 * @param {*} args
 */
export const GetUserAttentionTemp = (args, showLoading, handleErr) => request("/api/userAttentionTemp/page", args, POST, showLoading, handleErr);
/**
 * 获取用户的草稿模板
 * @param {*} args
 */
export const GetUserDraftTemplate = (args, showLoading, handleErr) => request('/api/userTemp/draftTemplate', args, GET, showLoading, handleErr);

/**
 * 更新版本信息
 * @param {*} args
 * @returns
 */
export const UpdateUserTempAttention = (args, showLoading, handleErr) => request('/api/userTempAttention/version/update', args, POST, showLoading, handleErr);
/**
 * 回退模板草稿版本
 * @param {*} args
 * @returns
 */
export const RevertTemplateVersion = (args, showLoading, handleErr) => request('/api/userTempAttention/version/revert', args, POST, showLoading, handleErr);



/**
 * 获取用户的草稿模板
 * @param {*} args
 */
export const RemoveUserTemplate = (args, showLoading, handleErr) => request('/api/userTemp/' + args.id, {}, DELETE, showLoading, handleErr);
/**
 * 移除用户模板
 * @param {*} args
 */
export const RemoveUserTemplateAttention = (args, showLoading, handleErr) => request('/api/userTempAttention/' + args.id, {}, DELETE, showLoading, handleErr);


// 获取可以添加到当前模板的单位
export const GetAddTempAbleUnit = (args, showLoading, handleErr) => request('/api/userTemp/addAbleUnitList', args, POST, showLoading, handleErr);

export const GetRegionInfo = (args, showLoading, handleErr) => request('/regionInfo', args, GET, showLoading, handleErr);

// 获取所有的地图
export const GetUnitInfoList = (args, showLoading, handleErr) => request('/unitInfo/list', args, GET, showLoading, handleErr);

// 保存游戏
export const SaveUserRecord = (args, showLoading, handleErr) => request('/unitInfo/list', args, GET, showLoading, handleErr);

/**
 * 获取故事模式
 * @param {*} args
 * @returns
 */
export const GetStoreList = (args, showLoading, handleErr) => request('/map/store/list', args, GET, showLoading, handleErr);
/**
 * 获取用户记录使用分页
 * @param {*} args
 */
export const GetUserRecordList = (args, showLoading, handleErr) => request('/api/record/list', args, POST, showLoading, handleErr);

/**
 * 发送消息
 * @param args
 * @param showLoading
 * @returns {undefined|*|Promise<unknown>}
 * @constructor
 */
export const SendMessage = (args) => request("/api/message/send", args, POST, false, false);


/**
 * 获取房间号
 * @param {*} args
 */
export const GetRoomListByPage = (args, showLoading, handleErr) =>request("/api/room/list", args, POST, showLoading, handleErr);
/**
 * 创建房间
 * @param {*} args
 * @returns
 */
export const CreateRoom = (args, showLoading, handleErr) =>request("/api/room/save", args, PUT, showLoading, handleErr);
/**
 * 玩家加入
 * @param {*} args
 * @returns
 */
export const PlayerJoinRoom = (args, showLoading, handleErr) =>request("/api/room/playerJoin", args, PUT, showLoading, handleErr);
/**
 * 改变控制军队
 * @param {}} args
 * @returns
 */
export const ChangeArmy = (args, showLoading, handleErr) =>request("/api/room/changeArmy", args, POST, showLoading, handleErr);
/**
 * 离开控制军队
 * @param {*} args
 * @returns
 */
export const LevelCtlArmy = (args, showLoading, handleErr) =>request("/api/room/levelCtlArmy", args, POST, showLoading, handleErr);

/**
 * 获取buff信息
 * @param {*} args 
 * @param {*} showLoading 
 * @param {*} handleErr 
 * @returns 
 */
export const GetBuffByType = (args) =>request("/buff/get", args, GET, false, true);

/**
 * 获取是否有可以重连的多人游戏
 * @param args
 * @returns {undefined|*|Promise|Promise<unknown>}
 * @constructor
 */
export const GetCanReConnectRecord = (args) =>request("/api/record/canReConnect", args, GET, false, true);

export const GetMonitorRecordList = (args) =>request("/admin/monitor/record/list", args, POST, true, true);
export const GetUserRecordInfo = (args) =>request("/api/runRecord/" + args, {}, GET, true, true);
