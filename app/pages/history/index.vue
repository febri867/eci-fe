
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useHistory } from '~/features/history/composables/useHistory'
import HistoryFilters from '~/features/history/components/HistoryFilters.vue'
import type {
  ActivityLog,
  HistoryFilters as FilterType,
} from '~/features/history/types/history.types'

definePageMeta({
  middleware: 'auth',
})

const {
  logs,
  total,
  hasMore,
  loading,
  error,
  loadLogs,
  applyFilters,
  loadMore,
  summary,
} = useHistory()

const selectedLog = ref<ActivityLog | null>(null)

const summaryCards = computed(() => [
  {
    label: 'Total Activities',
    value: summary.value.total,
    background: 'bg-indigo-50',
    text: 'text-indigo-600',
    icon: 'activity',
    description: 'All recorded activities',
  },
  {
    label: 'Created',
    value: summary.value.created,
    background: 'bg-emerald-50',
    text: 'text-emerald-600',
    icon: 'plus',
    description: 'New employees added',
  },
  {
    label: 'Updated',
    value: summary.value.updated,
    background: 'bg-blue-50',
    text: 'text-blue-600',
    icon: 'edit',
    description: 'Employee records updated',
  },
  {
    label: 'Deleted',
    value: summary.value.deleted,
    background: 'bg-rose-50',
    text: 'text-rose-600',
    icon: 'minus',
    description: 'Employee records deleted',
  },
])

const formatDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const actionLabel = (action: string) => {
  return action.replaceAll('_', ' ')
}

const actionClass = (action: string) => {
  if (action === 'CREATE_EMPLOYEE') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
  }

  if (action === 'UPDATE_EMPLOYEE') {
    return 'bg-blue-50 text-blue-700 ring-blue-600/20'
  }

  if (action === 'DELETE_EMPLOYEE') {
    return 'bg-rose-50 text-rose-700 ring-rose-600/20'
  }

  if (action === 'GENERATE_STAR_PATTERN') {
    return 'bg-amber-50 text-amber-700 ring-amber-600/20'
  }

  if (action === 'GENERATE_NUMBER_TO_WORDS') {
    return 'bg-violet-50 text-violet-700 ring-violet-600/20'
  }

  return 'bg-gray-100 text-gray-700 ring-gray-500/20'
}

const actionIcon = (action: string) => {
  if (action === 'CREATE_EMPLOYEE') return '+'
  if (action === 'UPDATE_EMPLOYEE') return '↻'
  if (action === 'DELETE_EMPLOYEE') return '−'
  if (action === 'GENERATE_STAR_PATTERN') return '★'
  if (action === 'GENERATE_NUMBER_TO_WORDS') return '#'

  return '•'
}

const handleFilter = (filters: FilterType) => {
  selectedLog.value = null
  applyFilters(filters)
}

const toggleDetail = (log: ActivityLog) => {
  selectedLog.value = selectedLog.value?.id === log.id ? null : log
}

const refreshLogs = () => {
  selectedLog.value = null
  loadLogs(true)
}

onMounted(() => {
  loadLogs(true)
})

const router = useRouter()

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    router.back()
    return
  }

  navigateTo('/dashboard')
}

</script>

