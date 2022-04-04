<template>
  <div class="sidebar-container">
    <div>
      <span class="bold">
        Author
      </span>
      <div class="flex">
        <icon-user :icon-path="author.avatarURL" />
        <span>{{ author.login }}</span>
      </div>
    </div>
    <div v-if="assignee">
      <span class="bold margin-top">
        Assignee
      </span>
      <div class="flex">
        <icon-user :icon-path="assignee.avatarURL" />
        <span>{{ assignee.login }}</span>
      </div>
    </div>
    <div>
      <span class="bold margin-top">
        Status
      </span>
      <div>
        <div class="flex">
          <icon-ready v-if="mergeable" />
          <icon-failed v-else />
          <span>Mergeable</span>
        </div>
        <div class="flex">
          <icon-ready v-if="reviewPassed" />
          <icon-failed v-else />
          <span>Review passed</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~~/server/types/pullRequest'

defineProps<{author: User, assignee?: User, reviewPassed: boolean, mergeable: boolean }>()
</script>

<style scoped>
.sidebar-container {
    border: var(--default-border);
    border-radius: 6px;
    background-color: var(--background-color);
    padding: 24px;
}

.margin-top {
    margin-top: 24px;
}

.flex {
    display: flex;
    align-items: center;
    padding: 8px 0;
    gap: 8px;
}
.bold {
    font: var(--text-bold)
}
</style>