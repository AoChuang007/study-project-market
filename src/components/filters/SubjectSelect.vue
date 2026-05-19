<script setup lang="ts">
const emit = defineEmits<{
  change: [value: string[]]
}>()

const options = ['数学', '英语', '物理', '语文', '化学', '生物', '历史', '地理']

const handleChange = (val: string[]) => {
  emit('change', val)
}
</script>

<template>
  <el-select
    placeholder="选择学科"
    size="small"
    multiple
    collapse-tags
    collapse-tags-tooltip
    style="width: 180px"
    @change="handleChange"
  >
    <el-option
      v-for="opt in options"
      :key="opt"
      :label="opt"
      :value="opt"
    />
  </el-select>
</template>
