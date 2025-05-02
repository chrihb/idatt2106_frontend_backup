<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {onMounted, ref} from "vue";
import {ArrowLeftIcon} from "@heroicons/vue/24/solid/index.js";
import ConfirmPopup from "@/components/joinHousehold/ConfirmPopup.vue";

const { t } = useI18n();
const availableHouseholds = ref([]);
const router = useRouter();
const openConfirmPopup = ref(false);
const selectedAddress = ref("");


function openPopup(address) {
  selectedAddress.value = address
  openConfirmPopup.value = true;
}

function closePopup() {
  openConfirmPopup.value = false;
}

function onConfirm() {
  closePopup()
  router.push('/my-home');
}

onMounted(() => {
  // Fetch available households from the API

  availableHouseholds.value = [
    { address: "123 Main St" },
    { address: "456 Elm St" },
    { address: "789 Oak St" },
    { address: "123 Main St" },
    { address: "456 Elm St" },
    { address: "789 Oak St" },
    { address: "123 Main St" },
    { address: "456 Elm St" },
    { address: "789 Oak St" },
    { address: "123 Main St" },
    { address: "456 Elm St" },
    { address: "789 Oak St" },
  ];
})
</script>

<template>
  <div class="flex flex-col items-center max-h-screen overflow-y-auto">
    <div class="overflow-y-auto px-2 max-h-100 w-full flex flex-col gap-2 text-left">
      <p v-if="availableHouseholds.length === 0">No available households</p>
      <div v-else v-for="(household, index) in availableHouseholds" :key="index">
        <div @click="openPopup(household.address)" class="bg-kf-white w-full p-2 drop-shadow-md rounded-md cursor-pointer">
          <p class="text-kf-blue text-2xl">{{ household.address }}</p>
        </div>
      </div>
    </div>
    <ArrowLeftIcon @click="router.push('/household/options')" class="cursor-pointer mt-2 size-8 rounded-full hover:bg-kf-grey"/>
    <ConfirmPopup
        v-if="openConfirmPopup"
        :address="selectedAddress"
        :onClose="closePopup"
        :onConfirm="onConfirm"
    />
  </div>
</template>


<style scoped>
</style>