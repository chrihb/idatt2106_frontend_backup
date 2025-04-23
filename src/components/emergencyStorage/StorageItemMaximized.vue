<script lang="ts">
import { defineComponent } from 'vue';
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
  setup(props, { emit }) {
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
    <div v-if="display" class="modal-overlay">
      <div class="modal-content">
        <button class="close-button" @click="close">X</button>
        <h1>Category Details</h1>
        <StorageItemMinimized
            v-for="item in items"
            :key="item.id"
            :name="item.name"
            :amount="item.amount"
            :expirationDate="item.expirationDate"
            :id="item.id"/>
      </div>
    </div>
  </Teleport>
</template>

<style>

</style>