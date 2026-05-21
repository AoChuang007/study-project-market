<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
}>(), {
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const options = ['数学', '英语', '物理', '语文', '化学', '生物', '历史', '地理']

/** 将逗号分隔的字符串转为数组，供 el-select 多选使用 */
const selectedArray = computed<string[]>({
  get: () => props.modelValue ? props.modelValue.split(',').filter(Boolean) : [],
  set: (val: string[]) => emit('update:modelValue', val.join(',')),
})
</script>

<template>
  <el-select
    v-model="selectedArray"
    placeholder="选择学科"
    size="small"
    multiple
    collapse-tags
    collapse-tags-tooltip
    style="width: 180px"
  >
    <el-option
      v-for="opt in options"
      :key="opt"
      :label="opt"
      :value="opt"
    />
  </el-select>
</template>
