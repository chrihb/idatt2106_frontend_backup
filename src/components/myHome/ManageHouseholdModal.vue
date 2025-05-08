<script setup>
import {onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import MemberCard from "@/components/myHome/MemberCard.vue";
import ConfirmationModal from "@/components/myHome/ConfirmationModal.vue";
import InviteModal from "@/components/myHome/InviteModal.vue";
import {XMarkIcon} from "@heroicons/vue/24/solid/index.js";
import {useUserStore} from "@/stores/userStore.js";
import {
  getInviteCode,
  getPrimaryHousehold,
  kickUserFromHousehold,
  leaveHouseholdService,
  setPrimaryHousehold,
  verifyIsAdmin
} from "@/services/householdService.js";

const {t} = useI18n();
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

const emit = defineEmits(["close", "member-removed"]);

const members = ref([]);
const isAdmin = ref(false);
const isPrimary = ref(false);
const selectedMember = ref(null);
const showInviteModal = ref(false);
const inviteLink = ref("");
const inviteCode = ref("");

watch(
    () => props.household,
    (newHousehold) => {
      if (newHousehold && newHousehold.members) {
        members.value = [...newHousehold.members];
      }
    },
    {immediate: true, deep: true}
);
onMounted(async () => {
  await checkAdminStatus();
  await checkIfPrimary();
});

const checkAdminStatus = async () => {
  if (props.household.id) {
    const isAdminResult = await verifyIsAdmin(props.household.id);
    isAdmin.value = isAdminResult || false;
  } else {
    isAdmin.value = false;
  }
};

const checkIfPrimary = async () => {
  try {
    const primary = await getPrimaryHousehold();
    isPrimary.value = primary?.id === props.household.id;
  } catch (error) {
    console.error("Failed to verify primary household:", error);
  }
};

const openInviteModal = async () => {
  console.log("Opening invite modal");
  const code = await getInviteCode(props.household.id);
  if (code) {
    inviteCode.value = code.inviteCode || code;
    inviteLink.value = `${window.location.origin}/household/options/?inviteCode=${inviteCode.value}`;
    showInviteModal.value = true;
  } else {
    console.error("Failed to get invite code");
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
  if (!selectedMember.value) return;

  try {
    const response = await kickUserFromHousehold(props.household.id, selectedMember.value.id);
    console.log("Removed member:", response);

    if (response) {
      const removedMemberId = selectedMember.value.id;

      selectedMember.value = null;
      await userStore.fetchHouseholds();
      const householdStillExists = userStore.householdId.some(h => h.id === props.household.id);

      console.log("Household still exists:", householdStillExists);

      if (!householdStillExists) {
        console.log("Household no longer exists, redirecting to front page");
        await router.push("/");
        emit("close"); // Close the modal only if the household is inaccessible
      } else {
        members.value = members.value.filter(m => m.id !== removedMemberId);
        emit("member-removed");
      }
    } else {
      console.error("Failed to remove member");
    }
  } catch (error) {
    console.error("Error removing member:", error);
  }
};
const leaveHousehold = async () => {
  try {
    const response = await leaveHouseholdService(props.household.id);

    console.log("Left household:", response);
    if (response) {
      await userStore.fetchHouseholds();

      await router.push("/");

      console.log("Left household successfully");
      emit("close");
    } else {
      console.error("Failed to leave household");
    }
  } catch (error) {
    console.error("Error leaving household:", error);
  }
};

const setAsPrimary = async () => {
  try {
    const success = await setPrimaryHousehold(props.household.id);
    if (success) {
      await checkIfPrimary();
    } else {
      console.error("Failed to set as primary");
    }
  } catch (error) {
    console.error("Error setting household as primary:", error);
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
    <div
        class="bg-kf-white p-6 rounded-lg shadow-lg relative border border-kf-blue max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <XMarkIcon class="absolute top-2 right-2 cursor-pointer size-6 rounded-full hover:bg-kf-grey text-kf-blue"
                 @click="$emit('close')"/>

      <h1 class="text-kf-blue font-bold text-2xl mb-4">{{ t("household.title") }}</h1>

      <!-- Members List -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MemberCard
            v-for="member in members"
            :key="member.id"
            :is-admin="isAdmin"
            :is.current-user="member.name === userStore.$id"
            :member="member"
            @delete="confirmDelete"
        />
      </div>

      <!-- Confirmation Modal -->
      <ConfirmationModal
          v-if="selectedMember"
          :is-admin="isAdmin"
          :member="selectedMember"
          @close="closeModal"
          @confirm="removeMember"
      />

      <!-- Invite Modal -->
      <InviteModal
          v-if="showInviteModal"
          :invite-code="inviteCode"
          :invite-link="inviteLink"
          @close="closeInviteModal"
      />

      <!-- Action Buttons -->
      <div class="mt-8 flex justify-between">
        <button
            class="bg-kf-green cursor-pointer text-white px-4 py-2 rounded hover:bg-kf-white-contrast-8"
            @click="openInviteModal"
        >
          {{ t("household.generateInvite") }}
        </button>

        <button
            :disabled="isPrimary"
            class="bg-kf-link-blue text-white px-4 py-2 rounded hover:bg-kf-white-contrast-8 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="setAsPrimary"
        >
          {{ t("household.set-as-primary") }}
        </button>

        <button
            v-if="!isAdmin"
            class="bg-kf-red cursor-pointer text-white px-4 py-2 rounded hover:bg-kf-white-contrast-8"
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