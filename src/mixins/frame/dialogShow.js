export default {
    props: {
        value: {
            type: Boolean,
        },
    },
    data() {
        return {
            showModel: "",
        };
    },
    methods: {
        closeSelf() {
            this.$emit("input", false);
        },
        _doBeforeCreate() {
            console.log("准备打开");
            if (this.onDialogCreate && this.onDialogCreate instanceof Function) {
                this.onDialogCreate();
            }
            this.showModel = true;
        }
    },
    watch: {
        showModel(value) {
            this.$emit("input", value);
        },
        value(v) {
            if (v) {
                if (this.beforeDialogCreate && this.beforeDialogCreate instanceof Function) {
                    let res = this.beforeDialogCreate();
                    if (res instanceof Promise) {
                        res.then(_res => {
                            if (_res === true) {
                                this._doBeforeCreate();
                            } else {
                                console.log("无法打开", res);
                                this.$emit("input", false);
                            }
                        }).catch(error => {
                            console.log("无法打开", error);
                            this.$emit("input", false);
                        })
                    } else if (res === true) {
                        this._doBeforeCreate();
                    } else {
                        console.log("无法打开", res);
                        this.$emit("input", false);
                    }
                } else {
                    this._doBeforeCreate();
                }
            } else {
                if (this.onDialogDestroy && this.onDialogDestroy instanceof Function) {
                    this.onDialogDestroy();
                }
                this.showModel = false;
            }
        }
    },
    created() {
        this.showModel = this.value;
    },
    destroyed() {
        if (this.onDialogDestroy && this.onDialogDestroy instanceof Function) {
            this.onDialogDestroy();
        }
    },
}
