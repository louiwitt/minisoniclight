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
            <p v-if="isAdminUsername">
                this username is reserved :)
            </p>
            <button
                type="submit"
                :disabled="isAdminUsername"
            >
                Login
            </button>
        </form>
        <button
            type="button"
            class="secret-button"
            @click="openAdmin"
            aria-label="Admin"
            >
            A
        </button>
    </main>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const router = useRouter()

const isAdminUsername = computed(() => {
    return username.value.trim() === 'SuperSecretAdmin'
})


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

    // Store the user
    localStorage.setItem('user', JSON.stringify(data))

    // Get to the drawing page
    router.push('/drawing')
}


async function openAdmin() {
    // Get the id of the SuperSecretAdmin
    const response = await fetch('http://localhost:3000/admin/id')
    const admin = await response.json()

    // Store the SuperSecretAdmin user
    localStorage.setItem(
        'user',
        JSON.stringify({
            id: admin.id,
            username: 'SuperSecretAdmin',
            role: 'admin',
        }),
    )
    
    // Get to the page Admin
    router.push('/admin')
}

</script>


<style scoped>
    main {
        position: relative;
    }

    .secret-button {
        position: fixed;
        right: 20px;
        bottom: 20px;

        width: 32px;
        height: 32px;

        padding: 0;

        border: none;
        border-radius: 50%;

        background: #eeeeee;
        color: #666666;

        cursor: pointer;
    }

    .secret-button:hover {
        background: #dddddd;
        color: #222222;
    }
</style>