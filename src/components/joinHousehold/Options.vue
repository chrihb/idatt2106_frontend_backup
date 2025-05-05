<script setup>
import { useI18n } from "vue-i18n";
import {RouterLink, useRoute} from "vue-router";
import { HomeIcon, PlusCircleIcon } from "@heroicons/vue/24/solid";
import JoinPopup from "@/components/joinHousehold/JoinPopup.vue";
import {onMounted, ref} from "vue";
import CreatePopup from "@/components/joinHousehold/CreatePopup.vue";

const { t } = useI18n();

const route = useRoute();
const inviteCode = ref('');
const joinVisible = ref(false);
const createVisible = ref(false);

const handleJoin = () => {
  joinVisible.value = true;
};

const handleCreate = () => {
  createVisible.value = true;
};

const closePopup = () => {
  joinVisible.value = false;
  createVisible.value = false;
};

function sanitizeCode(code) {
  return code.trim().replace(/[^A-Z0-9\-]/gi, '').toUpperCase();
}

onMounted(() => {
  const rawCode = route.query.inviteCode;
  if (typeof rawCode === 'string') {
    inviteCode.value = sanitizeCode(rawCode);
    joinVisible.value = true;
  }
});

</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 items-center">
    <div @click="handleCreate" class="flex cursor-pointer flex-col justify-center items-center bg-kf-white border border-kf-white-contrast-3 active:border-kf-blue shadow-md rounded-lg size-32 p-4">
      <PlusCircleIcon class="size-12 text-kf-blue mb-2" />
      <p class="text-center text-kf-blue font-bold">{{ t('my-home.create') }}</p>
    </div>
    <p class="text-kf-blue text-2xl">{{ t('my-home.or') }}</p>
    <div @click="handleJoin" class="flex cursor-pointer flex-col justify-center items-center bg-kf-white border border-kf-white-contrast-3 active:border-kf-blue shadow-md rounded-lg size-32 p-4">
      <HomeIcon class="size-12 text-kf-blue mb-2" />
      <p class="text-center text-kf-blue font-bold">{{ t('my-home.join') }}</p>
    </div>
  </div>
  <JoinPopup v-if="joinVisible" :onClose="closePopup" :defaultInviteCode="inviteCode"/>
  <CreatePopup v-if="createVisible" :onClose="closePopup" />
</template>

<style scoped>
</style>
