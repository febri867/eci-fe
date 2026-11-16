
<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const close = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
    >
      <div
          class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          role="dialog"
          aria-modal="true"
          :aria-label="title || 'Confirm action'"
      >
        <h2 class="text-lg font-semibold text-slate-900">
          {{ title || 'Confirm Action' }}
        </h2>

        <p class="mt-2 text-sm leading-6 text-slate-600">
          {{ message || 'Are you sure you want to continue?' }}
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <button
              type="button"
              :disabled="loading"
              class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              @click="close"
          >
            Cancel
          </button>

          <button
              type="button"
              :disabled="loading"
              class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              @click="emit('confirm')"
          >
            {{ loading ? 'Deleting...' : confirmText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
