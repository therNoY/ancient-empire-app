<template>
  <div class="unit-mes" :style="bkColor">
    <div>
      <div class="int_title">
        <div v-if="unitInfo && unitInfo.unit_mes">
          {{ unitInfo.unit_mes.name }}
        </div>
        <div v-else></div>
      </div>
      <div class="unit_p">
        <ae-border padding="0px" class="show-unit-detail-img">
          <unit-view
            v-if="showMode == 'unit'"
            :unit="unitInfo"
            :color="color"
            :top="20"
            :left="20"
          ></unit-view>
        </ae-border>
      </div>
    </div>

    <div class="unit_description" v-if="unitInfo">
      {{ unitInfo.unit_mes.description }}
    </div>

    <div class="unit_ci">
      <ae-tooltip class="unit-ci-tooltip" :content="$t('eleft')">
        <img src="../../../assets/images/assist/info_life.png" />
        <span v-if="unitInfo">
          <i :style="leftStyle" style="background-color: rgb(229, 255, 0)">{{
            unitLift
          }}</i>
        </span>
      </ae-tooltip>
      <ae-tooltip class="unit-ci-tooltip" :content="$t('eexperience')">
        <img src="../../../assets/images/assist/info_experience.png" />
        <span v-if="unitInfo">
          <i
            :style="experienceRatio"
            style="background-color: rgb(229, 255, 0)"
            >{{ unitInfo.experience }}</i
          >
        </span>
      </ae-tooltip>
      <ae-tooltip class="unit-ci-tooltip" :content="$t('eattach')">
        <img src="../../../assets/images/assist/info_attach.png" />
        <span
          v-if="unitInfo"
          class="noBac"
          :style="
            unitInfo.unit_mes.attack_type == '1'
              ? { color: '#0008ff' }
              : { color: '#ff004f' }
          "
        >
          {{ unitInfo.level_mes.min_attack }} -
          {{ unitInfo.level_mes.max_attack }}
        </span>
      </ae-tooltip>
      <ae-tooltip
        class="unit-ci-tooltip"
        :content="$t('um.mobility')"
      >
        <img src="../../../assets/images/assist/info_move.png" />
        <span class="noBac" v-if="unitInfo">{{
          unitInfo.level_mes.speed
        }}</span>
      </ae-tooltip>
      <ae-tooltip
        class="unit-ci-tooltip"
        :content="$t('um.physicalDefense')"
      >
        <img src="../../../assets/images/assist/info_physical_defense.png" />
        <span class="noBac" v-if="unitInfo">{{
          unitInfo.level_mes.physical_defense
        }}</span>
      </ae-tooltip>
      <ae-tooltip
        class="unit-ci-tooltip"
        :content="$t('um.magicDefense')"
      >
        <img src="../../../assets/images/assist/info_magic_defense.png" />
        <span class="noBac" v-if="unitInfo">{{
          unitInfo.level_mes.magic_defense
        }}</span>
      </ae-tooltip>
    </div>

    <div class="unit-abilitie" v-if="unitInfo">
      <ae-tooltip
        class="unit-abilitie-item"
        v-for="abilitie in unitInfo.abilities"
        :key="abilitie.name"
        :content="abilitie.description"
        placement="left"
      >
        <ae-tag>{{ abilitie.name }}</ae-tag>
      </ae-tooltip>
    </div>
  </div>
</template>

<script>
import UnitView from "../../map_base/UnitView";
export default {
  props: ["curr_unit_color", "curr_color", "unitInfo"],
  components: {
    UnitView,
  },
  data() {
    return {};
  },
  computed: {
    // 背景
    bkColor() {
      return this.$appHelper.getBkColor(this.curr_color);
    },
    // 计算生命条的展示风格
    leftStyle() {
      let life = this.unitLift,
        lifeColor = "#ff0000",
        lifeRatio;
      lifeRatio = life > 100 ? life - 100 + "%" : life + "%";

      if (life <= 10) {
        lifeColor = "#ff0000";
      } else if (life <= 40) {
        lifeColor = "#ff7b00";
      } else if (life <= 80) {
        lifeColor = "#edff51";
      } else if (life < 100) {
        lifeColor = "#fbff00";
      } else if (life == 100) {
        lifeColor = "#1eff00";
      } else if (life > 100) {
        lifeColor = "#7c7c7c";
      }
      return { width: lifeRatio, backgroundColor: lifeColor };
    },

    unitLift() {
      if (typeof this.unitInfo.life == "number") {
        return this.unitInfo.life;
      }
      let life = 0;
      const lifes = this.unitInfo.life;
      for (let index = 0; index < lifes.length; index++) {
        const num = lifes[index];
        life = life + num * Math.round(Math.pow(10, lifes.length - index - 1));
      }
      return life;
    },
    // 返回经验的长的
    experienceRatio() {
      return {
        width:
          this.unitInfo.experience / this.$appHelper.dp[this.unitInfo.level] +
          "%",
      };
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.unit-mes {
  float: left;
  width: 100%;
  height: 100%;
  text-align: center;
}
.int_title {
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: white;
}
.unit_p {
  position: relative;
  font-size: 0;
  width: 74px;
  height: 72px;
  margin: auto;
}
.unit_ci {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  width: 100%;
  .unit-ci-tooltip {
    width: 100%;
    background-color: rgb(255, 255, 255);
    margin-top: 10px;
    padding: 5px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  img {
    float: left;
    width: 9.5%;
    margin-left: 5%;
  }
  span {
    float: left;
    width: 75%;
    margin-left: 5%;
    color: rgb(97, 97, 97);
    font-size: 12px;
    background-color: rgba(0, 255, 157, 0.767);
  }
  i {
    float: left;
    transition-duration: 0.2s;
    transition-property: all;
    transition-timing-function: linear;
    transition-delay: 0s;
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .noBac {
    background-color: rgba(255, 255, 255, 0.767);
  }
}
.unit_description {
  font-size: 12px;
  width: 100%;
  color: rgb(255, 255, 255);
  float: left;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.unit-abilitie {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  .unit-abilitie-item {
    padding: 10px;
    font-size: 12px !important;
    color: white;
  }
}
</style>