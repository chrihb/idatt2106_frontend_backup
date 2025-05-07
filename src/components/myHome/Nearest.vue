<script setup>
import HouseMember from "@/components/frontpage/HouseMember.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import NearestItem from "@/components/myHome/NearestItem.vue";

const router = useRouter();
const { t } = useI18n();

const props = defineProps({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});



</script>

<template>
  <div class="bg-kf-white flex flex-col gap-1 items-center shadow-lg rounded-2xl py-2 px-2">
    <h1 class="text-2xl text-kf-blue">{{ t("my-home.nearest") }}</h1>
    <div class="flex flex-col gap-1 w-full">
      <NearestItem class="cursor-pointer" :title="t('my-home.shelter')" :latitude="props.latitude" :longitude="props.longitude"/>
      <NearestItem class="cursor-pointer" :title="t('my-home.defib')" :latitude="props.latitude" :longitude="props.longitude"/>
      <NearestItem class="cursor-pointer" :title="t('my-home.hospital')" :latitude="props.latitude" :longitude="props.longitude"/>
    </div>
  </div>
</template>


<style scoped>

</style>