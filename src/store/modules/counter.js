// 公用计数器
const superNum = [300, 500, 1000, 2000, 3000, 5000]
const store = {
    state: {
        timer: {},
        signal: {},
    },
    mutations: {
        startTimer(state, gap) {
            if (superNum.indexOf(gap) === -1) {
                console.error("不支持的计数器类型", gap);
                return;
            }
            if (state.timer[gap]) {
                return;
            } else {
                state.signal[gap] = 0;
                let _timer = setInterval(() => {
                    if (state.signal[gap] < 1000) {
                        state.signal[gap]++;
                    } else {
                        state.signal[gap] = 0;
                    }
                    console.log("gap" + gap + "间隔计数器运行", state.signal[gap]);
                }, gap);
                state.timer[gap] = _timer;
            }
        },
        stopTimer(state, gap) {
            if (superNum.indexOf(gap) === -1) {
                console.error("不支持的计数器类型", gap);
                return;
            }
            if (state.timer[gap]) {
                console.log("计数器停止");
                clearInterval(state.timer[gap]);
                state.timer[gap] = null;
            }
        }
    },
    actions: {

    }
}

export default store;