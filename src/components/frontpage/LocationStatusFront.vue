<script setup>
import HouseMember from "@/components/frontpage/HouseMember.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();

const props = defineProps({
  members: {
    type: Array,
    required: false,
  },
});

</script>

<template>
  <div class="bg-kf-white flex flex-col gap-1 items-center shadow-lg rounded-2xl p-2 cursor-pointer">
    <h1 class="text-2xl text-kf-blue font-bold">{{ t("my-home.location-status") }}</h1>
    <div v-for="(member, index) in props.members" :key="index" class="flex flex-col gap-1 w-full">
      <HouseMember :name="member.name" :location="member.address" />
    </div>
  </div>
</template>


<style scoped>

</style>