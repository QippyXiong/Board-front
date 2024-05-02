<!--
 * Preview snapshot for a single checkpoint
-->
<script lang="ts" setup>
// import { ref, Ref } from 'vue'
import { ElTag, ElTooltip } from 'element-plus'

import { CKPTStatic } from '@/api'
import ParamsCard from './ParamsCard.vue'
import { ref } from 'vue';

defineProps<{
    ckpt: CKPTStatic,
    mainMetricKey: string,
    ckptPath?: string,
    showPath?: boolean
}>()

const detailsVisible = ref(false)

function formatShowMetric(ckpt: CKPTStatic, mainMetricKey: string) {
    let metric = ckpt.test_metrics[mainMetricKey] as number
    if (metric) {
        return metric.toFixed(3)
    }
    return "N/A"
    
}

</script>

<template>
    <ElTooltip
        effect="dark"
        trigger="click">
        <!-- :visible="detailsVisible" -->
        <template #content>
            <div style="display: flex; flex-direction: row; flex-wrap: wrap;">
                <ElTooltip trigger="hover"  v-for="v, k of ckpt">
                    <template #content>
                        <!-- <div v-for="key, val in v">{{ key + ": " + val }}</div> -->
                        <ParamsCard style="max-width: 150px;" :no-padding="true" :no-border="true" :data="v"></ParamsCard>
                    </template>
                    <ElTag style="margin-right: 5px; cursor: pointer;">{{ k }}</ElTag>
                </ElTooltip>
            </div>
        </template>
        <ElTag  @click="detailsVisible = !detailsVisible" 
            style="cursor: pointer; max-width: 100%; text-wrap: nowrap; overflow: hidden;">
            {{ showPath ? ckptPath : formatShowMetric(ckpt, mainMetricKey) }}
        </ElTag>
    </ElTooltip>
</template>