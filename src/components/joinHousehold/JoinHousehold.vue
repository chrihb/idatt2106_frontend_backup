<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {onMounted, ref} from "vue";
import NewsFull from "@/components/news/NewsFull.vue";
import {ArrowLeftIcon} from "@heroicons/vue/24/solid/index.js";

const { t } = useI18n();
const availableHouseholds = ref([]);
const router = useRouter();



function pickHousehold() {
  // Handle the selection of a household
  console.log("Household selected");
}

onMounted(() => {
  // Fetch available households from the API

  availableHouseholds.value = [
    { address: "123 Main St" },
    { address: "456 Elm St" },
    { address: "789 Oak St" },
  ];
})
</script>

<template>
  <div class="h-full flex justify-center py-4">
    <div class="flex flex-col items-center">
      <div class="overflow-y-auto p-2 max-h-[65vh] w-full flex flex-col gap-2 text-left">
        <p v-if="availableHouseholds.length === 0">No available households</p>
        <div v-else v-for="(household, index) in availableHouseholds" :key="index">
          <div @click="pickHousehold" class="bg-kf-white w-full p-2 drop-shadow-md rounded-md cursor-pointer">
            <p class="text-kf-blue text-2xl">{{household.address}}</p>
          </div>
        </div>
      </div>
      <ArrowLeftIcon @click="router.push('/household/options')" class="cursor-pointer row-1 col-1 mt-2 size-8 rounded-full hover:bg-kf-grey"/>
    </div>
  </div>

</template>

<style scoped>
</style>