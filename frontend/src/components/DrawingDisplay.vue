<template>
    <canvas
        ref="canvas"
        :width="width"
        :height="height"
    ></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Stroke } from '../types/drawing'

const props = defineProps<{
    strokes: Stroke[]
}>()

const canvas = ref<HTMLCanvasElement | null>(null)

// Same size as drawing canvas
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
    
    // Trace the strokes
    context.lineCap = 'round'
    context.lineJoin = 'round'

    for (const stroke of props.strokes) {
        if (stroke.points.length === 0) {
            continue
        }

        // Init first point
        const firstPoint = stroke.points[0]
        if (!firstPoint) {
            continue
        }
        context.strokeStyle = stroke.color
        context.lineWidth = stroke.width
        context.beginPath()
        context.moveTo(firstPoint.x, firstPoint.y)

        // Add all other points
        for (const point of stroke.points.slice(1)) {
            context.lineTo(point.x, point.y)
        }

        context.stroke()
    }
})
</script>


<style scoped>
canvas {
    display: block;
    border: 1px solid rgb(128, 128, 255);
}
</style>