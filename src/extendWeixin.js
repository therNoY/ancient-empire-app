// replace platform patch function
const ARRAYTYPE = '[object Array]';
const OBJECTTYPE = '[object Object]';

export function myPatch (oldVnode, vnode) {
  var this$1 = this;
  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = this.$shouldDiffData === false ? data : diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({
        "NODE_ENV": "development",
        "VUE_APP_NAME": "ancient-empire-app",
        "VUE_APP_PLATFORM": "mp-weixin",
        "BASE_URL": "/"
      }).VUE_APP_DEBUG) {
        console.log(
            '[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route)
            + '][' + this._uid +
            ']差量更新',
            JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
      Object.keys(vm._data || {}),
      Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function (ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);

  // vue-composition-api
  var compositionApiState = vm.__composition_api_state__
      || vm.__secret_vfa_state__;
  var rawBindings = compositionApiState && compositionApiState.rawBindings;
  if (rawBindings) {
    Object.keys(rawBindings).forEach(function (key) {
      ret[key] = vm[key];
    });
  }

  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
      Array.isArray(vm.$options.behaviors) &&
      vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return copyProperWithMethod(ret);
}

function diff(current, pre) {
  var result = {};
  syncKeys(current, pre);
  _diff(current, pre, '', result);
  return result
}

function syncKeys(current, pre) {
  if (current === pre) {
    return
  }
  var rootCurrentType = type(current);
  var rootPreType = type(pre);
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    if (Object.keys(current).length >= Object.keys(pre).length) {
      for (var key in pre) {
        var currentValue = current[key];
        if (currentValue === undefined) {
          current[key] = null;
        } else {
          syncKeys(currentValue, pre[key]);
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach(function (item, index) {
        syncKeys(current[index], item);
      });
    }
  }
}

function flushCallbacks$1(vm) {
  if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
    if (process.env.VUE_APP_DEBUG) {
      var mpInstance = vm.$scope;
      console.log(
          '[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + ']['
          + vm._uid +
          ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
    }
    var copies = vm.__next_tick_callbacks.slice(0);
    vm.__next_tick_callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
}

function _diff(current, pre, path, result) {
  if (current === pre) {
    return
  }
  var rootCurrentType = type(current);
  var rootPreType = type(pre);
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(
        pre).length) {
      setResult(result, path, current);
    } else {
      var loop = function (key) {
        var currentValue = current[key];
        var preValue = pre[key];
        var currentType = type(currentValue);
        var preType = type(preValue);
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != pre[key]) {
            setResult(result, (path == '' ? '' : path + ".") + key,
                currentValue);
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(result, (path == '' ? '' : path + ".") + key,
                currentValue);
          } else {
            if (currentValue.length < preValue.length) {
              setResult(result, (path == '' ? '' : path + ".") + key,
                  currentValue);
            } else {
              currentValue.forEach(function (item, index) {
                _diff(item, preValue[index],
                    (path == '' ? '' : path + ".") + key + '[' + index + ']',
                    result);
              });
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (preType != OBJECTTYPE || Object.keys(currentValue).length
              < Object.keys(preValue).length) {
            setResult(result, (path == '' ? '' : path + ".") + key,
                currentValue);
          } else {
            for (let subKey in currentValue) {
              _diff(currentValue[subKey], preValue[subKey],
                  (path == '' ? '' : path + ".") + key + '.' + subKey, result);
            }
          }
        }
      };

      for (var key in current) {
        loop(key);
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        current.forEach(function (item, index) {
          _diff(item, pre[index], path + '[' + index + ']', result);
        });
      }
    }
  } else {
    setResult(result, path, current);
  }
}

function setResult(result, k, v) {
  result[k] = v;
}

function type(obj) {
  return Object.prototype.toString.call(obj)
}

function copyProperWithMethod(obj1){
  let obj2 = JSON.parse(JSON.stringify(obj1));
  copyMethodWithAddress(obj1, obj2);
  return obj2;
}

function copyMethodWithAddress(from, to) {
  let properArray = Object.keys(from);
  for (let proper of properArray) {
    let p = from[proper];
    if (p instanceof Function) {
      to[proper] = p;
    } else if (p instanceof Array) {
      if (!to[proper]) {
        to[proper] = [];
      }
      copyMethodWithAddressByArray(p, to[proper]);
    } else if (p instanceof Object) {
      if (!to[proper]) {
        to[proper] = {};
      }
      copyMethodWithAddress(p, to[proper])
    }
  }
}

function copyMethodWithAddressByArray(from, to) {
  while (to.length < from.length) {
    to.push(null);
  }
  for (let i = 0; i < from.length; i++) {
    let a = from[i];
    if (a instanceof Array){
      copyMethodWithAddressByArray(a, to[i]);
    } else if (a instanceof Function) {
      to[i] = a;
    } else if (a instanceof Object) {
      copyMethodWithAddress(a, to[i]);
    }
  }
}

