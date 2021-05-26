import Vue from 'vue'
import App from './App'
import store from './store'
import axios from 'axios'
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

Vue.prototype.$http = axios;
Vue.prototype.$appHelper = appHelper;
Vue.prototype.$eventBus = eventBus;
Vue.prototype.$color = color;
Vue.prototype.$language = language;
appHelper.store = store;

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

// 引入插件组件
import UniIcons from "./plugin/uni-icons/uni-icons"
Vue.component("UniIcons", UniIcons);

import UniNumberBox from "./plugin/uni-number-box/uni-number-box"
Vue.component("UniNumberBox", UniNumberBox);

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
  ...App,
  store
});
app.$mount();



// // replace platform patch function
// const ARRAYTYPE = '[object Array]';
// const OBJECTTYPE = '[object Object]';
//
// var myPatch = function (oldVnode, vnode) {
//   var this$1 = this;
//   if (vnode === null) { //destroy
//     return
//   }
//   if (this.mpType === 'page' || this.mpType === 'component') {
//     var mpInstance = this.$scope;
//     var data = Object.create(null);
//     try {
//       data = cloneWithData(this);
//     } catch (err) {
//       console.error(err);
//     }
//     data.__webviewId__ = mpInstance.data.__webviewId__;
//     var mpData = Object.create(null);
//     Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
//       mpData[key] = mpInstance.data[key];
//     });
//     var diffData = this.$shouldDiffData === false ? data : diff(data, mpData);
//     if (Object.keys(diffData).length) {
//       if (Object({
//         "NODE_ENV": "development",
//         "VUE_APP_NAME": "ancient-empire-app",
//         "VUE_APP_PLATFORM": "mp-weixin",
//         "BASE_URL": "/"
//       }).VUE_APP_DEBUG) {
//         console.log(
//             '[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route)
//             + '][' + this._uid +
//             ']差量更新',
//             JSON.stringify(diffData));
//       }
//       this.__next_tick_pending = true;
//       mpInstance.setData(diffData, function () {
//         this$1.__next_tick_pending = false;
//         flushCallbacks$1(this$1);
//       });
//     } else {
//       flushCallbacks$1(this);
//     }
//   }
// };
//
// function cloneWithData(vm) {
//   // 确保当前 vm 所有数据被同步
//   var ret = Object.create(null);
//   var dataKeys = [].concat(
//       Object.keys(vm._data || {}),
//       Object.keys(vm._computedWatchers || {}));
//
//   dataKeys.reduce(function(ret, key) {
//     ret[key] = vm[key];
//     return ret
//   }, ret);
//
//   // vue-composition-api
//   var compositionApiState = vm.__composition_api_state__ || vm.__secret_vfa_state__;
//   var rawBindings = compositionApiState && compositionApiState.rawBindings;
//   if (rawBindings) {
//     Object.keys(rawBindings).forEach(function (key) {
//       ret[key] = vm[key];
//     });
//   }
//
//   //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
//   Object.assign(ret, vm.$mp.data || {});
//   if (
//       Array.isArray(vm.$options.behaviors) &&
//       vm.$options.behaviors.indexOf('uni://form-field') !== -1
//   ) { //form-field
//     ret['name'] = vm.name;
//     ret['value'] = vm.value;
//   }
//
//   let res = JSON.parse(JSON.stringify(ret));
//   console.log(JSON.stringify(ret));
//   if (res.data && res.data.titleSwitchSelect && res.data.titleSwitchSelect.type === 'switchSelect') {
//     debugger
//     console.log(res);
//   }
//   return res;
// }
//
// function diff(current, pre) {
//   var result = {};
//   syncKeys(current, pre);
//   _diff(current, pre, '', result);
//   return result
// }
//
// function syncKeys(current, pre) {
//   if (current === pre) { return }
//   var rootCurrentType = type(current);
//   var rootPreType = type(pre);
//   if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
//     if(Object.keys(current).length >= Object.keys(pre).length){
//       for (var key in pre) {
//         var currentValue = current[key];
//         if (currentValue === undefined) {
//           current[key] = null;
//         } else {
//           syncKeys(currentValue, pre[key]);
//         }
//       }
//     }
//   } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
//     if (current.length >= pre.length) {
//       pre.forEach(function (item, index) {
//         syncKeys(current[index], item);
//       });
//     }
//   }
// }
//
// function flushCallbacks$1(vm) {
//   if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
//     if (process.env.VUE_APP_DEBUG) {
//       var mpInstance = vm.$scope;
//       console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
//           ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
//     }
//     var copies = vm.__next_tick_callbacks.slice(0);
//     vm.__next_tick_callbacks.length = 0;
//     for (var i = 0; i < copies.length; i++) {
//       copies[i]();
//     }
//   }
// }
//
// function _diff(current, pre, path, result) {
//   if (current === pre) { return }
//   var rootCurrentType = type(current);
//   var rootPreType = type(pre);
//   if (rootCurrentType == OBJECTTYPE) {
//     if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
//       setResult(result, path, current);
//     } else {
//       var loop = function ( key ) {
//         var currentValue = current[key];
//         var preValue = pre[key];
//         var currentType = type(currentValue);
//         var preType = type(preValue);
//         if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
//           if (currentValue != pre[key]) {
//             setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
//           }
//         } else if (currentType == ARRAYTYPE) {
//           if (preType != ARRAYTYPE) {
//             setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
//           } else {
//             if (currentValue.length < preValue.length) {
//               setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
//             } else {
//               currentValue.forEach(function (item, index) {
//                 _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
//               });
//             }
//           }
//         } else if (currentType == OBJECTTYPE) {
//           if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
//             setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
//           } else {
//             for (let subKey in currentValue) {
//               _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
//             }
//           }
//         }
//       };
//
//       for (var key in current) loop( key );
//     }
//   } else if (rootCurrentType == ARRAYTYPE) {
//     if (rootPreType != ARRAYTYPE) {
//       setResult(result, path, current);
//     } else {
//       if (current.length < pre.length) {
//         setResult(result, path, current);
//       } else {
//         current.forEach(function (item, index) {
//           _diff(item, pre[index], path + '[' + index + ']', result);
//         });
//       }
//     }
//   } else {
//     setResult(result, path, current);
//   }
// }
//
// function setResult(result, k, v) {
//   result[k] = v;
// }
//
// function type(obj) {
//   return Object.prototype.toString.call(obj)
// }

// #ifndef H5
Vue.prototype.__patch__ = myPatch;
// #endif