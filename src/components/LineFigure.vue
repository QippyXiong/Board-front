<script lang="ts" setup>
import VChart from "vue-echarts"  // { THEME_KEY }
import { ref, Ref, watch } from 'vue'

import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TitleComponent, DataZoomComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { EChartsCoreOption } from 'echarts/core'

use([GridComponent, LineChart, CanvasRenderer, TitleComponent, DataZoomComponent, TooltipComponent, LegendComponent])

const props = defineProps<{
    values: Array<number[]>,
    title?: string,
    unit?: string,
    xName?: string,
    yName?: string,
    legends?: Array<string | { name: string, icon: string, textStyle: { color: string } }>,
}>()

const chartOptions: Ref<EChartsCoreOption> = ref({
    title: {
        text: props.title,
    },
    legend: {
        data: props.legends,
    },
    tooltip: {
        trigger: 'item',
        show: true,
        formatter: `({c})`,
    },
    xAxis: {
        data: [1, 3, 7, 10, 12],
        type: 'value',
        name: props.xName,
    },
    yAxis: {
        type: 'value',
        name: props.yName,
    },
    series: [
        {
            data: [],
            type: 'line',
            smooth: true,
        }
    ],
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100,
            orient: 'horizontal',
            xAxisIndex: [0],
        },
        {
            type: 'inside',
            start: 0,
            end: 100,
            orient: 'horizontal',
            yAxisIndex: [0],
        }
    ]
});

watch(() => props.values, (newVal: Array<number[]>, _: Array<number[]>) => {
    if(Array.isArray(chartOptions.value.series))
        chartOptions.value.series[0].data = newVal
})

watch(() => props.title, (newVal?: string, _?: string) => {
    (chartOptions.value.title as { text?: string }).text = newVal
})
// chartOptions.value.series[0].data = props.values

</script>

<template>
    <VChart :option="chartOptions"></VChart>
</template>
