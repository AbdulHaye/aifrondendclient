import {useCounter} from '~/store/counter'
export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('token')
    const counter = useCounter()
    if (counter.setting.is_must_login=='1' && !token.value) {
        return navigateTo('/login')
    }
})
