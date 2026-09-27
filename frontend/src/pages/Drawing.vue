<template>
    <main>
        <h1>Drawing</h1>
        <DrawingCanvas :strokes="strokes"/>
    </main>
</template>


<script setup lang="ts">
import DrawingCanvas from '../components/DrawingCanvas.vue'
import { ref, onMounted } from 'vue'
import type { Stroke } from '../types/drawing'

const strokes = ref<Stroke[]>([])

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

    strokes.value = JSON.parse(drawing.data)
}

</script>