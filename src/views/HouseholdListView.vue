<script setup>
import {useRouter} from 'vue-router';
import {useUserStore} from "@/stores/userStore.js";
import {useI18n} from 'vue-i18n';
import HouseholdPanelMembers from "@/components/myHome/HouseholdPanelMembers.vue";

const {t} = useI18n();
const userStore = useUserStore();
const router = useRouter();


function goToHousehold(id) {
  router.push(`/household/${id}`);
}
</script>

<template>
  <div class="container p-2">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="household in userStore.householdId"
          :key="household.id"
          class="cursor-pointer"
          @click="goToHousehold(household.id)"
      >
        <HouseholdPanelMembers :name="household.name" :members="household.members" :address="household.address" />

      </div>
    </div>
  </div>
</template>
