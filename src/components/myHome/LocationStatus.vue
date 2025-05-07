<script setup>
import HouseMember from "@/components/frontpage/HouseMember.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const { t } = useI18n();

const props = defineProps({
  members: {
    type: Array,
    required: true,
  },
});

</script>

<template>
  <div class="bg-kf-white flex flex-col gap-1 items-center shadow-lg rounded-2xl py-2 px-2">
    <h1 class="text-2xl text-kf-blue">{{ t("my-home.location-status") }}</h1>
    <div v-for="(member, index) in props.members" :key="index" class="flex flex-col gap-1 w-full">
      <HouseMember class="cursor-pointer hover:bg-kf-white-contrast-3" :name="member.name" :location="member.address" />
    </div>
  </div>
</template>


<style scoped>

</style>