<template>
  <main class="min-h-screen bg-slate-50 p-4 sm:p-6">
    <div class="mx-auto max-w-6xl space-y-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
              type="button"
              class="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
              @click="goBack"
          >
            <span>←</span>
            Back
          </button>

          <h1 class="text-2xl font-bold text-slate-900">
            Activity Logs
          </h1>

          <p class="mt-1 text-sm text-slate-500">
            Track and monitor activities across the application.
          </p>
        </div>

        <div class="flex gap-2">
          <NuxtLink
              to="/dashboard"
              class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Dashboard
          </NuxtLink>

          <button
              type="button"
              :disabled="loading"
              class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              @click="refreshLogs"
          >
            {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
        </div>
      </div>

      <section class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <article
            v-for="item in summaryCards"
            :key="item.label"
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
        >
          <div class="flex items-center justify-between gap-2">
            <div
                class="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold"
                :class="[item.background, item.text]"
            >
              <span v-if="item.icon === 'activity'">⌁</span>
              <span v-else-if="item.icon === 'plus'">+</span>
              <span v-else-if="item.icon === 'edit'">✎</span>
              <span v-else>−</span>
            </div>

            <span class="hidden rounded-full bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-400 sm:inline">
            Activity
          </span>
          </div>

          <p class="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {{ item.value }}
          </p>

          <p class="mt-1 text-sm font-semibold text-gray-700">
            {{ item.label }}
          </p>

          <p class="mt-1 text-xs text-gray-400">
            {{ item.description }}
          </p>
        </article>
      </section>

      <section class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div class="mb-4">
          <h2 class="font-semibold text-gray-900">
            Filter Activities
          </h2>
          <p class="mt-1 text-xs text-gray-500">
            Narrow down activity records using the available filters.
          </p>
        </div>

        <HistoryFilters @apply="handleFilter" />
      </section>

      <section class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div class="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 class="font-semibold text-gray-900">
              Activity History
            </h2>
            <p class="mt-1 text-xs text-gray-500">
              Showing {{ logs.length }} of {{ total }} activities
            </p>
          </div>

          <span class="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live from Elasticsearch
        </span>
        </div>

        <div v-if="error" class="p-10 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-xl text-rose-600">
            !
          </div>
          <p class="mt-3 font-semibold text-gray-900">
            Unable to load activities
          </p>
          <p class="mt-1 text-sm text-gray-500">
            {{ error }}
          </p>
          <button
              type="button"
              class="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
              @click="refreshLogs"
          >
            Try Again
          </button>
        </div>

        <div
            v-else-if="loading && logs.length === 0"
            class="p-12 text-center"
        >
          <div class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />
          <p class="mt-3 text-sm text-gray-500">
            Loading activity history...
          </p>
        </div>

        <div
            v-else-if="logs.length === 0"
            class="p-12 text-center"
        >
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl text-gray-400">
            ◷
          </div>
          <h3 class="mt-4 font-semibold text-gray-900">
            No activities found
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            There are no activity records matching your filters.
          </p>
        </div>

        <template v-else>
          <div class="hidden overflow-x-auto md:block">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th class="px-6 py-4">Activity</th>
                <th class="px-6 py-4">Actor</th>
                <th class="px-6 py-4">Entity ID</th>
                <th class="px-6 py-4">Date & Time</th>
                <th class="px-6 py-4 text-right">Details</th>
              </tr>
              </thead>

              <tbody class="divide-y divide-gray-100">
              <tr
                  v-for="log in logs"
                  :key="log.id"
                  class="transition hover:bg-indigo-50/30"
                  :class="{ 'bg-indigo-50/40': selectedLog?.id === log.id }"
              >
                <td class="px-6 py-4">
                  <span
                      class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ring-inset"
                      :class="actionClass(log.action)"
                  >
                    <span class="text-sm">{{ actionIcon(log.action) }}</span>
                    {{ actionLabel(log.action) }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <span class="font-mono text-xs text-gray-600">
                    {{ log.actorId }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <span class="font-mono text-xs text-gray-600">
                    {{ log.entityId }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <p class="font-medium text-gray-700">
                    {{ formatDate(log.createdAt) }}
                  </p>
                </td>

                <td class="px-6 py-4 text-right">
                  <button
                      type="button"
                      class="rounded-lg px-3 py-2 text-xs font-semibold transition"
                      :class="selectedLog?.id === log.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-indigo-600 hover:bg-indigo-50'"
                      @click="toggleDetail(log)"
                  >
                    {{ selectedLog?.id === log.id ? 'Close Detail' : 'View Detail' }}
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="divide-y divide-gray-100 md:hidden">
            <article
                v-for="log in logs"
                :key="log.id"
                class="space-y-3 p-4 transition"
                :class="{ 'bg-indigo-50/40': selectedLog?.id === log.id }"
            >
              <div class="flex items-center justify-between gap-3">
              <span
                  class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ring-inset"
                  :class="actionClass(log.action)"
              >
                {{ actionIcon(log.action) }}
                {{ actionLabel(log.action) }}
              </span>

                <span class="text-[11px] text-gray-400">
                {{ formatDate(log.createdAt) }}
              </span>
              </div>

              <div class="grid grid-cols-1 gap-2 rounded-xl bg-gray-50 p-3">
                <div>
                  <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Actor ID
                  </p>
                  <p class="mt-1 break-all font-mono text-xs text-gray-700">
                    {{ log.actorId }}
                  </p>
                </div>

                <div>
                  <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Entity ID
                  </p>
                  <p class="mt-1 break-all font-mono text-xs text-gray-700">
                    {{ log.entityId }}
                  </p>
                </div>
              </div>

              <button
                  type="button"
                  class="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  @click="toggleDetail(log)"
              >
                {{ selectedLog?.id === log.id ? 'Close Detail' : 'View Activity Detail' }}
              </button>
            </article>
          </div>

          <div
              v-if="selectedLog"
              class="border-t border-gray-100 bg-gray-50/80 p-4 sm:p-6"
          >
            <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-xs font-medium uppercase tracking-wider text-indigo-600">
                  Activity Information
                </p>
                <h3 class="mt-1 font-semibold text-gray-900">
                  {{ actionLabel(selectedLog.action) }}
                </h3>
              </div>

              <button
                  type="button"
                  class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                  @click="selectedLog = null"
              >
                Close
              </button>
            </div>

            <div class="mb-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl border border-gray-100 bg-white p-4">
                <p class="text-xs text-gray-400">Actor ID</p>
                <p class="mt-1 break-all font-mono text-xs text-gray-700">
                  {{ selectedLog.actorId }}
                </p>
              </div>

              <div class="rounded-xl border border-gray-100 bg-white p-4">
                <p class="text-xs text-gray-400">Entity ID</p>
                <p class="mt-1 break-all font-mono text-xs text-gray-700">
                  {{ selectedLog.entityId }}
                </p>
              </div>
            </div>

            <div class="grid gap-4 lg:grid-cols-2">
              <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div class="border-b border-gray-100 px-4 py-3">
                  <h4 class="text-sm font-semibold text-gray-700">
                    Before Changes
                  </h4>
                </div>
                <pre class="max-h-80 overflow-auto p-4 text-xs leading-6 text-gray-600">{{ JSON.stringify(selectedLog.before ?? null, null, 2) }}</pre>
              </div>

              <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div class="border-b border-gray-100 px-4 py-3">
                  <h4 class="text-sm font-semibold text-gray-700">
                    After Changes
                  </h4>
                </div>
                <pre class="max-h-80 overflow-auto p-4 text-xs leading-6 text-gray-600">{{ JSON.stringify(selectedLog.after ?? null, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </template>

        <div
            v-if="hasMore && !error"
            class="border-t border-gray-100 p-5 text-center"
        >
          <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="loading"
              @click="loadMore"
          >
          <span
              v-if="loading"
              class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
          />
            {{ loading ? 'Loading...' : 'Load More Activities' }}
          </button>
        </div>
      </section>
    </div>
  </main>
</template>
