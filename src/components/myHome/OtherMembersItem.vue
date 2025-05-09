<script setup>
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  title: String,
  modelValue: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

const plus = () => emit("update:modelValue", props.modelValue + 1);
const minus = () => {
  if (props.modelValue > 0) emit("update:modelValue", props.modelValue - 1);
};
</script>

<template>
  <div class="bg-kf-white w-full flex justify-between px-2 drop-shadow-md border border-kf-white-contrast-2 rounded-md items-center">
    <p class="text-xl">{{ title }}</p>
    <div class="flex gap-2 items-center">
      <PlusCircleIcon @click="plus" class="size-6 hover:text-kf-green"/>
      <p class="text-xl">{{ modelValue }}</p>
      <MinusCircleIcon @click="minus" class="size-6 hover:text-kf-red"/>
    </div>
  </div>
</template>
