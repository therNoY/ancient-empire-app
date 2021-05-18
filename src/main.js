import Vue from 'vue'
import App from './App'
import store from './store'
import axios from 'axios'
import animated from 'animate.css'
import appHelper from './utils/appHelper'
import eventBus from './manger/EventBus'
import style from "./style"
import language from "./language"
import uView from "uview-ui";

Vue.config.productionTip = false;

Vue.use(animated);
Vue.use(uView);

Vue.prototype.$http = axios;
Vue.prototype.$appHelper = appHelper;
Vue.prototype.$eventBus = eventBus;
Vue.prototype.$style = style;
Vue.prototype.$language = language;
appHelper.store = store;

// 引入自定义组件
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

// 引入插件组件
import UniIcons from "./plugin/uni-icons/uni-icons"
Vue.component("UniIcons", UniIcons);

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
  ...App,
  store
});
app.$mount();


