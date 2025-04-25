<script setup>
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { HomeIcon } from "@heroicons/vue/24/solid/index.js";
import AccountSettingsContainer from "@/components/account/AccountSettingsContainer.vue";


const { t } = useI18n();

const mockedSettings = ref([
  {
    id: 1,
    name: "account-settings.household",
    icon: "home",
    route: "/household",
    toggleButton: false,
    admin: false,
  },
  {
    id: 2,
    name: "account-settings.notifications",
    icon: "home",
    route: "/notifications",
    toggleButton: true,
    toggleState: false,
    admin: false,
  }
]);

const iconMap = {
  home: HomeIcon,
};

const toggleSetting = (id) => {
  const setting = mockedSettings.value.find((s) => s.id === id);
  if (setting && setting.toggleButton) {
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
      <AccountSettingsContainer
        v-for="(setting, index) in mockedSettings"
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