<script setup>
import { useField } from 'vee-validate';

const props = defineProps({
  fieldName: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
});

const { value, errorMessage, handleChange } = useField(() => props.fieldName);
</script>

<template>
  <div class="form-field">
    <label :for="fieldName" class="block text-sm font-medium text-kf-blue mb-1">
      {{ label }}
    </label>
    <input
        :id="fieldName"
        :type="type"
        :name="fieldName"
        :value="value"
        @input="handleChange"
        class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-kf-link-blue"
        :class="{ 'border-kf-red': errorMessage }"
        :aria-describedby="errorMessage ? `${fieldName}-error` : null"
    />
    <span
        v-if="errorMessage"
        :id="`${fieldName}-error`"
        class="error-message block text-kf-red text-sm mt-1"
        aria-live="polite"
    >
      {{ errorMessage }}
    </span>
  </div>
</template>
