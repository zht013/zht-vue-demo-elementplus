<template>
  <div>
    <div class="flex flex-wrap gap-4">
      <LineChartCard
        name="Forks"
        :total-count="totalForks"
        :icon="IconEpShare"
        color="#41b6ff"
        :data="forksData"
      />
      <LineChartCard
        name="Issues"
        :total-count="totalIssues"
        :icon="IconEpTicket"
        color="#e85f33"
        :data="issuesData"
      />
      <LineChartCard
        name="Stargazers"
        :total-count="totalStargazers"
        :icon="IconEpStarFilled"
        color="#26ce83"
        :data="stargazersData"
      />
    </div>

    <BarChartCard class="mt-4" />

    <TableData class="mt-4" />
  </div>
</template>

<script setup lang="ts">
import IconEpShare from '~icons/ep/share'
import IconEpTicket from '~icons/ep/ticket'
import IconEpStarFilled from '~icons/ep/star-filled'
import { githubService } from '@/services/GithubService'
import LineChartCard from './components/LineChartCard.vue'
import BarChartCard from './components/BarChartCard.vue'
import TableData from './components/TableData.vue'

const totalIssues = ref(0)
const totalForks = ref(0)
const totalStargazers = ref(0)
const forksData = ref<Record<string, any>[]>()
const issuesData = ref<Record<string, any>[]>()
const stargazersData = ref<Record<string, any>[]>()

githubService.getVuejsRepository().then((data) => {
  totalForks.value = data?.forksCount
  totalIssues.value = data?.issuesCount
  totalStargazers.value = data?.stargazersCount
})

githubService.getVuejsIssues().then((data) => {
  issuesData.value = data
})

githubService.getVuejsForks().then((data) => {
  forksData.value = data
})

githubService.getVuejsStargazers().then((data) => {
  stargazersData.value = data
})
</script>
