<script setup>
import News from "@/components/frontpage/News.vue";
import {useUserStore} from "@/stores/userStore.js";
import CompleteMap from "@/components/map/CompleteMap.vue";
import PrimaryStorageStatus from "@/components/frontpage/PrimaryStorageStatus.vue";
import LocationStatusFront from "@/components/frontpage/LocationStatusFront.vue";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getPrimaryHousehold, setPrimaryHousehold} from "@/services/householdService.js";

const userStore = useUserStore();
const router = useRouter();
const household = ref([]);

onMounted(async () => {
  if (userStore.isAuthenticated && userStore.householdId.length > 0) {
    let primary = await getPrimaryHousehold();

    if (!primary?.id && userStore.householdId.length > 0) {
      try {
        const firstHousehold = userStore.householdId[0];
        const success = await setPrimaryHousehold(firstHousehold.id);
        if (success) {
          primary = firstHousehold;
        }
      } catch (e) {
        console.warn("Failed to set default primary household:", e);
      }
    }

    if (primary?.id) {
      const matched = userStore.householdId.find(h => h.id === primary.id);
      if (matched) {
        household.value = matched;
      } else {
        console.warn("Primary household ID not found in user store.");
      }
    }
  }
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-[auto_auto] md:grid-rows-[1fr_auto_auto] gap-2 py-2 px-2">
    <PrimaryStorageStatus v-if="userStore.authenticated && userStore.userSettings.showStorageStatusOnFrontpage"/>
    <LocationStatusFront
        v-if="userStore.authenticated && userStore.userSettings.showHouseholdStatusOnFrontpage && household?.members"
        :members="household.members" @click="router.push(`/household/${household.id}`)"
    />
    <News class="md:col-span-2 w-full"/>
    <CompleteMap class="md:col-span-2 w-full h-full"/>
  </div>
</template>


<style scoped>

</style>
