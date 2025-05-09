<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { ArchiveBoxIcon } from "@heroicons/vue/24/solid/index.js";

import ManageHouseholdModal from "@/components/myHome/ManageHouseholdModal.vue";

const { t } = useI18n();
const showHouseholdModal = ref(false);

const emit = defineEmits(["close", "member-removed"]);

const onMemberRemoved = () => {
  emit("member-removed");
};

const props = defineProps({
  household: {
    type: Object,
    required: true,
  },
});
const openHouseholdModal = () => {
  showHouseholdModal.value = true;
};

const closeHouseholdModal = () => {
  showHouseholdModal.value = false;
};
</script>

<template>
  <div>
    <div
        @click="openHouseholdModal"
        class="bg-kf-white cursor-pointer flex flex-col gap-1 items-center shadow-lg rounded-2xl py-2 px-2"
    >
      <div class="flex gap-1">
        <ArchiveBoxIcon class="size-8 text-kf-blue" />
        <h1 class="text-2xl text-kf-blue">{{ t("my-home.manage-household") }}</h1>
      </div>
    </div>
    <ManageHouseholdModal
        :is-open="showHouseholdModal"
        @close="closeHouseholdModal"
        @member-removed="onMemberRemoved"
        :household="household"
    />
  </div>
</template>

<style scoped>
</style>