<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  nearest: {
    type: Object,
    required: true,
  },
});

</script>

<template>
  <div class="bg-kf-white flex flex-col gap-1 items-start shadow-lg rounded-2xl py-2 px-2">
    <h1 class="text-2xl text-kf-blue">{{ t("my-home.nearest") }} {{props.title}}</h1>
    <p class="text-1xl text-kf-blue"> {{props.nearest.address}} </p>
    <p class="text-1xl text-kf-blue">{{ t("my-home.distance") }}: {{ props.nearest.distance }} km</p>
    <p class="text-1xl text-kf-blue">{{ t("my-home.coordinates") }}: {{ props.nearest.location.lat }}, {{ props.nearest.location.lng }}</p>
  </div>
</template>


<style scoped>

</style>
