<template>
    <main>
        <h1>Drawing</h1>
        <DrawingCanvas />
    </main>
</template>


<script setup lang="ts">
import DrawingCanvas from '../components/DrawingCanvas.vue'
import { onMounted } from 'vue'


onMounted(() => {
  loadDrawing()
})


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

    console.log(drawing)
}

</script>