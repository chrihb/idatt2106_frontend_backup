<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { adminSettings } from "@/utils/adminSettings.js";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/vue/24/solid/index.js";

const { t } = useI18n();
const router = useRouter();
const expandedSettings = ref([]);

const toggleSettingsVisible = (id) => {
  if (expandedSettings.value.includes(id)) {
    expandedSettings.value = [];
  } else {
    expandedSettings.value = [id];
  }
};
</script>

<template>
  <div class="flex flex-row p-2 ">
    <!-- Sidebar -->
    <div class="w-48 bg-kf-white shadow-lg rounded-2xl p-4 h-full">
      <h1 class="text-xl text-kf-blue font-bold mb-4">{{t("admin-settings.title")}}</h1>
      <div v-for="setting in adminSettings" :key="setting.id" class="space-y-2">
        <!-- Group Button -->
        <button
            class="w-full flex items-center justify-between text-md text-kf-blue py-2 px-4 rounded-lg hover:bg-kf-white-contrast-2 cursor-pointer transition"
            @click="toggleSettingsVisible(setting.id)">
          {{ t(setting.desc) }}
          <ChevronDownIcon
              v-if="expandedSettings.includes(setting.id)"
              class="w-5 h-5 text-kf-blue transition-transform transform"
          />
          <ChevronRightIcon
              v-else
              class="w-5 h-5 text-kf-blue transition-transform transform"
          />
        </button>

        <!-- Submenu -->
        <div v-if="expandedSettings.includes(setting.id)" class="pl-4">
          <button
              v-for="subSetting in setting.children"
              :key="subSetting.id"
              class="w-full text-left text-sm text-kf-blue py-2 px-4 rounded-lg hover:bg-kf-white-contrast-2 cursor-pointer transition"
              @click="router.push(subSetting.route)">
            {{ t(subSetting.desc) }}
          </button>
        </div>
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex-1 bg-kf-white p-4 rounded-2xl shadow-lg ml-4">
      <router-view />
    </div>
  </div>
</template>

<style scoped>

</style>
