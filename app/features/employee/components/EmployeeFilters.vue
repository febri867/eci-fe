<script setup lang="ts">
import { ref } from 'vue'
import type { EmployeeFilters } from '../types/employee.types'

const emit = defineEmits<{
  apply: [filters: EmployeeFilters]
}>()

const search = ref('')
const grade = ref('')
const minAge = ref<number | undefined>()
const maxAge = ref<number | undefined>()
const province = ref('')
const city = ref('')
const district = ref('')

const submitFilters = () => {
  emit('apply', {
    search: search.value.trim() || undefined,
    grade: grade.value || undefined,
    minAge: minAge.value,
    maxAge: maxAge.value,
    province: province.value || undefined,
    city: city.value || undefined,
    district: district.value || undefined,
  })
}

const resetFilters = () => {
  search.value = ''
  grade.value = ''
  minAge.value = undefined
  maxAge.value = undefined
  province.value = ''
  city.value = ''
  district.value = ''

  submitFilters()
}
</script>

<template>
  <div class="mb-5 rounded-xl border border-slate-200 bg-white p-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Search</label>
        <input
            v-model="search"
            type="search"
            placeholder="Employee name..."
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Grade</label>
        <select
            v-model="grade"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">All Grades</option>
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
          <option value="C">Grade C</option>
          <option value="D">Grade D</option>
        </select>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Minimum Age</label>
        <input
            v-model.number="minAge"
            type="number"
            min="0"
            placeholder="Minimum age"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Maximum Age</label>
        <input
            v-model.number="maxAge"
            type="number"
            min="0"
            placeholder="Maximum age"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Province</label>
        <input
            v-model="province"
            type="text"
            placeholder="Province"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">City</label>
        <input
            v-model="city"
            type="text"
            placeholder="City"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">District</label>
        <input
            v-model="district"
            type="text"
            placeholder="District"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
    </div>

    <div class="mt-4 flex justify-end gap-2">
      <button
          type="button"
          class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
          @click="resetFilters"
      >
        Reset
      </button>

      <button
          type="button"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          @click="submitFilters"
      >
        Apply Filters
      </button>
    </div>
  </div>
</template>