<script setup>
import {computed, onMounted, ref, watch} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import MemberCard from "@/components/myHome/MemberCard.vue";
import ConfirmationModal from "@/components/myHome/ConfirmationModal.vue";
import InviteModal from "@/components/myHome/InviteModal.vue";
import {XMarkIcon} from "@heroicons/vue/24/solid/index.js";
import {useUserStore} from "@/stores/userStore.js";
import {getInviteCode, requestHouseholds} from "@/services/householdService.js";


const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const members = ref([]);
const isAdmin = ref(true);
const selectedMember = ref(null);
const showInviteModal = ref(false);
const inviteLink = ref("");
const inviteCode = ref("");
const householdId = computed(() => userStore.householdId[0]?.id || null); // Access the first household ID

// Watch userStore.household.members for changes and update members ref
watch(
    () => userStore.householdId[0]?.members,
    (newMembers) => {
      if (newMembers) {
        // Map members to objects with id and name
        members.value = newMembers.map((name, index) => ({
          id: index + 1, // Temporary ID (replace with actual ID if available)
          name,
        }));
      } else {
        members.value = [];
      }
    },
    { immediate: true }
);

const openInviteModal = async () => {
  console.log("Opening invite modal");
  inviteCode.value = await getInviteCode(householdId.value)
  console.log("Invite code:", inviteCode);
  inviteLink.value = `${window.location.origin}/household/options/?inviteCode=${inviteCode.value}`;
  showInviteModal.value = true;
};

const closeInviteModal = () => {
  showInviteModal.value = false;
  inviteLink.value = "";
  householdId.value = "";
};

const confirmDelete = (member) => {
  selectedMember.value = member;
};

const closeModal = () => {
  selectedMember.value = null;
};

const removeMember = () => {
  if (selectedMember.value) {
    members.value = members.value.filter((m) => m.id !== selectedMember.value.id);
    closeModal();
  }
};

const leaveHousehold = () => {
  alert(t("household.leaveHousehold"));
  router.push("/");
  emit("close");
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 ">
  <div
      class="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg shadow-lg w-1/2 max-h-[80vh] relative border border-black">
      <!-- Header -->
      <div class="mb-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">{{ t("household.title") }}</h1>
        <div class="flex gap-2">
          <XMarkIcon class="absolute top-4 right-4 w-8 h-8 cursor-pointer text-red-500"
                     @click="$emit('close')"/>
        </div>
      </div>

      <!-- Members List -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MemberCard
            v-for="member in members"
            :key="member.id"
            :member="member"
            :is-admin="isAdmin"
            @delete="confirmDelete"
        />
      </div>

      <!-- Confirmation Modal -->
      <ConfirmationModal
          v-if="selectedMember"
          :member="selectedMember"
          :is-admin="isAdmin"
          @close="closeModal"
          @confirm="removeMember"
      />

      <!-- Invite Modal -->
      <InviteModal
          v-if="showInviteModal"
          :invite-link="inviteLink"
          :invite-code="inviteCode"
          @close="closeInviteModal"
      />

      <!-- Leave Household And Invite Button -->
      <div class="mt-6 flex justify-start gap-4">
        <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            @click="openInviteModal"
        >
          {{ t("household.generateInvite") }}
        </button>

        <button
            v-if="!isAdmin"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            @click="leaveHousehold"
        >
          {{ t("household.leaveHousehold") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
