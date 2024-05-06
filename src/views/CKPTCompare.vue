<script lang="ts" setup>
import { ref, onMounted, Ref } from 'vue'

import { Metrics, webUiApi, CKPTStatic } from '@/api'
import { loadData } from '@/api/utils'

import LineFigure from '@/components/LineFigure.vue'
import CKPTPreview from '@/components/CKPTPreview.vue'

const valid_values: Ref<Array<[number, number]>> = ref([])
const losses: Ref<Array<[number, number]>> = ref([])
const unit = ref('epoch')
const mainMetricKey = ref('mrr')

const selected_paths: Ref<string[]> = ref([])
const selected_statics: Ref<CKPTStatic[]> = ref([])
const used_keys: Ref<string[]> = ref([])

// TODO: implement metrics comparision between different params

onMounted(()=>{
    let [selectedPaths, selectedStatics, usedKeys]: [string[], CKPTStatic[], string[]] = loadData('selectedCKPTs')
    selected_paths.value = selectedPaths
    console.log(selected_paths.value)
    selected_statics.value = selectedStatics
    used_keys.value = usedKeys

    webUiApi.addListener(`losses`, (data: Record<string, number>[])=>{
        console.log(data)
        if(data[0]['loss'] == undefined)
        { // `loss` key must exist
            console.error('loss key not found in data')
            return
        }
        if(data[0][unit.value] == undefined)
        {
            console.error(`${unit.value} key not found in data`)
            return
        }
        losses.value = data.map((d) => [d[unit.value], d['loss']])
    })
    webUiApi.addListener(`valids`, (data: [string, Array<[number, Metrics]>]) => {
        let [_unit, metrics] = data
        unit.value = _unit
        valid_values.value = metrics.map((m) => [m[0], m[1][mainMetricKey.value] as number])
    })
})

const loss_func: Ref<string> = ref('')
function showLoss(path: string, idx: number) {
    console.log(`showLoss ${path}`)
    webUiApi.emit(`losses`, { ckpt_path: path })
    loss_func.value = selected_statics.value[idx].train_params['loss_func'] as string
}

function showValids(ckpt: string) {
    console.log(`showValids ${ckpt}`)
    webUiApi.emit(`valids`, { ckpt_path: ckpt })
}

function clickPreview(ev: MouseEvent, path: string, idx: number) {
    console.log(ev)
    if (ev.altKey) {
        ev.stopPropagation();
        ev.preventDefault();
        console.log(`right click ${path}`)
        showLoss(path, idx)
        showValids(path)
    }
}

</script>

<template>
    <div style="width: 100%; height: 100%; display: flex; flex-direction: row;">
        <div style="width: 200px;">
            <div v-for="path,idx of selected_paths" @click="ev => clickPreview(ev, path, idx)">
                <CKPTPreview
                    :main-metric-key="mainMetricKey"
                    :show-path="true"
                    :ckpt-path="path"
                    :ckpt="selected_statics[idx]">
                </CKPTPreview>
            </div>
        </div>
        <!-- TODO: implement multiple metrics review -->
        <div style="width: calc(100%-200px); box-sizing: border-box;">
            <LineFigure v-if="mainMetricKey!=''" class="figure"
                title="Validation Metrics"
                :values="valid_values"
                :x-name="unit">
            </LineFigure>
            <LineFigure v-if="mainMetricKey!=''" class="figure"
                :title="`Loss ${loss_func}`"
                :values="losses"
                :x-name="unit">
            </LineFigure>
        </div>
    </div>
</template>

<style scoped>
.figure {
    height: 400px; 
    width: 400px;
}
</style>