<script setup>
import { useI18n } from "vue-i18n";
import { useUserStore} from "@/stores/userStore.js";
import { useHomeStore } from "@/stores/homeStore.js";

const userStore = useUserStore();
const homeStore = useHomeStore();
const { t } = useI18n();

const props = defineProps({
  id: {
    type: Number,
    required: true,
}});

const household = userStore.householdId.find(household => household.id === props.id);

</script>

<template>
  <div class="bg-kf-white flex flex-col gap-1 items-center shadow-lg rounded-2xl py-2 px-2">
    <h1 class="text-2xl text-kf-blue">{{ t("my-home.address") }}</h1>
    <p class="text-1xl text-kf-blue"> {{household.address}} </p>
  </div>
</template>


<style scoped>

</style>