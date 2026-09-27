
<template>
    <main>
        <h1>Admin</h1>

        <p v-if="error">
            {{ error }}
        </p>

        <p v-if="drawings.length === 0 && !error">
            No drawings found.
        </p>

        <div
            v-for="drawing in drawings"
            :key="drawing.id"
            >
            <h2>{{ drawing.username }}</h2>
            <DrawingDisplay
                :strokes=parseStrokes(drawing.data)
            />
            <p>
                Drawing #{{ drawing.id }}
            </p>
        </div>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DrawingDisplay from '../components/DrawingDisplay.vue'
import type { Stroke } from '../types/drawing'
import type { Drawing } from '../types/drawing'

const drawings = ref<Drawing[]>([])
const error = ref('')

onMounted(() => {
    loadDrawings()
})

function parseStrokes(data: string): Stroke[] {
    return JSON.parse(data)
}

async function loadDrawings() {
    // Check admin role
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
        error.value = 'You are not logged in'
        return
    }
    const user = JSON.parse(storedUser)
    if (user.role !== 'admin') {
        error.value = 'Admin access required'
        return
    }

    // Get all drawings
    const response = await fetch(
        'http://localhost:3000/admin/drawings',
        {
        headers: {
            'X-User-Id': String(user.id),
        },
        },
    )

    const data = await response.json()

    if (!response.ok) {
        error.value = data.error ?? 'Failed to load drawings'
        return
    }
    drawings.value = data
}
</script>