<script setup>
import {ref} from 'vue';
import {useForm} from 'vee-validate';
import FormField from '@/components/input/FormField.vue';
import {createNews} from '@/services/newsService.js';
import {useI18n} from "vue-i18n";

const { t } = useI18n();
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const {validate, values: form, resetForm} = useForm({
  validationSchema: {
    caseId: (v) => v ? true : 'Case ID is required',
    title: (v) => v ? true : 'Title is required',
    content: (v) => v ? true : 'Content is required',
    district: (v) => v ? true : 'District is required',
  },
});

const submitForm = async () => {
  const result = await validate();
  if (!result.valid) return;

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await createNews(form, t);
    successMessage.value = 'News created successfully!';
    resetForm();
    setTimeout(() => {
      window.location.href = '/admin-settings/news';
    }, 1500);
  } catch (error) {
    errorMessage.value = error.message || 'Failed to create news';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="w-full max-w-md">
      <form @submit.prevent="submitForm" class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold text-center mb-4">{{ t('admin-settings.news.createNewNews') }}</h1>

        <div v-if="successMessage" class="text-green-600 text-center">{{ successMessage }}</div>
        <div v-if="errorMessage" class="text-red-600 text-center">{{ errorMessage }}</div>

        <FormField field-name="caseId" label="Case ID" />
        <FormField field-name="title" label="Title" />
        <FormField field-name="content" label="Content" />
        <FormField field-name="district" label="District" />

        <button
          :disabled="isSubmitting"
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Submit News
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>