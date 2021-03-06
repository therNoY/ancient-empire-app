import Vue from 'vue'
import App from './App'
import store from './store'
import animated from 'animate.css'
import appHelper from './utils/appHelper'
import eventBus from './manger/EventBus'
import color from "./style/color/index.js"
import language from "./language"
import { myPatch } from "./extendWeixin"
import minImg from "./style/small-unit-size.scss"
import standImg from "./style/stand-unit-size.scss"
import bigImg from "./style/big-unit-size.scss"

Vue.config.productionTip = false;

Vue.use(animated);
Vue.use(minImg);
Vue.use(standImg);
Vue.use(bigImg);

Vue.prototype.$appHelper = appHelper;
Vue.prototype.$eventBus = eventBus;
Vue.prototype.$color = color;
Vue.prototype.$language = language;
Vue.prototype.$c = appHelper.getBaseSiz;
appHelper.store = store;

Vue.prototype.$uni = uni;
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
import AeTag from "./components/frame/base/AeTag.vue"

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
Vue.component("AeTag", AeTag);

// 引入插件组件
import UniIcons from "./plugin/uni-icons/uni-icons"
Vue.component("UniIcons", UniIcons);
import UniNumberBox from "./plugin/uni-number-box/uni-number-box"
Vue.component("UniNumberBox", UniNumberBox);
import UniSegmentedControl from "./plugin/uni-segmented-control/uni-segmented-control"
Vue.component("UniSegmentedControl", UniSegmentedControl);
import UniRate from "./plugin/uni-rate/uni-rate"
Vue.component("UniRate", UniRate);
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
  store,
});
app.$mount();


// #ifndef H5
Vue.prototype.__patch__ = myPatch;
// #endif