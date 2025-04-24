<script setup>
import { useField } from 'vee-validate';

const props = defineProps({
  fieldName: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const { value, errorMessage, validate } = useField(props.fieldName);

if (props.modelValue) {
  value.value = props.modelValue;
}

const handleInput = (event) => {
  value.value = event.target.checked;
  emit('update:modelValue', event.target.checked);
};

const validateField = () => {
  validate();
};
</script>

<template>
  <div class="form-field">
    <label>
      <input
          type="checkbox"
          :name="fieldName"
          :checked="value"
      @change="handleInput"
      @blur="validateField"
      />
      {{ label }}
    </label>
    <span v-if="errorMessage" :id="`${fieldName}-error`" class="error" aria-live="polite">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style scoped>
</style>
