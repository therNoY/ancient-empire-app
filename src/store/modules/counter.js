// 公用计数器 支持降级
const baseNum = 250
const store = {
    state: {
        currentGap: {},
        activeGap: {},
    },
    mutations: {
        startTimer(state, gap) {
            if (gap < baseNUm || gap % baseNum != 0) {
                console.error("仅支持计数间隔" + baseNum + "的整数倍", gap);
                return;
            }
            if (activeGap[gap]) {
                console.log("已存在" + gap + "间隔计数器");
                return;
            }
            if (gap > currentGap) {
                console.log("注册计数器" + gap + "间隔");
                activeGap[gap] = 0;
            } else {
                // 计数器间隔升级
                state.activeGap[gap] = 0;
                let _timer = setInterval(() => {
                    if (state.activeGap[gap] < 1000) {
                        state.activeGap[gap]++;
                    } else {
                        state.activeGap[gap] = 0;
                    }
                    console.log("gap" + gap + "间隔计数器运行", state.activeGap[gap]);
                }, gap);
                state.timer[gap] = _timer;
            }
        },
        stopTimer(state, gap) {
            if (gap < baseNUm || gap % baseNum != 0) {
                console.error("仅支持计数间隔" + baseNum + "的整数倍", gap);
                return;
            }
            if (gap != currentGap) {
                console.log("间隔" + gap + "计数器停止");
                delete state.activeGap[gap];
            } else {
                
            }
        }
    },
    actions: {

    }
}

export default store;