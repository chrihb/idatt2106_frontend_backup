<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: "Confirm",
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
});

const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
  <!-- Confirmation Modal -->
  <Teleport to="body">
    <div class="fixed inset-0 flex items-center justify-center z-[200] p-4">
      <div class="bg-kf-white rounded-lg p-4 sm:p-6 shadow-xl max-w-md w-full">
        <p class="mb-4 sm:mb-6 text-base sm:text-lg">{{ message }}</p>
        <div class="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-3">
          <button
              class="w-full sm:w-auto order-2 sm:order-1 px-4 py-3 bg-kf-grey hover:bg-kf-white-contrast-5 rounded-lg
                       text-kf-black font-medium transition-colors duration-200 text-base"
              @click="$emit('cancel')"
          >
            {{ cancelText }}
          </button>
          <button
              class="w-full sm:w-auto order-1 sm:order-2 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg
                       text-kf-white font-medium transition-colors duration-200 text-base"
              @click="$emit('confirm')"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

</style>