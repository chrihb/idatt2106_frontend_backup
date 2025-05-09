<script setup>
import { useI18n } from "vue-i18n";
import { onMounted, ref } from "vue";
import CurrentAdmin from "@/components/manageAdmins/CurrentAdmin.vue";
import { addAdministrator, deleteAdministrator, passwordResetLinkToAdministrator, getAllAdmins } from "@/services/superAdminService.js";
import * as rules from "@vee-validate/rules";
import { useField, useForm } from "vee-validate";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const { t } = useI18n();

const admins = ref([]);
const errorMsg = ref("");
const successMsg = ref("");

const { handleSubmit, isSubmitting } = useForm({
  initialValues: {
    email: '',
    username: ''
  }
});
const { value: addAdminEmail, errorMessage, validate } = useField("email", (value) => {
  if (!value) return t("login.emailRequired");
  if (!rules.email(value)) return t("login.emailError");
  return true;
});
const { value: addAdminUsername } = useField("username");

const addAdminModal = ref(false);

const showAddAdminModal = () => {
  addAdminModal.value = !addAdminModal.value;
};

const fetchAdmins = async () => {
  try {
    const response = await getAllAdmins();
    if (response.success) {
      admins.value = response.data;
      errorMsg.value = "";
    } else {
      errorMsg.value = response.error || t("manage-admins.fetch-failed");
    }
  } catch (error) {
    console.error("Error fetching admins:", error);
    errorMsg.value = t("manage-admins.fetch-failed");
  }
};

const addAdmin = handleSubmit(async (values) => {
  try {
    const response = await addAdministrator(values.email, values.username);
    if (response.success) {
      successMsg.value = t("manage-admins.admin-added");
      errorMsg.value = "";
      addAdminModal.value = false;
      await fetchAdmins();

      setTimeout(() => {
        successMsg.value = "";
      }, 3000);
    } else {
      errorMsg.value = response.error || t("manage-admins.add-failed");
    }
  } catch (error) {
    console.error("Error adding admin:", error);
    errorMsg.value = t("manage-admins.add-failed");
  }
});

const removeAdmin = async (adminId) => {
    try {
      const response = await deleteAdministrator(adminId);
      if (response.success) {
        successMsg.value = t("manage-admins.admin-removed");
        await fetchAdmins();

        setTimeout(() => {
          successMsg.value = "";
        }, 3000);
      } else {
        errorMsg.value = response.error || t("manage-admins.remove-failed");
      }
    } catch (error) {
      console.error("Error removing admin:", error);
      errorMsg.value = t("manage-admins.remove-failed");
    }
};

const sendPasswordResetEmail = async (adminId) => {
  try {
    const response = await passwordResetLinkToAdministrator(adminId);
    if (response.success) {
      successMsg.value = t("manage-admins.password-reset-email-sent");

      setTimeout(() => {
        successMsg.value = "";
      }, 3000);
    } else {
      errorMsg.value = response.error || t("manage-admins.reset-failed");
    }
  } catch (error) {
    console.error("Error sending password reset:", error);
    errorMsg.value = t("manage-admins.reset-failed");
  }
};

onMounted(async () => {
  await fetchAdmins();
});
</script>

<template>
  <div class="flex flex-col p-4 w-full">
    <div class="flex flex-col mb-4">
      <h1 class="text-2xl font-bold text-kf-blue">{{ t("manage-admins.title") }}</h1>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMsg" class="text-kf-green text-center mb-4" role="alert">
      {{ successMsg }}
    </div>
    <div v-if="errorMsg" class="text-kf-red text-center mb-4" role="alert">
      {{ errorMsg }}
    </div>

    <div class="flex flex-col gap-4 w-full">
      <!-- Add New Admin Button -->
      <div class="flex justify-center">
        <button
            id="add-admin"
            @click="showAddAdminModal"
            class="bg-kf-blue text-kf-white py-2 px-4 rounded cursor-pointer hover:bg-kf-link-blue transition"
        >
          {{ t("manage-admins.add-admin") }}
        </button>
      </div>

      <!-- Add Admin Modal -->
      <div v-if="addAdminModal" class="fixed inset-0 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-md relative border border-kf-blue">
          <XMarkIcon
              class="absolute top-2 right-2 cursor-pointer size-6 rounded-full text-kf-red hover:bg-kf-grey"
              @click="showAddAdminModal"
          />

          <h2 class="text-2xl text-kf-blue font-bold mb-4">{{ t("manage-admins.add-admin") }}</h2>
          <form @submit.prevent="addAdmin" class="flex flex-col gap-4">
            <!-- Email Field -->
            <div>
              <label for="addAdminEmail" class="block text-sm font-medium mb-1 text-kf-blue">
                {{ t("login.email") }}
              </label>
              <input
                  id="addAdminEmail"
                  type="email"
                  v-model="addAdminEmail"
                  @input="validate"
                  class="w-full p-2 border border-kf-blue rounded focus:outline-none focus:ring-1 focus:ring-kf-blue"
                  :class="{ 'border-red-500': errorMessage }"
                  placeholder="Enter admin email address"
              />
              <span v-if="errorMessage" class="text-kf-red text-sm mt-1 block">{{ errorMessage }}</span>
            </div>

            <!-- Username Field -->
            <div>
              <label for="addAdminUsername" class="block text-sm font-medium mb-1 text-kf-blue">
                {{ t("manage-admins.username") }}
              </label>
              <input
                  id="addAdminUsername"
                  type="text"
                  v-model="addAdminUsername"
                  class="w-full p-2 border border-kf-blue rounded focus:outline-none focus:ring-1 focus:ring-kf-blue"
                  :class="{ 'border-red-500': addAdminUsernameError }"
                  placeholder="Enter admin username"
              />
              <span v-if="addAdminUsernameError" class="text-kf-red text-sm mt-1 block">{{ addAdminUsernameError }}</span>
            </div>

            <!-- Add button -->
            <div class="flex justify-end gap-2">
              <button
                  type="submit"
                  :disabled="isSubmitting || errorMessage || addAdminUsernameError"
                  class="bg-kf-red text-kf-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer hover:bg-kf-white-contrast-8"
              >
                {{ t("manage-admins.add") }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Admin List -->
      <div class="w-full justify-center items-center">
        <h2 class="text-xl font-semibold text-kf-blue mb-1">{{ t("manage-admins.current-admins") }}</h2>
        <div v-if="admins.length === 0" class="text-gray-500">
          {{ t("manage-admins.no-admins") }}
        </div>
        <CurrentAdmin
            v-for="admin in admins"
            :key="admin.id"
            :admin="admin"
            @removeAdmin="removeAdmin"
            @sendPasswordResetEmail="sendPasswordResetEmail"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
