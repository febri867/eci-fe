<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { EmployeeFormData } from '../schemas/employee.schema'
import { employeeSchema } from '../schemas/employee.schema'
import { regionService } from '../services/region.service'
import type { Region } from '../types/region.types'

const props = defineProps<{
  initialData?: Partial<EmployeeFormData>
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: EmployeeFormData]
  cancel: []
}>()

const form = reactive<EmployeeFormData>({
  name: props.initialData?.name ?? '',
  position: props.initialData?.position ?? '',
  grade: props.initialData?.grade ?? '',
  salary: props.initialData?.salary ?? 0,
  address: props.initialData?.address ?? '',
  province: props.initialData?.province ?? '',
  city: props.initialData?.city ?? '',
  district: props.initialData?.district ?? '',
  birthDate: props.initialData?.birthDate ?? '',
})

const errors = ref<Record<string, string>>({})
const provinces = ref<Region[]>([])
const cities = ref<Region[]>([])
const districts = ref<Region[]>([])

const selectedProvinceId = ref('')
const selectedCityId = ref('')

const isLoadingProvinces = ref(false)
const isLoadingCities = ref(false)
const isLoadingDistricts = ref(false)
const regionError = ref('')

const formatRupiah = (value: number) => {
  if (!value) return ''

  return new Intl.NumberFormat('id-ID').format(value)
}

const salaryDisplay = ref(formatRupiah(form.salary))

const handleSalaryInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const numericValue = input.value.replace(/\D/g, '')

  form.salary = Number(numericValue) || 0
  salaryDisplay.value = numericValue
      ? formatRupiah(Number(numericValue))
      : ''

  input.value = salaryDisplay.value
}

const gradeOptions = ['A', 'B', 'C', 'D']

const loadProvinces = async () => {
  isLoadingProvinces.value = true
  regionError.value = ''

  try {
    provinces.value = await regionService.getProvinces()
  } catch {
    regionError.value = 'Gagal memuat data provinsi'
  } finally {
    isLoadingProvinces.value = false
  }
}

const handleProvinceChange = async () => {
  form.province = provinces.value.find(
      item => item.id === selectedProvinceId.value,
  )?.name ?? ''

  selectedCityId.value = ''
  form.city = ''
  form.district = ''
  cities.value = []
  districts.value = []

  if (!selectedProvinceId.value) return

  isLoadingCities.value = true

  try {
    cities.value = await regionService.getCities(selectedProvinceId.value)
  } catch {
    regionError.value = 'Gagal memuat data kota'
  } finally {
    isLoadingCities.value = false
  }
}

const handleCityChange = async () => {
  form.city = cities.value.find(
      item => item.id === selectedCityId.value,
  )?.name ?? ''

  form.district = ''
  districts.value = []

  if (!selectedCityId.value) return

  isLoadingDistricts.value = true

  try {
    districts.value = await regionService.getDistricts(selectedCityId.value)
  } catch {
    regionError.value = 'Gagal memuat data kecamatan'
  } finally {
    isLoadingDistricts.value = false
  }
}

const handleDistrictChange = (event: Event) => {
  const districtId = (event.target as HTMLSelectElement).value

  form.district = districts.value.find(
      item => item.id === districtId,
  )?.name ?? ''
}

const initializeRegions = async () => {
  await loadProvinces()

  if (!props.initialData?.province) return

  const province = provinces.value.find(
      item => item.name === props.initialData?.province,
  )

  if (!province) return

  selectedProvinceId.value = province.id
  await handleProvinceInitialization(province.id)

  const city = cities.value.find(
      item => item.name === props.initialData?.city,
  )

  if (!city) return

  selectedCityId.value = city.id
  await handleCityInitialization(city.id)

  const district = districts.value.find(
      item => item.name === props.initialData?.district,
  )

  if (district) {
    form.district = district.name
  }
}

const handleProvinceInitialization = async (provinceId: string) => {
  isLoadingCities.value = true

  try {
    cities.value = await regionService.getCities(provinceId)
  } catch {
    regionError.value = 'Gagal memuat data kota'
  } finally {
    isLoadingCities.value = false
  }
}

const handleCityInitialization = async (cityId: string) => {
  isLoadingDistricts.value = true

  try {
    districts.value = await regionService.getDistricts(cityId)
  } catch {
    regionError.value = 'Gagal memuat data kecamatan'
  } finally {
    isLoadingDistricts.value = false
  }
}

const submitForm = () => {
  const result = employeeSchema.safeParse(form)

  if (!result.success) {
    errors.value = Object.fromEntries(
        result.error.issues.map(issue => [
          String(issue.path[0]),
          issue.message,
        ]),
    )
    return
  }

  errors.value = {}
  emit('submit', result.data)
}

