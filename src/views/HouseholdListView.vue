<script setup>
import { useRouter } from 'vue-router';
import { useUserStore} from "@/stores/userStore.js";
import { useI18n } from 'vue-i18n';
import HouseholdPanel from "@/components/myHome/HouseholdPanel.vue";

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();


function goToHousehold(id) {
  router.push(`/household/${id}`);
}
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="household in userStore.householdId"
          :key="household.id"
          @click="goToHousehold(household.id)"
          class="cursor-pointer"
      >
        <HouseholdPanel :name="household.name" :address="household.address" />

      </div>
    </div>
  </div>
</template>
