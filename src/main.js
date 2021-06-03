import Vue from 'vue'
import App from './App'
import store from './store'
import animated from 'animate.css'
import appHelper from './utils/appHelper'
import eventBus from './manger/EventBus'
import color from "./style/color/index.js"
import language from "./language"
import uView from "uview-ui";
import {myPatch} from "./extendWeixin"

Vue.config.productionTip = false;

Vue.use(animated);
Vue.use(uView);

Vue.prototype.$appHelper = appHelper;
Vue.prototype.$eventBus = eventBus;
Vue.prototype.$color = color;
Vue.prototype.$language = language;
appHelper.store = store;

// uni 目前不支持全局引入 会报错 只能逐个引入
// const req = require.context('./plugin', true, /\.vue$/)
// const requireAll = requireContext => requireContext.keys().forEach(fileName => {
//   // 获取组件配置
//   const componentConfig = requireContext(fileName)
//   // 获取组件的 PascalCase 命名
//   const componentName = upperFirst(
//       camelCase(
//           // 获取和目录深度无关的文件名
//           fileName
//           .split('/')
//           .pop()
//           .replace(/\.\w+$/, '')
//       )
//   );
//
//   // 全局注册组件
//   Vue.component(
//       componentName+"",
//       componentConfig.default || componentConfig
//   )
// });
// requireAll(req);

// 引入自定义组件
import AeBorder from "./components/frame/base/AeBorder";
import AeButton from "./components/frame/base/AeButton.vue"
import AeComplexDialog from "./components/frame/base/AeComplexDialog.vue";
import AeSwitchSelect from "./components/frame/base/AeSwitchSelect.vue"
import AeBaseDialog from "./components/frame/base/AeBaseDialog.vue"
import AeInput from "./components/frame/base/AeInput.vue"
import AeRangeSelect from "./components/frame/base/AeRangeSelect.vue"
import AeButtonList from "./components/frame/base/AeButtonList.vue"
import AeClickPoint from "./components/frame/base/AeClickPoint.vue"
import AeDataGrid from "./components/frame/base/AeDataGrid.vue"
import AeDynamic from "./components/frame/base/AeDynamic.vue"
import AeForm from "./components/frame/base/AeForm.vue"
import AeInputDialog from "./components/frame/base/AeInputDialog.vue"
import AeMessage from "./components/frame/base/AeMessage.vue"
import AeLoading from "./components/frame/base/AeLoading.vue"
import AePage from "./components/frame/base/AePage.vue"
import AeTabForm from "./components/frame/base/AeTabForm.vue"
import AeTip from "./components/frame/base/AeTip.vue"
import AeTransfer from "./components/frame/base/AeTransfer.vue"
import AeTooltip from "./components/frame/base/AeTooltip.vue"

Vue.component("AeBorder", AeBorder);
Vue.component("AeComplexDialog", AeComplexDialog);
Vue.component("AeBaseDialog", AeBaseDialog);
Vue.component("AeButton", AeButton);
Vue.component("AeInput", AeInput);
Vue.component("AeSwitchSelect", AeSwitchSelect);
Vue.component("AeRangeSelect", AeRangeSelect);
Vue.component("AeButtonList", AeButtonList);
Vue.component("AeClickPoint", AeClickPoint);
Vue.component("AeDataGrid", AeDataGrid);
Vue.component("AeDynamic", AeDynamic);
Vue.component("AeForm", AeForm);
Vue.component("AeInputDialog", AeInputDialog);
Vue.component("AeLoading", AeLoading);
Vue.component("AeMessage", AeMessage);
Vue.component("AeTabForm", AeTabForm);
Vue.component("AePage", AePage);
Vue.component("AeTip", AeTip);
Vue.component("AeTransfer", AeTransfer);
Vue.component("AeTooltip", AeTooltip);

// 引入插件组件
import UniIcons from "./plugin/uni-icons/uni-icons"
Vue.component("UniIcons", UniIcons);

import UniNumberBox from "./plugin/uni-number-box/uni-number-box"
Vue.component("UniNumberBox", UniNumberBox);

import UniSegmentedControl from "./plugin/uni-segmented-control/uni-segmented-control"
Vue.component("UniSegmentedControl", UniSegmentedControl);

import UniRate from "./plugin/uni-rate/uni-rate"
Vue.component("UniRate", UniRate);

import UniTag from "./plugin/uni-tag/uni-tag"
Vue.component("UniTag", UniTag);

import UniTable from "./plugin/uni-table/uni-table"
Vue.component("UniTable", UniTable);
import UniTr from "./plugin/uni-tr/uni-tr"
Vue.component("UniTr", UniTr);
import UniTh from "./plugin/uni-th/uni-th"
Vue.component("UniTh", UniTh);
import UniTd from "./plugin/uni-td/uni-td"
Vue.component("UniTd", UniTd);

import UploadFile from "./plugin/uni-file-picker/upload-file"
Vue.component("UploadFile", UploadFile);
import UploadImage from "./plugin/uni-file-picker/upload-image"
Vue.component("UploadImage", UploadImage);
import UniFilePicker from "./plugin/uni-file-picker/uni-file-picker"
Vue.component("UniFilePicker", UniFilePicker);

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
  ...App,
  store
});
app.$mount();

// #ifndef H5
Vue.prototype.__patch__ = myPatch;
// #endif