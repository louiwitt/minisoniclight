<template>
    <div class="drawing-canvas">
        <div class="toolbar">
            <label for="color">Color</label>

            <input
                id="color"
                v-model="brushColor"
                type="color"
            />

            <label for="width">Width</label>

            <input
                id="width"
                v-model.number="brushWidth"
                type="range"
                min="1"
                max="30"
            />

            <span>{{ brushWidth }} px</span>
        </div>

        <canvas
        ref="canvas"
        :width="width"
        :height="height"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        ></canvas>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Stroke } from '../types/drawing'

const canvas = ref<HTMLCanvasElement | null>(null)
let context: CanvasRenderingContext2D | null = null
const width = 500
const height = 500
let isDrawing = false
let lastX = 0
let lastY = 0

// Drawing settings 
const brushColor = ref('#8080ff') 
const brushWidth = ref(5)

const strokes = ref<Stroke[]>([])
let currentStroke: Stroke | null = null

// Get existing drawing from the page
const props = defineProps<{
    strokes: Stroke[]
}>()

// Send the drawing to the page
const emit = defineEmits<{
    drawingUpdate: [strokes: Stroke[]]
}>()

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
    context.lineWidth = brushWidth.value
    context.strokeStyle = brushColor.value

    drawStrokes(props.strokes)

})

// If takes time to get existing drawing 
watch(
    () => props.strokes,
    (newStrokes) => {
        drawStrokes(newStrokes)
    },
    { deep: true }
)

// Draw the strokes of an existing drawing
function drawStrokes(strokes: Stroke[]) {
    if (!context) {
        return
    }

    // Clear the canvas before drawing the existing one
    context.clearRect(0, 0, width, height)

    // Trace the strokes
    for (const stroke of strokes) {
        context.strokeStyle = stroke.color
        context.lineWidth = stroke.width

        // the stroke doesn't have any points
        if (stroke.points.length === 0) {
            continue
        }
        
        // Begin tracing the strokes
        context.beginPath()

        // Init the first point
        const firstPoint = stroke.points[0]
        if (!firstPoint) {
            continue
        }
        context.moveTo(firstPoint.x, firstPoint.y)

        // Add the following points
        for (const point of stroke.points.slice(1)) {
            context.lineTo(point.x, point.y)
        }

        context.stroke()
    }
}

function startDrawing(event: MouseEvent) {

    // get position of the mouse in the canvas
    const position = getMousePosition(event)

    if (!position) return

    // initialize x and y
    lastX = position.x
    lastY = position.y
    isDrawing = true

    // add to current stroke
    currentStroke = {
        color: brushColor.value,
        width: brushWidth.value,
        points: [position],
    }

    // store into strokes
    strokes.value.push(currentStroke)
}

function draw(event: MouseEvent) {
    if (!isDrawing || !canvas.value || !context || !currentStroke) {
        return
    }

    // get position of the mouse in the canvas
    const position = getMousePosition(event)

    if (!position) return

    // Draw
    context.strokeStyle = currentStroke.color 
    context.lineWidth = currentStroke.width
    context.beginPath()
    context.moveTo(lastX, lastY)
    context.lineTo(position.x, position.y)
    context.stroke()

    lastX = position.x
    lastY = position.y

    // push each new point in the current stroke
    currentStroke.points.push(position)
}

function stopDrawing() {
    isDrawing = false
    emit('drawingUpdate', strokes.value)
    currentStroke = null
}

function getMousePosition(event: MouseEvent) {
    if (!canvas.value) return null

    const rect = canvas.value.getBoundingClientRect()

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    }
}
</script>

<style scoped>
.drawing-canvas {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
}

canvas {
    display: block;
    border: 1px solid rgb(128, 128, 255);
}
</style>