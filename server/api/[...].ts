// @ts-ignore
import {joinURL} from "ufo";
// @ts-ignore
import {proxyRequest} from "h3";

export default defineEventHandler(async (event) =>{
    const proxyUrl = useRuntimeConfig().public.baseUrl
    const path = event.path.replace(/^\/api\//,'')
    const target = joinURL(proxyUrl,path)
    return proxyRequest(event,target)
})
