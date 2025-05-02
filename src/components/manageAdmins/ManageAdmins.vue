<script setup>
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import CurrentAdmin from "@/components/manageAdmins/CurrentAdmin.vue";
import { addAdministrator, deleteAdministrator, passwordResetLinkToAdministrator, getAllAdmins } from "@/services/superAdminService.js";
import * as rules from "@vee-validate/rules";
import { useField, useForm } from "vee-validate";

const { t } = useI18n();

const admins = ref([
  // Sample data for testing
  { id: 1, email: "test@mail.no" },
  { id: 2, email: "idnewoifn@ciowjnv.cewc" },
]);

const { handleSubmit, isSubmitting } = useForm();
const { value: addAdminEmail, errorMessage, validate } = useField("email", (value) => {
  if (!value) return t("login.emailRequired");
  if (!rules.email(value)) return t("login.emailError");
  return true;
});


const addAdminModal = ref(false);

const showAddAdminModal = () => {
  addAdminModal.value = !addAdminModal.value;
};

const fetchAdmins = async () => {
  try {
    const response = await getAllAdmins();
    admins.value = response.data;
  } catch (error) {
    console.error("Error fetching admins:", error);
  }
};

const addAdmin = handleSubmit(async (values) => {
  try {
    await addAdministrator(values.email);
    addAdminModal.value = false;
    addAdminEmail.value = "";
  } catch (error) {
    console.error("Error adding admin:", error);
  }
});

const removeAdmin = (adminId) => {
  if (confirm(t("manage-admins.remove-admin-confirm"))) {
    deleteAdministrator(adminId)
      .then(() => {
        fetchAdmins();
      })
      .catch((error) => {
        console.error("Error removing admin:", error);
      });
  }
};

const sendPasswordResetEmail = (adminId) => {
  passwordResetLinkToAdministrator(adminId)
    .then(() => {
      alert(t("manage-admins.password-reset-email-sent"));
    })
    .catch((error) => {
      console.error("Error sending password reset email:", error);
    });
};
</script>

<template>
  <div class="flex flex-col p-4 w-full">
    <div class="flex flex-col mb-4">
      <h1 class="text-2xl font-bold text-kf-blue">{{ t("manage-admins.title") }}</h1>
    </div>
    <div class="flex flex-col gap-4 w-full">

      <!-- Add New Admin -->
      <div>
        <button
            id="add-admin"
            @click="showAddAdminModal"
            class="bg-kf-blue text-kf-white border-kf-blue border-1 rounded-md p-2 cursor-pointer
        hover:bg-kf-link-blue hover:shadow-md
        active:bg-kf-blue active:scale-95
        focus:outline-none focus:ring-1 focus:ring-kf-blue
        transition"
        >
          {{ t("manage-admins.add-admin") }}
        </button>

        <div v-if="addAdminModal" class="p-4">
          <form @submit="addAdmin" class="grid grid-cols-8 grid-rows-3 p-1 gap-1 justify-center items-center">
            <label class="flex flex-row row-start-1 col-start-3 col-span-4 items-center gap-2">
              {{ t("manage-admins.add-admin-desc") }}
            </label>
            <div class="flex flex-col row-start-2 col-start-3 col-span-3 items-center gap-2">
              <input
                  id="addAdminEmail"
                  type="email"
                  v-model="addAdminEmail"
                  @input="validate"
                  class="border border-kf-blue rounded-md p-1 w-full"
                  :class="{ 'border-red-500': errorMessage }"
              />
            </div>
            <span v-if="errorMessage" class="text-red-500 text-sm col-start-3 row-start-3 col-span-3">{{ errorMessage }}</span>
            <button
                type="submit"
                :disabled="isSubmitting || errorMessage"
                class="bg-kf-white-contrast-4 border-kf-blue border-1 rounded-md p-1 cursor-pointer
            hover:bg-kf-link-blue hover:text-white hover:shadow-md
            active:bg-kf-blue active:scale-95
            focus:outline-none focus:ring-1 focus:ring-kf-blue
            transition col-start-6 row-start-2 align-top"
                :class="{ 'opacity-50 cursor-not-allowed': isSubmitting || errorMessage }"
            >
              {{ t("manage-admins.add") }}
            </button>
          </form>
        </div>
      </div>

      <!-- Admin List -->
      <div class="w-full justify-center items-center">
        <h2 class="text-xl font-semibold text-kf-blue mb-1">{{ t("manage-admins.current-admins") }}</h2>
        <CurrentAdmin
            v-for="(admin, index) in admins"
            :key="index"
            :admin="admin"
            @removeAdmin="removeAdmin"
            @sendPasswordResetEmail="sendPasswordResetEmail"/>
      </div>
    </div>
  </div>
</template>