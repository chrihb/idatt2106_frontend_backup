<script setup>
import { useRoute, useRouter } from 'vue-router'
import { deleteNews } from '@/services/newsService.js'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const newsId = route.params.caseId || null
const isDeleting = ref(false)
const errorMessage = ref('')

const { t } = useI18n()

const handleDelete = async () => {
  if (!newsId) return

  isDeleting.value = true
  errorMessage.value = ''

  try {
    await deleteNews(newsId, t)
    window.location.href = '/admin-settings/news';
  } catch (err) {
    errorMessage.value = t('admin-settings.news.deleteError')
    console.error(err)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1 class="text-2xl font-bold mb-4">Delete News</h1>
    <p class="text-lg mb-2">Are you sure you want to delete this news item?</p>
    
    <div v-if="errorMessage" class="text-red-600 mb-2">{{ errorMessage }}</div>

    <button
      @click="handleDelete"
      :disabled="isDeleting"
      class="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
    >
      {{ isDeleting ? 'Deleting...' : 'Delete' }}
    </button>
  </div>
</template>