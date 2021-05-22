import Vue from 'vue';
import AeTip from "../components/frame/base/AeTip"
const messageVueConstructor = Vue.extend(AeTip);


messageVueConstructor.prototype.close = function() {
  var vm=this;
  this.$on('after-leave', _ => {
    if (vm.$el && vm.$el.parentNode) {
      vm.$el.parentNode.removeChild(vm.$el);
    }
    this.$destroy();
  });
    vm.show = false;

};
const showAeTip = (options = {}) => {
    if (Vue.prototype.$isServer) return;
    options = Object.assign({}, defaults, options);
    let parent = document.body ;
    let instance = new messageVueConstructor({
      el: document.createElement('div'),
      data: options
    });
    parent.appendChild(instance.$el);
    Vue.nextTick(() => {
      instance.show = true;
      setTimeout(function(){
        instance.close();
      },options.duration)
    });


    return instance;
  };

  export default showAeTip;
