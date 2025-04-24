<script setup>
import {useField} from 'vee-validate';
import {ref, computed} from 'vue';

const props = defineProps({
  fieldName: {type: String, required: true},
  label: {type: String, required: true},
  modelValue: {type: String, default: ''},
});

const emit = defineEmits(['update:modelValue']);

const {value, errorMessage, validate} = useField(props.fieldName);

if (props.modelValue) {
  value.value = props.modelValue;
}

const showPassword = ref(false);
const inputType = computed(() => (showPassword.value ? 'text' : 'password'));

const handleInput = (event) => {
  value.value = event.target.value;
  emit('update:modelValue', event.target.value);
};

const validateField = () => {
  validate();
};

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="form-field">
    <label :for="fieldName">{{ label }}</label>
    <div class="input-wrapper">
      <input
          :type="inputType"
          :id="fieldName"
          :name="fieldName"
          :value="value"
      @input="handleInput"
      @blur="validateField"
      :class="{ 'error-input': errorMessage }"
      :aria-describedby="errorMessage ? `${fieldName}-error` : null"
      />
      <button
          type="button"
          class="toggle-password"
          @click="toggleShowPassword"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
      >
        {{ showPassword ? 'Hide' : 'Show' }}
      </button>
    </div>
    <span v-if="errorMessage" :id="`${fieldName}-error`" class="error" aria-live="polite">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style scoped>
</style>
