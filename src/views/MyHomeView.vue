<script setup>
import MinimalMap from '@/components/map/MinimalMap.vue';
import HouseStatus from "@/components/frontpage/HouseStatus.vue";
import Address from "@/components/myHome/Address.vue";
import Nearest from "@/components/myHome/Nearest.vue";
import {useI18n} from "vue-i18n";
import {useHomeStore} from "@/stores/homeStore.js";
import ManageStorage from "@/components/myHome/ManageStorage.vue";
import CompleteMap from "@/components/map/CompleteMap.vue";


const { t } = useI18n();
const homeStore = useHomeStore();
</script>

<template>
  <div class="py-2 px-2">
    <div class="grid grid-cols-[auto_1fr] gap-2">
      <div class="flex flex-col gap-2">
        <Address class="" />
        <Nearest class="" :title="t('my-home.shelter')" :nearest="homeStore.nearest.shelter" ></Nearest>
        <Nearest class="" :title="t('my-home.defib')" :nearest="homeStore.nearest.defib" ></Nearest>
        <Nearest class="" :title="t('my-home.hospital')" :nearest="homeStore.nearest.hospital" ></Nearest>
        <!--Legevakt-->
        <!--Møteplass-->
        <ManageStorage class=""></ManageStorage>
      </div>
      <div class="flex flex-col gap-2">
        <HouseStatus class="" />
        <div class="relative h-full w-full rounded-2xl shadow-lg overflow-hidden">
          <CompleteMap class="h-full w-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
