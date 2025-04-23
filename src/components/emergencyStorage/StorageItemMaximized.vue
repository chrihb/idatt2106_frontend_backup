<script lang="ts">
import {defineComponent} from 'vue';
import StorageItemMinimized from "@/components/emergencyStorage/StorageItemMinimized.vue";

interface EmergencyItem {
  id: number;
  name: string;
  amount: string | number;
  expirationDate: string;
}

export default defineComponent({
  name: 'StorageItemMaximized',
  components: {StorageItemMinimized},
  props: {
    categoryId: {
      type: Number,
      required: true
    },
    display: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as () => EmergencyItem[],
      required: true
    },
  },
  emits: ['close'],
  setup(props, {emit}) {
    console.log("open");
    const close = () => {
      emit('close');
    };

    return {
      close
    };
  }
});
</script>

<template>
  <Teleport to="body">
    <div v-if="display"
         class="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
      <div
          class="bg-white rounded-lg shadow-xl w-4/5 md:w-3/5 max-h-4/5 overflow-auto p-6 max-w-3xl">
        <div class="flex flex-row justify-between items-center mb-6 border-b pb-4">
          <h1 class="text-2xl font-bold text-gray-800">Category Details</h1>
          <button
              class="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
              @click="close"
          >
            ✖
          </button>
        </div>

        <div class="space-y-3">
          <StorageItemMinimized
              v-for="item in items"
              :key="item.id"
              :name="item.name"
              :amount="item.amount"
              :expirationDate="item.expirationDate"
              :id="item.id"/>
        </div>

        <div class="mt-6 pt-4 border-t flex justify-end">
          <button
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200"
              @click="close"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>

</style>