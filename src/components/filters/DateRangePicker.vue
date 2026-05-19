<script setup lang="ts">
const emit = defineEmits<{
  change: [value: string]
}>()

const currentValue = '7d'

const options = [
  { label: '今日', value: 'today' },
  { label: '近7日', value: '7d' },
  { label: '近30日', value: '30d' },
  { label: '近90日', value: '90d' },
]

const handleChange = (val: string) => {
  emit('change', val)
}
</script>

<template>
  <el-radio-group :model-value="currentValue" size="small" @change="handleChange">
    <el-radio-button v-for="opt in options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </el-radio-button>
  </el-radio-group>
</template>
