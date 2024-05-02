<script lang="ts" setup>

</script>

<template>
    <div class="view-root">
        <div style="width: 100%; height: 100%; position: relative;">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<style scoped>
.view-root {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
}
</style>