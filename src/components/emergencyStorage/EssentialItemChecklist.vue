<script setup>
import { ref, onMounted, computed } from 'vue';
import { getEssentialItems } from '@/services/essentialItemService';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const essentials = ref([]); // Liste av lister
const props = defineProps({
  householdId: {
    type: [String, Number],
    required: true
  }
});

const groupedItems = {
  'mat-vann': [['grill', 'kokeapparat', 'stormkjøkken'], 'gassbeholder', 'brennstoff'],
  'varme-lys': ['varme klær', 'pledd', 'dyne', 'sovepose', 'fyrstikker', 'stearinlys', 'ved', 'gassovn', 'parafinovn', 'lommelykt', 'hodelykt'],
  'informasjon-kommunikasjon': ['dab-radio', 'batterier', 'batteribank'],
  'medisin-hygiene': ['førstehjelp', 'jodtabletter', 'legemidler', 'våtservietter', 'håndsprit', 'bleier', 'toalettpapir', 'bind', 'tamponger']
};

const groupKeyToLocaleKey = {
  'mat-vann': 'food',
  'varme-lys': 'heat',
  'informasjon-kommunikasjon': 'info',
  'medisin-hygiene': 'health'
};

const nameAliases = {
  'wet wipes': 'våtservietter',
  'hand sanitizer': 'håndsprit',
  'diapers': 'bleier',
  'toilet paper': 'toalettpapir',
  'sanitary pads': 'bind',
  'tampons': 'tamponger',
  'first aid': 'førstehjelp',
  'iodine tablets': 'jodtabletter',
  'medication': 'legemidler',
  'matches': 'fyrstikker',
  'candles': 'stearinlys',
  'firewood': 'ved',
  'gas heater': 'gassovn',
  'paraffin heater': 'parafinovn',
  'flashlight': 'lommelykt',
  'headlamp': 'hodelykt',
  'dab radio': 'dab-radio',
  'batteries': 'batterier',
  'power bank': 'batteribank',
  'camping stove': 'kokeapparat',
  'storm kitchen': 'stormkjøkken',
  'gas canister': 'gassbeholder',
  'fuel': 'brennstoff',
  'warm clothes': 'varme klær',
  'blanket': 'pledd',
  'duvet': 'dyne',
  'sleeping bag': 'sovepose'
};

function normalizeName(name) {
  return nameAliases[name.toLowerCase()] || name.toLowerCase();
}


const translatedSectionTitles = computed(() => {
  return Object.fromEntries(
    Object.entries(groupKeyToLocaleKey).map(([key, value]) => [key, t(`essential-items.sections.${value}`)])
  );
});

function getStatus(itemOrGroup) {
  const currentEssentials = essentials.value;

  // Hjelpefunksjon for å sjekke om et navn (eller alias) er til stede
  const isPresent = (name) => {
    const normalized = name.toLowerCase();
    const alias = Object.entries(nameAliases).find(([, norsk]) => norsk === normalized)?.[0];

    return currentEssentials.some(e =>
      e.name.toLowerCase() === normalized && e.present ||
      (alias && e.name.toLowerCase() === alias.toLowerCase() && e.present)
    );
  };

  if (Array.isArray(itemOrGroup)) {
    return itemOrGroup.some(name => isPresent(name));
  } else {
    return isPresent(itemOrGroup);
  }
}

async function refreshEssentials() {
  try {
    essentials.value = await getEssentialItems(props.householdId); 
  } catch (e) {
  }
}

onMounted(refreshEssentials);
defineExpose({ refreshEssentials });
</script>



<template>
  <div class="bg-kf-white p-4 rounded-xl shadow-md w-full max-w-xl">
    <h2 class="text-xl font-bold text-kf-blue mb-4">{{ t('essential-items.title') }}</h2>

    <div v-for="(items, groupKey) in groupedItems" :key="groupKey" class="mb-4">
      <h3 class="text-md font-semibold text-kf-blue mb-2">{{ translatedSectionTitles[groupKey] }}</h3>
      <ul class="space-y-1">
        <li
          v-for="item in items"
          :key="Array.isArray(item) ? item.join(',') : item"
          class="flex items-center gap-2"
        >
          <component
            :is="getStatus(item) ? CheckCircleIcon : XCircleIcon"
            :class="getStatus(item) ? 'text-kf-green' : 'text-kf-red'"
            class="w-5 h-5"
          />
          <span class="text-sm">
            <template v-if="Array.isArray(item)">
              {{ item.map(i => t(`essential-items.items.${normalizeName(i)}`)).join(', ') }}
            </template>
            <template v-else>
              {{ t(`essential-items.items.${normalizeName(item)}`) }}
            </template>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>


<style scoped>
</style>
