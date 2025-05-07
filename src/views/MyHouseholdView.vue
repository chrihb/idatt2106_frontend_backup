<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import MemberCard from "@/components/myHome/MemberCard.vue";
import ConfirmationModal from "@/components/myHome/ConfirmationModal.vue";
import InviteModal from "@/components/myHome/InviteModal.vue";
import { XMarkIcon } from "@heroicons/vue/24/solid/index.js";
import { useUserStore } from "@/stores/userStore.js";
import {getInviteCode, leaveHouseholdService, verifyIsAdmin} from "@/services/householdService.js";
import { kickUserFromHousehold } from "@/services/householdService.js";

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  household: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const members = ref([]);
const isAdmin = ref(false);
const selectedMember = ref(null);
const showInviteModal = ref(false);
const inviteLink = ref("");
const inviteCode = ref("");

watch(
    () => props.household.members,
    (newMembers) => {
      members.value = newMembers || [];
    },
    { immediate: true }
);

onMounted(async () => {
  await checkAdminStatus();
});

const checkAdminStatus = async () => {
  if (props.household.id) {
    const isAdminResult = await verifyIsAdmin(props.household.id);
    isAdmin.value = isAdminResult || false;
  } else {
    isAdmin.value = false;
  }
};

const openInviteModal = async () => {
  console.log("Opening invite modal");
  const code = await getInviteCode(props.household.id);
  if (code) {
    inviteCode.value = code.inviteCode || code; // Adjust based on getInviteCode response structure
    inviteLink.value = `${window.location.origin}/household/options/?inviteCode=${inviteCode.value}`;
    showInviteModal.value = true;
  } else {
    console.error("Failed to get invite code");
    // Optionally show an error to the user
  }
};

const closeInviteModal = () => {
  showInviteModal.value = false;
  inviteLink.value = "";
};

const confirmDelete = (member) => {
  selectedMember.value = member;
};

const closeModal = () => {
  selectedMember.value = null;
};

const removeMember = async () => {
  if (selectedMember.value) {
    try {
      const response = await kickUserFromHousehold(props.household.id, selectedMember.value.id);
      if (response) {
        members.value = members.value.filter(member => member.id !== selectedMember.value.id);
        closeModal();

        // First update the households data
        await userStore.fetchHouseholds();

        // Now decide where to redirect based on whether there are any households left
        if (userStore.householdId.length === 0) {
          await router.push("/household/options");
        } else {
          await router.push("/household/list");
        }

        console.log("Member removed successfully");
      } else {
        console.error("Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  }
};
const leaveHousehold = async () => {
  try {
    const response = await leaveHouseholdService(props.household.id);
    if (response) {
      await userStore.fetchHouseholds();

      // Check if any households remain after leaving
      if (userStore.householdId.length === 0) {
        await router.push("/household/options");
      } else {
        await router.push("/household/list");
      }

      console.log("Left household successfully");
      emit("close");
    } else {
      console.error("Failed to leave household");
    }
  } catch (error) {
    console.error("Error leaving household:", error);
  }
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
            :is.current-user="member.name === userStore.$id"
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
