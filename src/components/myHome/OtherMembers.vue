<script setup>
import { useI18n } from "vue-i18n";
import OtherMembersItem from "@/components/myHome/OtherMembersItem.vue";
import { updateNonUsers } from "@/services/householdService.js";
import { ref } from "vue";

const { t } = useI18n();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  adults: {
    type: Number,
    default: 0,
  },
  children: {
    type: Number,
    default: 0,
  },
  pets: {
    type: Number,
    default: 0,
  },
});

// Bind to props
const adults = ref(props.adults);
const children = ref(props.children);
const pets = ref(props.pets);

const plus = async (type) => {
  if (type === "adults") adults.value++;
  else if (type === "children") children.value++;
  else if (type === "pets") pets.value++;

  await updateNonUsers(adults.value, children.value, pets.value, props.id);
};

const minus = async (type) => {
  if (type === "adults") {
    if (adults.value === 0) return;
    adults.value--;
  } else if (type === "children") {
    if (children.value === 0) return;
    children.value--;
  } else if (type === "pets") {
    if (pets.value === 0) return;
    pets.value--;
  }

  await updateNonUsers(adults.value, children.value, pets.value, props.id);
};
</script>


<template>
  <div class="bg-kf-white flex flex-col gap-1 items-center shadow-lg rounded-2xl py-2 px-2">
    <h1 class="text-2xl text-kf-blue">{{ t("my-home.other-members") }}</h1>
    <div class="flex flex-col gap-1 w-full">
      <OtherMembersItem
          :title="t('my-home.adults')"
          :plus="() => plus('adults')"
          :minus="() => minus('adults')"
          :total="adults"
      />
      <OtherMembersItem
          :title="t('my-home.children')"
          :plus="() => plus('children')"
          :minus="() => minus('children')"
          :total="children"
      />
      <OtherMembersItem
          :title="t('my-home.pets')"
          :plus="() => plus('pets')"
          :minus="() => minus('pets')"
          :total="pets"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
