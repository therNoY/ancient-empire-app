<template>
  <encounter v-model="showEncounter" @chooseMap="startStandGame"></encounter>
</template>

<script>
  import {startGame} from "../../utils/gameHelper.js"
  import Encounter from "./Encounter";
  import dialogShow from "@/mixins/frame/dialogShow";

  export default {
    components: {
      Encounter
    },
    mixins:[dialogShow],
    data() {
      return {
        showEncounter: true,
      }
    },
    watch:{
      showEncounter(_v){
        this.$emit("input", _v);
      }
    },
    methods: {
      startStandGame(selectMap) {
        console.log("开启遭遇战", selectMap);
        startGame(selectMap, "encounter");
      },
    }
  }
</script>