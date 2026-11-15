
<script setup lang="ts">
import {useSnackbar} from "~/compasable/useSnackbar.ts";
const { message, type, visible, hide } = useSnackbar()
</script>

<template>
  <Transition name="snackbar">
    <div
        v-if="visible"
        class="snackbar"
        :class="`snackbar--${type}`"
        role="alert"
    >
      <span class="snackbar__icon">
        {{ type === 'success' ? '✓' : '!' }}
      </span>

      <span class="snackbar__message">
        {{ message }}
      </span>

      <button
          type="button"
          class="snackbar__close"
          aria-label="Close notification"
          @click="hide"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.snackbar {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 280px;
  max-width: calc(100vw - 32px);
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #1f2937;
  box-shadow: 0 8px 30px rgb(0 0 0 / 12%);
}

.snackbar--success .snackbar__icon {
  background: #dcfce7;
  color: #15803d;
}

.snackbar--error .snackbar__icon {
  background: #fee2e2;
  color: #dc2626;
}

.snackbar__icon {
  display: grid;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  font-weight: 700;
}

.snackbar__message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.snackbar__close {
  border: 0;
  background: transparent;
  color: #6b7280;
  font-size: 22px;
  cursor: pointer;
}

.snackbar-enter-active,
.snackbar-leave-active {
  transition: all 0.25s ease;
}

.snackbar-enter-from,
.snackbar-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 640px) {
  .snackbar {
    top: 16px;
    right: 16px;
    left: 16px;
    min-width: unset;
  }
}
</style>
