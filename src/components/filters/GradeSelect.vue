<script setup lang="ts">
const emit = defineEmits<{
  change: [value: string]
}>()

const options = [
  { label: '全部年级', value: '' },
  { label: '初一', value: 'grade7' },
  { label: '初二', value: 'grade8' },
  { label: '初三', value: 'grade9' },
  { label: '高一', value: 'grade10' },
  { label: '高二', value: 'grade11' },
  { label: '高三', value: 'grade12' },
]

const handleChange = (val: string) => {
  emit('change', val)
}
</script>

<template>
  <el-select
    placeholder="选择年级"
    size="small"
    style="width: 140px"
    @change="handleChange"
  >
    <el-option
      v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value"
    />
  </el-select>
</template>
