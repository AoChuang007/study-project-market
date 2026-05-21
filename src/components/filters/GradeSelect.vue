<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
}>(), {
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const options = [
  { label: '全部年级', value: '' },
  { label: '大一', value: 'freshman' },
  { label: '大二', value: 'sophomore' },
  { label: '大三', value: 'junior' },
  { label: '大四', value: 'senior' },
  { label: '研一', value: 'master1' },
  { label: '研二', value: 'master2' },
  { label: '研三', value: 'master3' },
]

const handleChange = (val: string) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <el-select
    :model-value="props.modelValue"
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
