<script setup>
import { useI18n } from "vue-i18n";
import AccountRouterLink from "@/components/account/AccountRouterLink.vue";
import { iconMap, routedSettings, toggleableSettings } from "@/utils/settings.js";
import AccountToggleButton from "@/components/account/AccountToggleButton.vue";


const { t } = useI18n();

const toggleSetting = (id) => {
  const setting = toggleableSettings.value.find((s) => s.id === id);
  if (setting) {
    setting.toggleState = !setting.toggleState;
  }
};
</script>

<template>
  <div class="flex flex-col p-4">
    <div class="flex flex-row">
      <h1 class="text-2xl font-bold mb-4 text-kf-blue">{{t("account-settings.title")}}</h1>
    </div>
    <div class="flex flex-row justify-between items-center gap-4 mb-4">
      <div class="flex col-span-1 flex-col justify-center items-center bg-kf-white-contrast-1 shadow-md rounded-lg p-4 h-40">
        <AccountToggleButton v-for="(setting, index) in toggleableSettings"
          :key="index"
          :setting="setting"
          @toggle="toggleSetting"/>
      </div>
      <div class="grid col-span-3 gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <AccountRouterLink
          v-for="(setting, index) in routedSettings"
          :key="index"
          :setting="setting"
          :iconMap="iconMap"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>