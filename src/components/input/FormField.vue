<script setup>
import {useField} from 'vee-validate';

const props = defineProps({
  fieldName: {type: String, required: true},
  label: {type: String, required: true},
  type: {type: String, default: 'text'},
  modelValue: {type: String, default: ''},
});

const emit = defineEmits(['update:modelValue']);
const {value, errorMessage, validate} = useField(props.fieldName);

if (props.modelValue) {
  value.value = props.modelValue;
}

const handleInput = (event) => {
  value.value = event.target.value;
  emit('update:modelValue', event.target.value);
};

const validateField = () => {
  validate();
};
</script>

<template>
  <div class="form-field">
    <label :for="fieldName">{{ label }}</label>
    <input
        :type="type"
        :id="fieldName"
        :name="fieldName"
        :value="value"
    @input="handleInput"
    @blur="validateField"
    :class="{ 'error-input': errorMessage }"
    :aria-describedby="errorMessage ? `${fieldName}-error` : null"
    />
    <span v-if="errorMessage" :id="`${fieldName}-error`" class="error" aria-live="polite">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style scoped>

</style>
