<script lang="ts" setup>
import VChart from "vue-echarts"  // { THEME_KEY }
import { ref, Ref, watch } from 'vue'

import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'


use([GridComponent, LineChart, CanvasRenderer])

let props = defineProps<{
    title: string,
    values: Array<number[]>,
}>()


interface Option {
    xAxis: {
        data: number[],
        type: string
    },
    yAxis: {
        type: string
    },
    series: {
        data: Array<number[]>,
        type: string,
        smooth: boolean
    }[]
}


const chartOptions: Ref<Option> = ref({
  xAxis: {
    data: [1, 3, 7, 10, 12],
    type: 'value'
  },
  yAxis: {
    type: 'value'
  },
  series: [
        {
            data: [],
            type: 'line',
            smooth: true,
        }
    ]
});

watch(() => props.values, (newVal: Array<number[]>, _: Array<number[]>) => {
    chartOptions.value.series[0].data = newVal
})
// chartOptions.value.series[0].data = props.values

</script>

<template>
    <VChart :option="chartOptions"></VChart>
</template>
