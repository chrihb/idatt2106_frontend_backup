<script setup>
import {useI18n} from "vue-i18n";
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/vue/24/solid/index.js";

const { t } = useI18n();

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
  onConfirm: {
    type: Function,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
});

</script>

<template>
  <div class="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 ">
    <div class="bg-kf-white p-6 rounded-lg shadow-lg max-w-lg relative border border-kf-blue">
      <XMarkIcon @click="onClose" class="absolute top-2 right-2 cursor-pointer h-6 w-6 rounded-full hover:bg-kf-grey text-kf-blue" />
      <div class="flex flex-col items-center">
        <h1 class="text-kf-blue font-bold mb-6 text-2xl">Confirm</h1>
        <p class="text-kf-blue text-lg">Are you sure you want to join household on address:</p>
        <p class="text-kf-blue text-lg font-bold mt-2">{{address}}</p>
        <div class="flex justify-between w-full px-4 mt-4">
          <XCircleIcon @click="onClose" class="text-kf-red size-12 hover:text-kf-white-contrast-6 cursor-pointer"></XCircleIcon>
          <CheckCircleIcon @click="onConfirm" class="text-kf-green size-12 hover:text-kf-white-contrast-6 cursor-pointer"></CheckCircleIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
