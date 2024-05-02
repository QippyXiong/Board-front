<script lang="ts" setup>
import { withDefaults } from 'vue';

const props = withDefaults(defineProps<{
    data: Record<string, string | number>
    title?: string,
    hightLightKeys?: Array<string>,
    skipKeys?: Array<string>,
    noPadding?: boolean,
    noBorder?: boolean,
}>(), {
    title: () => '',
    hightLightKeys: () => [],
    skipKeys: () => [],
    noBorder: () => false,
    noPadding: () => false,
})

// const tableData: Ref<Array<{ key: string, value: any } >> = ref([])

// onMounted(() => {
//     tableData.value = Object.keys(props.data).map(k => { return { key: k, value: props.data[k] } })
// })

// import { ElTable, ElTableColumn, ElCard } from 'element-plus';

function formatParamValue(value: string | number) {
    if(typeof value == "number") {
        let abs_v = Math.abs(value)
        if((abs_v < 1e-1 && abs_v > 0) || abs_v >= 1e5) {
            return value.toExponential()
        }
    }
    return value
}

</script>

<template>
    <div class="card" 
     :style="{ padding: noPadding ? '0' : '10px', border: noBorder ? 'none': '1px solid #c5c6c8' }">
        <div slot="header" style="font-size: 12px; font-weight: bold;">{{ title }}</div>
        <!-- <ElTable border :title="title" size="small" :show-header="false" :data="tableData">
            <ElTableColumn prop="key" label="Key"></ElTableColumn>
            <ElTableColumn prop="value" label="Value"></ElTableColumn>
        </ElTable> -->
        <div style="display: flex; flex-direction: column; overflow: auto;">
            <template v-for="value, key of $props.data">
                <div v-if="props.skipKeys.indexOf(key) == -1" 
                     :class="'highlight' ? $props.hightLightKeys?.indexOf(key) != -1 : 'highlight' "
                     style="display: flex; flex-direction: row;">
                    <div style="text-align: right; width: 50%; box-sizing: border-box; padding-right: 5px">
                        <div class="text">{{ key }}</div>
                    </div>
                    <div style="text-align: left; width: 50%; box-sizing: border-box; padding-left: 5px; ">
                        <div class="text">{{ formatParamValue(value) }}</div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.highlight {
    background-color: #ad2d06;
}

.card {
    font-size: 12px;
    border-radius: 5px;
    /* max-height: 100px; */
    overflow: auto;
}

.text {
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
}
</style>