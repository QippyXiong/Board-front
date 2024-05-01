<script lang="ts" setup>

import ParamsCard from '@/components/ParamsCard.vue'
// import ValidationsFigure from '@/components/ValidationsFigure.vue'
import { CKPTStatic, CKPTMaps, Metrics, webUiApi } from '../api'

// import VChart, { THEME_KEY } from "vue-echarts";
import { ref, onMounted, Ref } from 'vue'

import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([GridComponent, LineChart, CanvasRenderer])

const root_dir: Ref<string> = ref('.kge_checkpoints')

const valid_values: Ref<Array<[number, number]>> = ref([])
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
// const statics = ref([])


onMounted(() => {
    setTimeout(() => fetch_ckpts(), 3000)
})

function cbv(data: [string[], CKPTStatic[], CKPTMaps]) {
    let [ckpts, statics, mps] = data
    console.log(ckpts)
    ckpt_paths.value = ckpts
    maps.value = mps
    for (const [key, value] of Object.entries(mps))
        if (!value) delete mps[key as keyof CKPTMaps]
    console.log(statics)
    conf_statics.value = statics
}

function fetch_ckpts() {
    webUiApi.toggle(`get_ckpts`, { root_dir: root_dir.value }, cbv)
}

function showValids(ckpt) {
    webUiApi.toggle(`valids`, { ckpt_path: ckpt },
        (data: [string, Array<[number, Metrics]>]) => {
            let [unit, metrics] = data
            valid_values.value = metrics.map((m) => [m[0], m[1]['mrr'] as number])
            // chartOptions.value.series[0].data = abc
        })
}

import { ElInput, ElButton } from 'element-plus'
import Vuedrag from 'vuedraggable'

/**
 * Basic Design:
 * 1. Using draggable, drag wanted key into left bar
 * 2. Left bar shows the suitable checkpoint
 * 3. Left bar compare these checkpoints (quite hard maybe)
 */

</script>

<template>
    <div style="display: flex; flex-direction: row;">
        <!-- <div style="display: flex; flex-direction: column; float: left;">
    <ElTag v-for="ckpt in ckpt_paths" @click="showValids(ckpt)">{{  ckpt  }}</ElTag>
  </div> -->
        <!--left bar, using for dragging-->
        <div style="width: 200px;">
        </div>

        <!--Showing the whole checkpoints-->
        <div>
            <ElInput v-model="root_dir">
                <template #prefix>
                    <ElButton></ElButton>
                </template>
            </ElInput>
            <div v-for="(map, key) of maps">
                <div>{{ key }}
                </div>
                <div v-if="maps[key]" style="display: flex; flex-direction: row;">
                    <div v-for="(idxes, key2) of map">
                        <!-- show the key params -->
                        <ParamsCard :data="conf_statics[key2][key]"></ParamsCard>
                        <!-- show containing checkpoints -->
                        <div v-if="idxes" style="display: flex; flex-direction: row;">
                            <div v-for="idx in idxes">{{ maps[key][key2][idx] }},</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <VChart :option="chartOptions" style="height: 400px; width: 400px; float: left;"></VChart> -->
        <!-- <ValidationsFigure :values="valid_values" style="height: 400px; width: 400px; float: left;"></ValidationsFigure> -->
        <div style="display: flex; flex-direction: row;" v-for="_maps of conf_statics">
            <ParamsCard :skipKeys="['model_name']" style="width: 200px;" v-for="v, k of _maps" :data="v" :title="k">
            </ParamsCard>
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
