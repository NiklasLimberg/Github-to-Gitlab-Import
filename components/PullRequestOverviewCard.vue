<template>
  <nuxt-link
    :to="`/${pullRequest.repository.name}/${pullRequest.number}`"
    class="prOverviewContainer"
  >
    <div class="prInformation">
      <icon-imported v-if="pullRequest.collapsedState === 'imported'" />
      <icon-review-failed v-if="pullRequest.collapsedState === 'review-failed'" />
      <icon-merge-conflicts v-if="pullRequest.collapsedState === 'merge-conflicts'" />
      <icon-ready v-if="pullRequest.collapsedState === 'ready'" />
      <div>
        <div class="prTitle">
          {{ pullRequest.title }}
        </div>
        <div class="prSubLine">
          {{ subLine }}
        </div>
      </div>
    </div>
    <div class="center-align">
      <div class="label-display">
        <label-display
          v-for="label in pullRequest.labels"
          :key="label.id"
          :text="label.name"
          :color="'#' + label.color"
        />
      </div>
      <div class="status-labels">
        <label-display :text="pullRequest.repository.name" />
        <icon-user
          :icon-path="pullRequest.author.avatarURL"
          :size="'32px'"
        />
      </div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import { PullRequest } from '../server/types/pullRequest'

const props = defineProps<{ pullRequest: PullRequest}>()

const subLine = computed(() => {
    return `#${props.pullRequest.number} opened ${dateFilter(props.pullRequest.createdAt)} ago by ${props.pullRequest.author.login} • ${capitalize(props.pullRequest.state)}`
})
</script>

<style scoped lang="scss">
.prOverviewContainer {
  padding: 11.5px 16px;
  display: flex;
  justify-content: space-between;
  border: var(--default-border)
}

.prOverviewContainer:hover {
  background: var(--background-hover-color);
}

.prTitle {
    font: var(--text-bold);
}
.prSubLine {
  font: var(--text-small);
  color: var(--small-text-color);
}
.prInformation {
  display: flex;
  gap: 16px;
}

.center-align {
  display: flex;
  align-items: center;
  gap: 16px;
}

.label-display {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-labels {
  display: flex;
  gap: 24px;
  padding-left: 16px;
  border-left: var(--default-border);
}
</style>