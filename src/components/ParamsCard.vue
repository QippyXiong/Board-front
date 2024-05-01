<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    data: Object,
    title: String,
    hightLightKeys: {
        type: Array,
        default: () => []
    },
    skipKeys: {
        type: Array,
        default: () => []
    }
})

const tableData = ref([])

onMounted(() => {
    tableData.value = Object.keys(props.data).map(k => { return { key: k, value: props.data[k] } })
})

import { ElTable, ElTableColumn, ElCard } from 'element-plus';
</script>

<template>
    <div class="card">
        <div slot="header" style="font-size: 12px; font-weight: bold;">{{ title }}</div>
        <!-- <ElTable border :title="title" size="small" :show-header="false" :data="tableData">
            <ElTableColumn prop="key" label="Key"></ElTableColumn>
            <ElTableColumn prop="value" label="Value"></ElTableColumn>
        </ElTable> -->
        <div style="display: flex; flex-direction: row; max-height: 100px; overflow: auto;"  >
            <div style="text-align: right; width: 50%; box-sizing: border-box;">
                <div class="text" style="border-right: 1px solid;" v-for="key in Object.keys(props.data)" v-if="props.skipKeys.indexOf(key)==-1" :style="{ backgroundColor: ('#fa000033' ? props.hightLightKeys.indexOf(key) != -1 : 'inherent') }">{{ key }}</div>
            </div>
            <div style="text-align: left; width: 50%; box-sizing: border-box; padding-right: 5px; ">
                <div class="text" v-for="key in Object.keys(props.data)" v-if="props.skipKeys.indexOf(key)==-1"> {{props.data[key]}}</div>
            </div>  
        </div>
    </div>
</template>

<style scoped>
.card {
    font-size: 12px;
    border: 1px solid #c5c6c8;
    padding: 10px;
    border-radius: 5px;
}
.text {
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
}
</style>