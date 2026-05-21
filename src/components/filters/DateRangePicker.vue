<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
}>(), {
  modelValue: '7d',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const options = [
  { label: '今日', value: 'today' },
  { label: '近7日', value: '7d' },
  { label: '近30日', value: '30d' },
  { label: '近90日', value: '90d' },
]

const handleChange = (val: string) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <el-radio-group :model-value="props.modelValue" size="small" @change="handleChange">
    <el-radio-button v-for="opt in options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </el-radio-button>
  </el-radio-group>
</template>
