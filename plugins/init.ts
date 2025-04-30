// plugins/init.ts
import {useCounter} from '~/store/counter'

export default defineNuxtPlugin(async (nuxtApp) => {
    const counter = useCounter();

    if (!counter.setting || Object.keys(counter.setting).length === 0) {
        try {
            const { data } = await useAsyncData('nav-config', () => get_nav_config())
            if (data._rawValue._rawValue.data) {
                counter.setting = data._rawValue._rawValue.data
                // 其他需要的操作，比如设置 navArray, colorMode 等
            }
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }
});
