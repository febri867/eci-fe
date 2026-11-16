
<script setup lang="ts">
import type { HistoryFilters } from '../types/history.types'

const emit = defineEmits<{
  apply: [filters: HistoryFilters]
}>()

const filters = reactive<HistoryFilters>({
  action: '',
  actorId: '',
  startDate: '',
  endDate: '',
})

const applyFilters = () => {
  emit('apply', { ...filters })
}

const resetFilters = () => {
  filters.action = ''
  filters.actorId = ''
  filters.startDate = ''
  filters.endDate = ''
  applyFilters()
}
</script>

<template>
  <section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-base font-semibold text-gray-900">
        Filter Activity
      </h2>

      <button
          type="button"
          class="text-sm font-medium text-gray-500 hover:text-gray-900"
          @click="resetFilters"
      >
        Reset
      </button>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">
          Action
        </label>

        <select
            v-model="filters.action"
            class="form-select w-full"
        >
          <option value="">All Actions</option>
          <option value="CREATE_EMPLOYEE">Create Employee</option>
          <option value="UPDATE_EMPLOYEE">Update Employee</option>
          <option value="DELETE_EMPLOYEE">Delete Employee</option>
        </select>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">
          Actor ID
        </label>

        <input
            v-model="filters.actorId"
            type="text"
            placeholder="Search by user ID"
            class="form-input w-full"
        />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">
          Start Date
        </label>

        <input
            v-model="filters.startDate"
            type="date"
            class="form-input w-full"
        />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">
          End Date
        </label>

        <input
            v-model="filters.endDate"
            type="date"
            :min="filters.startDate || undefined"
            class="form-input w-full"
        />
      </div>
    </div>

    <div class="mt-4 flex justify-end">
      <button
          type="button"
          class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          @click="applyFilters"
      >
        Apply Filter
      </button>
    </div>
  </section>
</template>
