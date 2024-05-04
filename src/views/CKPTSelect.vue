<script lang="ts" setup>
import { ElInput, ElButton } from 'element-plus'
import { Search, Close } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

import ParamsCard from '@/components/ParamsCard.vue'
import CKPTPreview from '@/components/CKPTPreview.vue'
// import ValidationsFigure from '@/components/ValidationsFigure.vue'
import { CKPTStatic, CKPTMaps, webUiApi, CKPTkeys } from '../api'
import { storeData } from '../api/utils'

import { ref, onMounted, Ref } from 'vue'

const router = useRouter()

const root_dir: Ref<string> = ref('.kge_checkpoints')

const conf_statics: Ref<CKPTStatic[]> = ref([])
const ckpt_paths: Ref<string[]> = ref([])
const maps: Ref<CKPTMaps> = ref({
    control_params: undefined,
    model_params: undefined,
    train_params: undefined,
    valid_params: undefined,
    test_metrics: undefined,
    status: undefined,
    hyperparams: undefined
})
const mainMetricKey: Ref<string> = ref('mrr')
const targetIdxes: Ref<Record<CKPTkeys, number | undefined>> = ref({
    control_params: undefined,
    model_params: undefined,
    train_params: undefined,
    valid_params: undefined,
    test_metrics: undefined,
    status: undefined,
    hyperparams: undefined
})
const interResult: Ref<number[]> = ref([])

import ckpt_example from '@/ckpts_example.json'

onMounted(() => {
    // setTimeout(() => fetchCkpts(), 3000)
    // let [ckpts, statics, mps] = ckpt_example as [string[], CKPTStatic[], CKPTMaps]
    // cbv([ckpts, statics, mps])
    webUiApi.onready(fetchCkpts)
})

function cbv(data: [string[], CKPTStatic[], CKPTMaps]) {
    let [ckpts, statics, mps] = data
    console.log(ckpts)
    ckpt_paths.value = ckpts
    maps.value = mps
    for (const [key, value] of Object.entries(mps))
        if (!value) delete mps[key as keyof CKPTMaps]
    conf_statics.value = statics
}

function fetchCkpts() {
    webUiApi.toggle(`get_ckpts`, { root_dir: root_dir.value }, cbv)
}

function getInterset(idxes_arr: Array<number[]>) {
    let rt_arr = idxes_arr[0]
    for (let i = 1; i < idxes_arr.length; i++) {
        let tmp_set = new Set(idxes_arr[i])
        rt_arr = rt_arr.filter((x) => tmp_set.has(x))
    }
    return rt_arr
}

function getInterResult() {
    let all_sets: number[][] = []
    Object.keys(targetIdxes.value).forEach(key => {
        if(targetIdxes.value[key as CKPTkeys]) 
        {
            let targets = maps.value[key as CKPTkeys]
            let mapkey = targetIdxes.value[key as CKPTkeys]
            if(targets && mapkey)
                all_sets.push(targets[mapkey])
        }
    })
    interResult.value = getInterset(all_sets)
}

function onDropTargetIdx(e: DragEvent) {
    console.log('drop')
    e.preventDefault()
    let dataString = e.dataTransfer?.getData('application/json') as string
    let { idx, key } = JSON.parse(dataString) as { idx: number, key: CKPTkeys }
    targetIdxes.value[key] = idx
    getInterResult()
}

function onDragParamCard(ev: DragEvent, idx: number, key: CKPTkeys) {
    ev.dataTransfer?.setData('application/json', JSON.stringify({ idx, key }))
}

function jumpComparePage(): void {
    const selectedPaths = interResult.value.map(i=>ckpt_paths.value[i])
    const selectedStatics = interResult.value.map(i=>conf_statics.value[i])
    const usedKeys = Object.keys(targetIdxes.value).filter(k => targetIdxes.value[k as CKPTkeys] != undefined)
    
    storeData('selectedCKPTs', [selectedPaths, selectedStatics, usedKeys])
    router.push('CKPTsCompare')
}

</script>

<template>
    <div style="display: flex; flex-direction: row; width: 100%; height: 100%;">
        <div @drop="onDropTargetIdx" @dragover="e=> e.preventDefault()" 
            style="width: 200px; height: 100%; display: flex; flex-direction: column;">
            <div style="display: flex; flex-direction: row; flex-wrap: wrap">
                <template v-for="idx, key of targetIdxes">
                    <div v-if="idx != 'undefined'" >{{ key }}
                        <Close style="float: right" width="10px" height="10px" 
                            @click="() => { targetIdxes[key] = undefined; getInterResult() }" >
                        </Close>
                    </div>
                    <ParamsCard v-if="idx != 'undefined'" 
                        :data="conf_statics[idx][key]" ></ParamsCard>
                </template>
            </div>
            <div style="flex: 1;"></div>
            <div>
                <CKPTPreview v-for="i in interResult" 
                    :mainMetricKey="mainMetricKey" 
                    :ckpt="conf_statics[i]">
                </CKPTPreview>
            </div>
            <ElButton type="success" @click="jumpComparePage"> Compare These CKPTs </ElButton>
        </div>
        <!--Showing the whole checkpoints-->
        <div style="flex: 1; width: calc(100%-200px); height: 100%; overflow: auto;">
            <ElInput v-model="root_dir">
                <template #append>
                    <ElButton :icon="Search" @click="fetchCkpts" ></ElButton>
                </template>
            </ElInput>
            <div v-for="(map, key) of maps">
                <div style="font-size: 20px; border-left: 5px solid #2bb; margin: 5px 0px; padding-left: 5px;">
                    {{ key }}</div>
                <!-- TODO: Convert into Drag -->
                <div v-if="maps[key]" style="display: flex; flex-direction: row; width: 100%; overflow: auto;">
                    <div style="width: 150px; margin: 0px 5px;" v-for="(idxes, key2) of map">
                        <!-- show the key params -->
                        <div style="display: flex; flex-direction: row;">
                            <ParamsCard draggable="true" 
                                style="max-height: 100px"
                                :data="conf_statics[key2][key]"
                                @dragstart="ev => onDragParamCard(ev, key2, key)">
                            </ParamsCard>
                            <div style="vertical-align: center;">{{ idxes.length }}</div>
                        </div>
                        <!-- show containing checkpoints -->
                        <div v-if="idxes" style="max-height: 50px; overflow: auto; display: flex; flex-direction: row; flex-wrap: wrap;">
                            <!-- <div v-for="idx in idxes">{{ (conf_statics[idx]['test_metrics']['mrr'] as number).toExponential(2) }},</div> -->
                            <CKPTPreview v-for="idx in idxes" 
                                :mainMetricKey="mainMetricKey" 
                                :ckpt="conf_statics[idx]">
                            </CKPTPreview>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
