<script setup>
import { useI18n } from "vue-i18n";
import OtherMembersItem from "@/components/myHome/OtherMembersItem.vue";
import { updateNonUsers } from "@/services/householdService.js";
import { ref, watch } from "vue";

const { t } = useI18n();

const props = defineProps({
  id: Number,
  adults: Number,
  children: Number,
  pets: Number,
});

const localAdults = ref(props.adults);
const localChildren = ref(props.children);
const localPets = ref(props.pets);

// Keep in sync with props
watch(() => props.adults, (val) => localAdults.value = val);
watch(() => props.children, (val) => localChildren.value = val);
watch(() => props.pets, (val) => localPets.value = val);

// Watch for changes to send updates to backend
watch([localAdults, localChildren, localPets], ([a, c, p]) => {
  updateNonUsers(a, c, p, props.id);
});
</script>

<template>
  <div class="bg-kf-white flex flex-col gap-1 items-center shadow-lg rounded-2xl py-2 px-2">
    <h1 class="text-2xl text-kf-blue">{{ t("my-home.other-members") }}</h1>
    <div class="flex flex-col gap-1 w-full">
      <OtherMembersItem
          :title="t('my-home.adults')"
          v-model="localAdults"
      />
      <OtherMembersItem
          :title="t('my-home.children')"
          v-model="localChildren"
      />
      <OtherMembersItem
          :title="t('my-home.pets')"
          v-model="localPets"
      />
    </div>
  </div>
</template>
