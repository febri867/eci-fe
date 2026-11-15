<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useEmployees } from '~/features/employee/composables/useEmployees.ts'
import EmployeeFilters from "~/features/employee/components/EmployeeFilters.vue";
import { employeeService } from '~/features/employee/services/employee.service'
import {useSnackbar} from "~/compasable/useSnackbar.ts";

definePageMeta({
  middleware: 'auth',
})

const {
  employees,
  isLoading,
  isLoadingMore,
  hasMore,
  errorMessage,
  loadEmployees,
  loadMore,
  applyFilters,
} = useEmployees()

const search = ref('')
const observerTarget = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

const handleSearch = () => {
  applyFilters({
    search: search.value.trim(),
  })
}

onMounted(async () => {
  await loadEmployees(true)

  observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore.value) {
          loadMore()
        }
      },
      { threshold: 0.1 },
  )

  if (observerTarget.value) {
    observer.observe(observerTarget.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

const snackbar = useSnackbar()
const deletingId = ref<string | null>(null)

const handleDelete = async (id: string, name: string) => {
  if (!confirm(`Are you sure you want to delete ${name}?`)) return

  deletingId.value = id

  try {
    await employeeService.delete(id)
    snackbar.show('Employee deleted successfully', 'success')
    await loadEmployees(true)
  } catch (error: any) {
    snackbar.show(
        error.data?.message || 'Failed to delete employee',
        'error',
    )
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 p-4 sm:p-6">
    <div class="mx-auto max-w-6xl">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">
            Employee Management
          </h1>
          <p class="mt-1 text-sm text-slate-500">
            Manage employee information
          </p>
        </div>

        <NuxtLink
            to="/dashboard"
            class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
        >
          Dashboard
        </NuxtLink>
      </div>
      <div class="mb-5 flex flex-col gap-3 sm:flex-row">
        <NuxtLink
            to="/employees/create"
            class="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
        >
          + Add Employee
        </NuxtLink>
      </div>
      <EmployeeFilters @apply="applyFilters" />
      <div
          v-if="errorMessage"
          class="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600"
      >
        {{ errorMessage }}
      </div>
      <div
          v-if="isLoading"
          class="rounded-xl bg-white p-8 text-center text-slate-500"
      >
        Loading employees...
      </div>
      <div
          v-else-if="employees.length === 0"
          class="rounded-xl bg-white p-10 text-center"
      >
        <p class="font-medium text-slate-700">No employees found</p>
        <p class="mt-1 text-sm text-slate-500">
          Try another search keyword.
        </p>
      </div>
      <div v-else class="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-100 text-slate-600">
            <tr>
              <th class="px-5 py-4 font-semibold">Name</th>
              <th class="px-5 py-4 font-semibold">Position</th>
              <th class="px-5 py-4 font-semibold">Grade</th>
              <th class="px-5 py-4 font-semibold">City</th>
              <th class="px-5 py-4 font-semibold">Salary</th>
              <th class="px-5 py-4 font-semibold text-right">Actions</th>
            </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
            <tr
                v-for="employee in employees"
                :key="employee.id"
                class="hover:bg-slate-50"
            >
              <td class="px-5 py-4 font-medium text-slate-900">
                {{ employee.name }}
              </td>
              <td class="px-5 py-4 text-slate-600">
                {{ employee.position }}
              </td>
              <td class="px-5 py-4">
                  <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {{ employee.grade }}
                  </span>
              </td>
              <td class="px-5 py-4 text-slate-600">
                {{ employee.city }}
              </td>
              <td class="px-5 py-4 text-slate-600">
                {{ employee.salary.toLocaleString('id-ID') }}
              </td>
              <td class="px-5 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <NuxtLink
                      :to="`/employees/${employee.id}`"
                      class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Edit
                  </NuxtLink>

                  <button
                      :disabled="deletingId === employee.id"
                      class="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                      @click="handleDelete(employee.id, employee.name)"
                  >
                    {{ deletingId === employee.id ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="divide-y divide-slate-100 md:hidden">
          <div
              v-for="employee in employees"
              :key="employee.id"
              class="p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-slate-900">
                  {{ employee.name }}
                </p>
                <p class="mt-1 text-sm text-slate-500">
                  {{ employee.position }}
                </p>
              </div>

              <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {{ employee.grade }}
              </span>
            </div>

            <div class="mt-3 flex justify-between text-sm">
              <span class="text-slate-500">{{ employee.city }}</span>
              <span class="font-medium text-slate-700">
                Rp {{ employee.salary.toLocaleString('id-ID') }}
              </span>
            </div>

            <div class="mt-4 flex gap-2">
              <NuxtLink
                  :to="`/employees/${employee.id}`"
                  class="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-center text-xs font-semibold text-blue-700"
              >
                Edit
              </NuxtLink>

              <button
                  :disabled="deletingId === employee.id"
                  class="flex-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
                  @click="handleDelete(employee.id, employee.name)"
              >
                {{ deletingId === employee.id ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
          ref="observerTarget"
          class="py-6 text-center text-sm text-slate-500"
      >
        <span v-if="isLoadingMore">Loading more employees...</span>
        <span v-else-if="!hasMore && employees.length > 0">
          All employees loaded
        </span>
      </div>
    </div>
  </main>
</template>