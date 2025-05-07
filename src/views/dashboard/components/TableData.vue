<template>
  <ElCard class="flex h-96 flex-col" body-class="flex-1 flex flex-col min-h-0">
    <template #header> 数据列表 </template>

    <ElTable :data="tableData" style="width: 100%; height: 100%">
      <ElTableColumn fixed label="姓名">
        <template #default="scope">
          <ElImage loading="lazy" style="height: 40px; width: 40px" :src="scope.row.avatarUrl" />
          <p>{{ scope.row.name }}</p>
        </template>
      </ElTableColumn>

      <ElTableColumn label="email" prop="email" />
      <ElTableColumn label="信息" prop="message" />
      <ElTableColumn label="日期" prop="date" />
    </ElTable>
  </ElCard>
</template>

<script setup lang="ts">
import { ElTableColumn } from 'element-plus'
import { githubService } from '@/services/GithubService'

const tableData = ref<Record<string, any>[]>([])

githubService.getVuejsCommits().then((data) => {
  tableData.value = data
})
</script>
