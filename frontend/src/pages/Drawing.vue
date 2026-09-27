<template>
    <main>
        <h1>Drawing</h1>
        <DrawingCanvas 
            :strokes="strokes"   
            @drawing-update="drawingUpdate"
        />
        <button type="button" @click="saveDrawing">
            Save
        </button>
    </main>
</template>


<script setup lang="ts">
import DrawingCanvas from '../components/DrawingCanvas.vue'
import { ref, onMounted } from 'vue'
import type { Stroke } from '../types/drawing'

const strokes = ref<Stroke[]>([])
const drawingExists = ref(false)

onMounted(() => {
    loadDrawing()
})

// Get drawing if it already exists
async function loadDrawing() {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
        return
    }

    const user = JSON.parse(storedUser)

    const response = await fetch('http://localhost:3000/drawing', {
        headers: {
        'X-User-Id': String(user.id),
        },
    })

    if (response.status === 404) {
        console.log('Aucun dessin')
        return
    }

    const drawing = await response.json()
    drawingExists.value = true
    strokes.value = JSON.parse(drawing.data)
}

function drawingUpdate(newStrokes: Stroke[]) {
    strokes.value = newStrokes
}

async function saveDrawing() {

    // Get user
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
        return
    }
    const user = JSON.parse(storedUser)

    // Choose method wether drawing already exists or not
    const method = drawingExists.value ? 'PUT' : 'POST'

    // Save drawing
    const response = await fetch('http://localhost:3000/drawing', {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-User-Id': String(user.id),
        },
        body: JSON.stringify({
            data: JSON.stringify(strokes.value),
        }),
    })

    if (!response.ok) {
        console.error('Failed to save drawing')
        return
    }

    drawingExists.value = true
    console.log('Drawing saved')
}

</script>