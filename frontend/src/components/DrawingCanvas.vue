<template>
    <canvas
        ref="canvas"
        :width="width"
        :height="height"
        style="border: 1px solid white"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
    ></canvas>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let context: CanvasRenderingContext2D | null = null
const width = 500
const height = 500
let isDrawing = false
let lastX = 0
let lastY = 0

onMounted(() => {
    if (!canvas.value) {
        return
    }
    context = canvas.value.getContext('2d')
    if (!context) {
        return
    }
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = 3
    context.strokeStyle = '#000000'
})


function startDrawing(event: MouseEvent) {
    if (!canvas.value) {
        return
    }

    // Position of the canvas
    const rect = canvas.value.getBoundingClientRect()

    // Position x, y in the canvas
    lastX = event.clientX - rect.left
    lastY = event.clientY - rect.top
    isDrawing = true
}

function draw(event: MouseEvent) {
    if (!isDrawing || !canvas.value || !context) {
        return
    }

    // Position of the canvas
    const rect = canvas.value.getBoundingClientRect()

    // Position x, y in the canvas
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Draw
    context.beginPath()
    context.moveTo(lastX, lastY)
    context.lineTo(x, y)
    context.stroke()
    
    lastX = x
    lastY = y
}

function stopDrawing() {
    isDrawing = false
}

</script>
