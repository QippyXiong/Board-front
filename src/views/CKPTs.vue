<script lang="ts" setup>
import { ref, onMounted, Ref, VueElement } from 'vue'

import ValidationsFigure from '@/components/ValidationsFigure.vue'


</script>

<template>
    <ValidationsFigure :values="valid_values" style="height: 400px; width: 400px; float: left;"></ValidationsFigure>
</template>