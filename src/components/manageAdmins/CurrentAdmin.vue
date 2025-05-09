<script setup>
import { defineProps, defineEmits } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  admin: {
    id: Number,
    username: String,
    email: String,
  },
});

const emit = defineEmits(["removeAdmin", "sendPasswordResetEmail"]);
</script>

<template>
  <div class="grid grid-cols-5 p-1 gap-4 justify-center items-center">
    <div class="text-xl col-span-2">
      {{ admin.username }}
    </div>
    <div class="text-xl col-span-2">
      {{ admin.email }}
    </div>
    <div class=" flex flex-row gap-2">
      <button @click="$emit('sendPasswordResetEmail', admin.id)"
              class="bg-kf-white-contrast-4 border-kf-blue border-1 rounded-md p-1 cursor-pointer
              hover:bg-kf-link-blue hover:text-white hover:shadow-md
              active:bg-kf-blue active:scale-95
              focus:outline-none focus:ring-1 focus:ring-kf-blue
              transition">
        {{ t("manage-admins.new-password") }}
      </button>
      <button @click="$emit('removeAdmin', admin.id)"
              class="bg-kf-red border-kf-blue border-1 rounded-md p-1 cursor-pointer
              hover:bg-kf-orange hover:text-white hover:shadow-md
              active:bg-kf-red active:scale-95
              focus:outline-none focus:ring-1 focus:ring-kf-blue
              transition">
        {{ t("manage-admins.remove") }}
      </button>
    </div>
  </div>
</template>