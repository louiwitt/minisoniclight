<template>
    <canvas
        ref="canvas"
        :width="width"
        :height="height"
        style="border: 1px solid white"
    ></canvas>
</template>



<script setup lang="ts">
import { ref, onMounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const width = 500
const height = 500


onMounted(() => {
    if (!canvas.value) {
        return
    }
    const context = canvas.value.getContext('2d')
    if (!context) {
        return
    }
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = 3
    context.strokeStyle = '#000000'
})



</script>
