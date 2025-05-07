import { useRoute, useRouter } from 'vue-router'

export function useAuthRedirect(defaultPath = '/') {
    const route = useRoute()
    const router = useRouter()

    const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : defaultPath

    function redirectAfterAuth() {
        router.replace(redirectPath)
    }

    return { redirectAfterAuth, redirectPath }
}
