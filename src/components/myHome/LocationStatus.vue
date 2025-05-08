<script setup>
import { onMounted, onUnmounted } from "vue";
import HouseMember from "@/components/frontpage/HouseMember.vue";
import { useI18n } from "vue-i18n";
import { useMapStore } from "@/stores/mapStore.js";
import { useMarkersStore } from "@/stores/markersStore.js";
import { addMarkerToMap, removeMarkerFromMap } from "@/utils/mapUtils.js";

const { t } = useI18n();
const mapStore = useMapStore();
const markersStore = useMarkersStore();

const props = defineProps({
  members: {
    type: Array,
    required: true,
  },
});

// Add markers on mount
onMounted(() => {
  props.members.forEach((member) => {
    if (member.latitude && member.longitude) {
      const marker = {
        markerId: `member-${member.id}`,
        lat: member.latitude,
        lng: member.longitude,
        type: "AndreMedlemmer", // Make sure this icon exists: /icons/map/Person.png
      };
      if (!markersStore.getMarkerById(marker.markerId)) {
        addMarkerToMap(marker);
      }
    }
  });
});

// Remove markers on unmount
onUnmounted(() => {
  props.members.forEach((member) => {
    removeMarkerFromMap(`member-${member.id}`);
  });
});

// Center map when clicking a member
function centerOnMember(member) {
  if (member.latitude && member.longitude) {
    mapStore.centerMapOnSpecificLocation(member.latitude, member.longitude);
  } else {
    console.error("Member location missing");
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
          :location="member.address"
          @click="centerOnMember(member)"
      />
    </div>
  </div>
</template>



<style scoped>

</style>