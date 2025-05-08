<script setup>
import HouseMember from "@/components/frontpage/HouseMember.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  members: {
    type: Array,
    required: false,
  }
});

</script>

<template>
  <div class="bg-kf-white flex flex-col gap-1 items-center shadow-lg rounded-2xl py-2 px-2">
    <h1 class="text-2xl text-kf-blue font-bold">{{ props.name }}</h1>
    <p class="text-1xl text-kf-blue"> {{ props.address }} </p>
    <div v-for="(member, index) in props.members" :key="index" class="flex flex-col gap-1 w-full">
      <HouseMember :name="member.name" :location="member.address" />
    </div>
  </div>
</template>


<style scoped>

</style>