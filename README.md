本项目是Vue 项目(H5) 转 uni-app版本

### H5转uniapp遇到的问题

1. uniapp项目搭建
	1. 使用脚手架搭建uni-app
	https://blog.csdn.net/qq_29752857/article/details/108592692
	2. 安装sass版本不能安装最高版本


2. weixin小程序无法解析:style='Object' 的绑定的样式 必须使用 :style='{width:width+"px"}'完成 
3. 微信小程序国际化 默认值 设置获取不到this.$t 使用自己实现的 lang 绑定到 uni上实现
4. 微信小程序使用@font-face自定义 语言无效H5可以  (使用uni可以) 只能使用uni.loadFontFace
5. H5传递参数和小程序 有些不同 H5可以直接传 import 微信要传递 ()=>{} 匿名函数调用
6. 当前版本uni-app v-for中使用v-model有问题 无法传值
7. 不能使用render函数 需要改
8. 不支持长按拖动
