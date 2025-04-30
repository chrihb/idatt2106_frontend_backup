<script setup>
import { useField } from 'vee-validate';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  fieldName: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();
const { value, errorMessage, validate } = useField(() => props.fieldName);

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
    <label :for="fieldName" class="block text-sm font-medium text-kf-blue mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <input
          :type="inputType"
          :id="fieldName"
          :name="fieldName"
          :value="value"
          @input="handleInput"
          @blur="validateField"
          class="w-full p-2 pr-12 border rounded focus:outline-none focus:ring-2 focus:ring-kf-link-blue"
          :class="{ 'border-kf-red': errorMessage }"
          :aria-describedby="errorMessage ? `${fieldName}-error` : null"
      />
      <button
          type="button"
          class="toggle-password absolute inset-y-0 right-0 pr-3 flex items-center text-kf-darkgrey text-sm cursor-pointer"
          @click="toggleShowPassword"
          :aria-label="showPassword ? t('password.hide') : t('password.show')"
      >
        {{ showPassword ? t('password.hide') : t('password.show') }}
      </button>
    </div>
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

<style scoped>
</style>