const requiredFields = computed(() => [
  'name',
  'position',
  'grade',
  'salary',
  'birthDate',
  'province',
  'city',
  'district',
  'address',
])

watch(() => props.initialData?.salary, (value) => {
  if (value !== undefined) {
    form.salary = value
    salaryDisplay.value = formatRupiah(value)
  }
})

onMounted(initializeRegions)
</script>

<template>
  <form class="space-y-5" @submit.prevent="submitForm">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="form-label">Full Name <span>*</span></label>
        <input v-model="form.name" type="text" required class="form-input">
        <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
      </div>

      <div>
        <label class="form-label">Position <span>*</span></label>
        <input v-model="form.position" type="text" required class="form-input">
        <p v-if="errors.position" class="form-error">{{ errors.position }}</p>
      </div>

      <div>
        <label class="form-label">Grade <span>*</span></label>
        <select v-model="form.grade" required class="form-input appearance-none pr-10">
          <option value="" disabled>Select Grade</option>
          <option v-for="grade in gradeOptions" :key="grade" :value="grade">
            Grade {{ grade }}
          </option>
        </select>
        <p v-if="errors.grade" class="form-error">{{ errors.grade }}</p>
      </div>

      <div>
        <label class="form-label">Salary <span>*</span></label>

        <div class="flex items-center overflow-hidden rounded-lg border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
    <span
        v-if="salaryDisplay"
        class="shrink-0 pl-3 text-sm font-medium text-slate-500"
    >
      Rp
    </span>

          <input
              :value="salaryDisplay"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              required
              placeholder="Enter salary"
              class="w-full min-w-0 bg-transparent px-3 py-3 text-sm outline-none"
              @input="handleSalaryInput"
          >
        </div>

        <p v-if="errors.salary" class="form-error">
          {{ errors.salary }}
        </p>
      </div>

      <div>
        <label class="form-label">Birth Date <span>*</span></label>
        <input v-model="form.birthDate" type="date" required class="form-input">
        <p v-if="errors.birthDate" class="form-error">{{ errors.birthDate }}</p>
      </div>

      <div>
        <label class="form-label">Province <span>*</span></label>
        <select
            v-model="selectedProvinceId"
            required
            class="form-input form-select"
            :disabled="isLoadingProvinces"
            @change="handleProvinceChange"
        >
          <option value="" disabled>
            {{ isLoadingProvinces ? 'Loading provinces...' : 'Select Province' }}
          </option>
          <option v-for="item in provinces" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
        <p v-if="errors.province" class="form-error">{{ errors.province }}</p>
      </div>

      <div>
        <label class="form-label">City <span>*</span></label>
        <select
            v-model="selectedCityId"
            required
            class="form-input form-select"
            :disabled="!selectedProvinceId || isLoadingCities"
            @change="handleCityChange"
        >
          <option value="" disabled>
            {{ isLoadingCities ? 'Loading cities...' : 'Select City' }}
          </option>
          <option v-for="item in cities" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
        <p v-if="errors.city" class="form-error">{{ errors.city }}</p>
      </div>

      <div>
        <label class="form-label">District <span>*</span></label>
        <select
            :value="districts.find(item => item.name === form.district)?.id ?? ''"
            required
            class="form-input form-select"
            :disabled="!selectedCityId || isLoadingDistricts"
            @change="handleDistrictChange"
        >
          <option value="" disabled>
            {{ isLoadingDistricts ? 'Loading districts...' : 'Select District' }}
          </option>
          <option v-for="item in districts" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
        <p v-if="errors.district" class="form-error">{{ errors.district }}</p>
      </div>

      <div class="sm:col-span-2">
        <label class="form-label">Address <span>*</span></label>
        <textarea
            v-model="form.address"
            required
            rows="3"
            class="form-input"
        />
        <p v-if="errors.address" class="form-error">{{ errors.address }}</p>
      </div>
    </div>

    <p v-if="regionError" class="text-sm text-red-500">
      {{ regionError }}
    </p>

    <div class="flex justify-end gap-3 border-t border-slate-100 pt-4">
      <button
          type="button"
          class="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium"
          @click="emit('cancel')"
      >
        Cancel
      </button>

      <button
          type="submit"
          :disabled="loading"
          class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {{ loading ? 'Saving...' : 'Save Employee' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.form-label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

.form-label span {
  color: #ef4444;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
  background-color: white;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 10%);
}

.form-input:disabled {
  cursor: not-allowed;
  background-color: #f1f5f9;
  color: #94a3b8;
}

.form-error {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #ef4444;
}

.form-select {
  appearance: none;
  padding-right: 2.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}
</style>