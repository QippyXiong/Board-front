<script setup>
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, watch } from 'vue'

import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([GridComponent, LineChart, CanvasRenderer])

let props = defineProps({
    values: Array,
    title: {
        type: String,
        default: 'Figure'
    },
    values: {
        type: Array,
        default: []
    },
})


const chartOptions = ref({
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

watch(() => props.values, (newVal, oldVal) => {
    chartOptions.value.series[0].data = newVal
})
// chartOptions.value.series[0].data = props.values

</script>

<template>
    <VChart :option="chartOptions"></VChart>
</template>