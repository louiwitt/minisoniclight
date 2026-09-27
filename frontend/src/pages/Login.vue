<template>
    <main>
        <h1>Login</h1>

        <form @submit.prevent="login">
            <input
                id="username"
                v-model="username"
                type="text"
                placeholder="Enter your username!"
            />
            <button type="submit">
                Login
            </button>
        </form>
    </main>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const router = useRouter()

async function login() {
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        username: username.value,
        }),
    })

    const data = await response.json()

    console.log(data)

    // Store the user
    localStorage.setItem('user', JSON.stringify(data))

    // Get to the drawing page
    router.push('/drawing')
}


</script>