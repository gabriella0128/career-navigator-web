import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import { showError, createError } from '#app'

export const handleApiError = (status: number, message: string, url: string) => {
    const auth = useAuth()
    const router = useRouter()

    switch (status) {
        case 401:
            auth.removeToken()
            if (url.startsWith('/admin')) {
                router.push({ name: "admin/login" })
            } else {
                router.push({ name: "login" })
            }
            break
        case 403:
            auth.removeToken()
            showError(createError({
                statusCode: status,
                message,
                fatal: true
            }))
            break
    }
}