<script lang="ts" setup>
import VChart from "vue-echarts"  // { THEME_KEY }
import { ref, Ref, watch } from 'vue'

import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { EChartsCoreOption } from 'echarts/core'

use([GridComponent, LineChart, CanvasRenderer, TitleComponent])

const props = defineProps<{
    values: Array<number[]>,
    title?: string,
    unit?: string
}>()

const chartOptions: Ref<EChartsCoreOption> = ref({
    title: {
        text: props.title,
    },
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
    if(Array.isArray(chartOptions.value.series))
        chartOptions.value.series[0].data = newVal
})
// chartOptions.value.series[0].data = props.values

</script>

<template>
    <VChart :option="chartOptions"></VChart>
</template>
