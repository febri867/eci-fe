<script setup lang="ts">
import type { EmployeeFormData } from '~/features/employee/schemas/employee.schema'
import { employeeService } from '~/features/employee/services/employee.service'
import {useSnackbar} from "~/compasable/useSnackbar.ts";
import EmployeeForm from "~/features/employee/components/EmployeeForm.vue";

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const isLoading = ref(false)
const snackbar = useSnackbar()

const handleSubmit = async (payload: EmployeeFormData) => {
  isLoading.value = true

  try {
    await employeeService.create(payload)

    snackbar.show('Employee created successfully', 'success')
    await router.push('/employees')
  } catch (error: any) {
    snackbar.show(
        error.data?.message || 'Failed to create employee',
        'error',
    )
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  router.push('/employees')
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 p-4 sm:p-6">
    <div class="mx-auto max-w-4xl">
      <div class="mb-6">
        <NuxtLink
            to="/employees"
            class="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Employees
        </NuxtLink>

        <h1 class="mt-3 text-2xl font-bold text-slate-900">
          Add New Employee
        </h1>

        <p class="mt-1 text-sm text-slate-500">
          Enter employee information below.
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <EmployeeForm
            :loading="isLoading"
            @submit="handleSubmit"
            @cancel="handleCancel"
        />
      </div>
    </div>
  </main>
</template>