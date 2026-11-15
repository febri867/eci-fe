<script setup lang="ts">
import type { EmployeeFormData } from '~/features/employee/schemas/employee.schema'
import { employeeService } from '~/features/employee/services/employee.service'
import {useSnackbar} from "~/compasable/useSnackbar.ts";
import EmployeeForm from "~/features/employee/components/EmployeeForm.vue";

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const snackbar = useSnackbar()

const employee = ref<EmployeeFormData | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')

const employeeId = route.params.id as string

const fetchEmployee = async () => {
  try {
    const response = await employeeService.getById(employeeId)

    employee.value = {
      name: response.name,
      position: response.position,
      grade: response.grade,
      salary: response.salary,
      address: response.address,
      province: response.province,
      city: response.city,
      district: response.district,
      birthDate: response.birthDate.slice(0, 10),
    }
  } catch (error: any) {
    errorMessage.value =
        error.data?.message || 'Failed to load employee'
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async (payload: EmployeeFormData) => {
  isSaving.value = true

  try {
    await employeeService.update(employeeId, payload)

    snackbar.show('Employee updated successfully', 'success')
    await router.push('/employees')
  } catch (error: any) {
    snackbar.show(
        error.data?.message || 'Failed to update employee',
        'error',
    )
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchEmployee)
</script>

<template>
  <main class="min-h-screen bg-slate-50 p-4 sm:p-6">
    <div class="mx-auto max-w-4xl">
      <NuxtLink
          to="/employees"
          class="text-sm font-medium text-blue-600"
      >
        ← Back to Employees
      </NuxtLink>

      <h1 class="mt-3 text-2xl font-bold text-slate-900">
        Edit Employee
      </h1>

      <p class="mt-1 mb-6 text-sm text-slate-500">
        Update employee information.
      </p>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div v-if="isLoading" class="py-10 text-center text-slate-500">
          Loading employee...
        </div>

        <div v-else-if="errorMessage" class="py-10 text-center text-red-500">
          {{ errorMessage }}
        </div>

        <EmployeeForm
            v-else-if="employee"
            :initial-data="employee"
            :loading="isSaving"
            @submit="handleSubmit"
            @cancel="router.push('/employees')"
        />
      </div>
    </div>
  </main>
</template>