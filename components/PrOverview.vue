<template>
  <div>
    <div class="prTitle">
      {{ pullRequest.title }}
    </div>
    <div class="prSubLine">
      {{ subLine }}
    </div>
  </div>
  <div>
    <label-display
      v-for="label in pullRequest.labels"
      :key="label.id"
      :text="label.name"
      :color="'#' + label.color"
    />
  </div>
  <div class="center-align">
    <label-display :text="pullRequest.repository.name" />
    <icon-user
      :icon-path="pullRequest.author.avatarURL"
      :size="'32px'"
    />
  </div>
</template>

<script setup lang="ts">
import { PullRequest } from '../server/types/pullRequest'

const props = defineProps<{ pullRequest: PullRequest}>()

const subLine = computed(() => {
    return `#${props.pullRequest.number} opened ${props.pullRequest.createdAt} ago by ${props.pullRequest.author.login} • ${props.pullRequest.state}`
})
</script>

<style scoped lang="scss">
.prTitle {
    font: var(--text-bold);
}
.prSubLine {
    font: var(--text-small);
    color: var(--small-text-color);
}

.center-align {
    display: flex;
    align-items: center;
}

</style>