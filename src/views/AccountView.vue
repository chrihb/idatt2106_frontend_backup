<script setup>
import { useI18n } from "vue-i18n";
import AccountSetting from "@/components/account/AccountSetting.vue";
import { settings, iconMap } from "@/utils/settings.js";


const { t } = useI18n();

const toggleSetting = (id) => {
  const setting = settings.value.find((s) => s.id === id);
  if (setting && setting.type === "toggleButton") {
    setting.toggleState = !setting.toggleState;
  }
};
</script>

<template>
  <div class="flex flex-col p-4">
    <div class="flex flex-row">
      <h1 class="text-2xl font-bold mb-4 text-kf-blue">{{t("account-settings.title")}}</h1>
    </div>
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <AccountSetting
        v-for="(setting, index) in settings"
        :key="index"
        :setting="setting"
        :iconMap="iconMap"
        @toggle="toggleSetting"
      />
    </div>
  </div>
</template>

<style scoped>

</style>