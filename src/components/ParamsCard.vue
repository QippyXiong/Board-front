<script lang="ts" setup>
import { withDefaults } from 'vue';

const props = withDefaults(defineProps<{
    data: Record<string, string | number>
    title?: string,
    hightLightKeys: Array<string>,
    skipKeys?: Array<string>
}>(), {
    title: () => '',
    hightLightKeys: () => [],
    skipKeys: () => []
})

// const tableData: Ref<Array<{ key: string, value: any } >> = ref([])

// onMounted(() => {
//     tableData.value = Object.keys(props.data).map(k => { return { key: k, value: props.data[k] } })
// })

// import { ElTable, ElTableColumn, ElCard } from 'element-plus';

</script>

<template>
    <div class="card">
        <div slot="header" style="font-size: 12px; font-weight: bold;">{{ title }}</div>
        <!-- <ElTable border :title="title" size="small" :show-header="false" :data="tableData">
            <ElTableColumn prop="key" label="Key"></ElTableColumn>
            <ElTableColumn prop="value" label="Value"></ElTableColumn>
        </ElTable> -->
        <div style="display: flex; flex-direction: row; max-height: 100px; overflow: auto;">
            <template v-for="value, key of $props.data">
                <div v-if="props.skipKeys.indexOf(key) == -1" 
                     :class="'highlight' ? $props.hightLightKeys?.indexOf(key) != -1 : 'highlight' ">
                    <div style="text-align: right; width: 50%; box-sizing: border-box;">
                        <div class="text">{{ key }}</div>
                    </div>
                    <div style="text-align: left; width: 50%; box-sizing: border-box; padding-right: 5px; ">
                        <div class="text">{{ value }}</div>
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