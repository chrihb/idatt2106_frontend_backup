<script setup>
import HouseMember from "@/components/frontpage/HouseMember.vue";
import { useI18n } from "vue-i18n";
import { useMapStore } from "@/stores/mapStore.js";

const { t } = useI18n();
const mapStore = useMapStore();

const props = defineProps({
  members: {
    type: Array,
    required: true,
  },
});

// Center map when clicking a member
function centerOnMember(member) {
  if (member.latitude && member.longitude) {
    mapStore.centerMapOnSpecificLocation(member.latitude, member.longitude);
  } else {
  }
}
</script>

<template>
  <div class="bg-kf-white flex flex-col gap-1 items-center shadow-lg rounded-2xl py-2 px-2">
    <h1 class="text-2xl text-kf-blue">{{ t("my-home.location-status") }}</h1>
    <div
        v-for="(member, index) in props.members"
        :key="index"
        class="flex flex-col gap-1 w-full"
    >
      <HouseMember
          class="cursor-pointer hover:bg-kf-white-contrast-3"
          :name="member.name"
          :location="member.address || 'Unknown'"
          @click="centerOnMember(member)"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
