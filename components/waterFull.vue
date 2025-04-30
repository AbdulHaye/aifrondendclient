<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'


import {
    IconThumbUp,
    IconHeart,
    IconDownload,
    IconInfoCircle,
    IconCopy,
    IconStar
} from '@arco-design/web-vue/es/icon'
/*
  mode: JS
  使用JS获取每张图片宽高，结合relative和absolute定位计算每个图片的位置top，left，
  保证每张新的图片都追加在当前高度最小的那列末尾
  mode: CSS
  使用CSS的column-count和column-gap，实现简单，但图片顺序是每列从上往下排列
*/
onMounted(() => {
    window.addEventListener('resize', onPreload)
})

onUnmounted(() => {
    window.removeEventListener('resize', onPreload)

})

interface Image {
    title: string // 图片名称
    image: string // 图片地址
}
interface Props {
    images: Image[] // 图片数组
    columnCount?: number // 要划分的列数
    columnGap?: number // 各列之间的间隙
    width?: string|number // 瀑布流区域的总宽度
    backgroundColor?: string // 瀑布流区域背景填充色
    mode?: string // 瀑布流排列方式，可选：JS(js计算) CSS(css布局)
}
const props = withDefaults(defineProps<Props>(), {
    images: () => [],
    columnCount: 3,
    columnGap: 30,
    width: '100%',
    backgroundColor: '#F2F4F8',
    mode: 'JS'
})
const totalWidth = computed(() => {
    if (typeof props.width === 'number') {
        return props.width + 'px'
    } else {
        return props.width
    }
})

const imagesProperty = ref<any[]>([])
const preColumnHeight = ref<number[]>([]) // 每列的高度
const waterfall = ref()
const all_images = ref([])
const imageWidth = ref()
const draw_dialog = ref(false)
const draw_info = ref({})
const now_index = ref(0)
const draw_dialog_check = (item: any) => {
    now_index.value = item
    draw_info.value = props.images[now_index.value]
    const img = new Image()
    img.src = draw_info.value.image
    img.onload = () => {
        draw_info.value.width = img.width
        draw_info.value.height = img.height
    }

    if (draw_info.value.title.indexOf('v 5') !== -1) {
        draw_info.value.text_model = 'Midjourney'
    } else if(draw_info.value.title.indexOf('niji') !== -1){
        draw_info.value.text_model = 'Niji'
    }else{
        draw_info.value.text_model = 'Dall-E'
    }
    const suffix = draw_info.value.image.split('.').pop()
    draw_info.value.image_type = suffix

    draw_dialog.value = true
}
const change_nextor_prev = (type:any)=>{
    if (type=='prev'){
        if (now_index.value==0){
            now_index.value = props.images.length-1
        }else{
            now_index.value = now_index.value-1
        }
    }else{
        if (now_index.value==props.images.length-1){
            now_index.value = 0
        }else{
            now_index.value = now_index.value+1
        }
    }

    draw_info.value = props.images[now_index.value]
    const img = new Image()
    img.src = draw_info.value.image
    img.onload = () => {
        draw_info.value.width = img.width
        draw_info.value.height = img.height
    }

    if (draw_info.value.title.indexOf('v 5') !== -1) {
        draw_info.value.text_model = 'Midjourney'
    } else {
        draw_info.value.text_model = 'Niji'
    }
    const suffix = draw_info.value.image.split('.').pop()
    draw_info.value.image_type = suffix

    draw_dialog.value = true
}
const height = computed(() =>{
    return Math.max(...preColumnHeight.value) + props.columnGap
})
watch(
    () => props.images,
    (to) => {
        if (to.length && props.mode === 'JS') {
            onPreload()
        }
    })
onMounted(() => {
    if (props.images.length && props.mode === 'JS') {
        onPreload()
    }
})

function getPosition (i: number, height: number) { // 获取图片位置信息（top，left）
    if (i < props.columnCount) {
        preColumnHeight.value[i] = props.columnGap + height
        return {
            top: props.columnGap,
            left: (imageWidth.value + props.columnGap) * i + props.columnGap
        }
    } else {
        const top = Math.min(...preColumnHeight.value)
        var index = 0
        for (let n = 0; n < preColumnHeight.value.length; n++) {
            if (preColumnHeight.value[n] === top) {
                index = n
                break
            }
        }
        preColumnHeight.value[index] = top + props.columnGap + height
        return {
            top: top + props.columnGap,
            left: (imageWidth.value + props.columnGap) * index + props.columnGap
        }
    }
}
function onLoad (url: string, i: number) {
    return new Promise((resolve) => {
        const image = new Image()
        image.src = url
        image.onload = function () { // 图片加载完成时执行，此时可通过image.width和image.height获取到图片原始宽高
            var height = image.height / (image.width / imageWidth.value)
            imagesProperty.value[i] = { // 存储图片宽高和位置信息
                width: imageWidth.value,
                height: height,
                ...getPosition(i, height)
            }
            resolve('load')
        }
    })
}

async function onPreload () { // 计算图片宽高和位置（top，left）
    // 计算每列的图片宽度

    imageWidth.value = (waterfall.value.offsetWidth - (props.columnCount + 1) * props.columnGap) / props.columnCount
    const len = props.images.length
    imagesProperty.value.splice(len)
    for (let i = 0; i < len; i++) {
        all_images.value.push(props.images[i].image)
        await onLoad(props.images[i].image, i)
    }
}
const emit = defineEmits(['get_new_public']) // 定义emit

const send_drawlike = (id:number,type:any)=>{
    // 点赞或收藏
    draw_star({
        type:type,
        id:id
    }).then((res:any)=>{
        Message.success(res._rawValue.message)
        emit('get_new_public')
    }).catch((err:any)=>{
        console.log(err)
    })
}
const visible1 = ref(false)
import {Message} from "@arco-design/web-vue";
import ClipboardJS from "clipboard";
const onDownLoad = (imgsrc:any)=>{
    // 下载当前图片
    const image = new Image()
    image.src = imgsrc
    image.onload = function () {
        const a = document.createElement('a')
        a.href = imgsrc
        a.download = '图片'
        a.click()
    }
}
const code_copy = () => {
    navigator.clipboard.writeText(draw_info.value.title).then(() => {
        Message.success('复制成功')
    }, () => {
        Message.error('复制失败')
    });
}
</script>
<template>
    <div v-if="mode==='JS'" v-bind="$attrs" class="m-waterfall-js" ref="waterfall" :style="` width: ${totalWidth}; height: ${height}px;`">
        <client-only>
                <div class="item list-animation-bottomIn"
                     v-for="(property, index) in imagesProperty"
                     :key="index"
                    :class="'delay-'+index"
                     @click="draw_dialog_check(index)"
                >

                    <a-image
                        class="u-img"
                        :style="`width: ${imageWidth}px;top: ${property && property.top}px; left: ${property && property.left}px;`"
                        :src="images[index].image"
                        :zoom-rate="1.2"
                        :preview-src-list="all_images"
                        fit="fill"
                        :preview-visible="visible1"
                        @preview-visible-change="() => { visible1= false }"
                    >

                        <template #extra>
                            <div class="bottom_draw_info">
                                <h5 class="text-white text-truncate mb-1">{{images[index].name}}</h5>
                                <p class="text-white text-truncate mb-1 opacity-70">
                                    <a-avatar :size="24">
                                        <img :src="images[index].get_userinfo.avatar" />
                                    </a-avatar>
                                    <span class="ml-1">{{ images[index].get_userinfo.name }}</span>

                                </p>
                                <p class="text-white text-truncate opacity-70">{{images[index].created_at}}</p>

                            </div>
                            <div class="round_bottom">
                                <div class="num_info cursor-pointer mr-2" @click="send_drawlike(images[index].id,'star')">
                                    <icon-heart />
                                    <span class="ml-1">
                                        {{images[index].ai_drawlike_count}}
                                    </span>
                                </div>
                                <div class="num_info cursor-pointer" @click="send_drawlike(images[index].id,'like')">
                                    <icon-thumb-up />
                                    <span class="ml-1">
                                        {{images[index].like_count}}
                                    </span>
                                </div>
                            </div>
                            <!--<div class="actions">-->
                            <!--    <span class="action" @click="onDownLoad(images[index].image)"><icon-download /></span>-->
                            <!--    <a-tooltip :content="images[index].title">-->
                            <!--        <span class="action ml-1"><icon-info-circle /></span>-->
                            <!--    </a-tooltip>-->
                            <!--</div>-->
                        </template>
                        <template #loader>
                            <img
                                src="@/assets/images/pic_load.png"
                            />
                        </template>
                    </a-image>
                </div>

        </client-only>
    </div>
    <div v-if="mode==='CSS'" v-bind="$attrs" class="m-waterfall-css" :style="`background: ${backgroundColor}; width: ${totalWidth}; padding: ${columnGap}px; column-count: ${columnCount}; column-gap: ${columnGap}px;`">
        <div class="m-img" :style="`margin-bottom: ${columnGap}px;`" v-for="(item, index) in images" :key="index">
            <img class="u-img" :src="item.image" :title="item.title" :alt="item.title" />
        </div>
    </div>
    <a-modal :header=false :footer=false v-model:visible="draw_dialog" simple class="draws_dialog">
        <div class="flex draw_all_info h-100 overflow-hidden">
            <div class="left_draw_image text-center ">
                <a-image
                    :src="draw_info.image"
                />
                <div class="draw_dialog_left_point" @click="change_nextor_prev('prev')">
                    <div class="sc-cVtpRj dLvaiq" style="width: 28px; height: 28px; transform: rotate(180deg);">
                        <div class="baseIcon">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.02081 26.0416L21.0416 14.0208C16.3472 9.32639 13.7152 6.69442 9.02081 2"
                                      stroke="white" stroke-width="4"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="draw_dialog_right_point" @click="change_nextor_prev('next')">
                    <div class="sc-cVtpRj dLvaiq" style="width: 28px; height: 28px;">
                        <div class="baseIcon">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.02081 26.0416L21.0416 14.0208C16.3472 9.32639 13.7152 6.69442 9.02081 2"
                                      stroke="white" stroke-width="4"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right_draw_info p-4 flex-1">
                <h4>作品介绍</h4>
                <div class="flex right_all_info flex-column justify-between">
                    <div class="draw_info_item">
                        <div class="draw_dialog_card">
                            <div class="draw_dialog_card_title">
                                <h3>生成描述词</h3>
                                <div class="draw_dialog_card_icon"
                                     @click="code_copy()"
                                     style="width: 20px; height: 20px; position: relative; opacity: 0.5;">
                                    <icon-copy />
                                </div>
                            </div>
                            <p class="draw_dialog_card_des">
                                {{draw_info.title}}
                            </p>
                        </div>
                        <div class="draw_dialog_card">
                            <div class="draw_dialog_card_title">
                                <p>画面尺寸</p>
                                <p>
                                    {{draw_info.width}} x {{draw_info.height}}
                                </p>
                            </div>
                            <div class="draw_dialog_card_title">
                                <p>模型选择</p>
                                <p>
                                    {{draw_info.text_model}}
                                </p>
                            </div>
                            <div class="draw_dialog_card_title">
                                <p>图片后缀</p>
                                <p>
                                    {{draw_info.image_type}}
                                </p>
                            </div>
                            <div class="draw_dialog_card_title">
                                <p>日期</p>
                                <p>
                                    {{draw_info.created_at}}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="author_info">
                        <div class="bottom_draw_info">
                            <h3 class="text-truncate mb-2">{{draw_info.name}}</h3>
                            <p class="text-truncate mb-2">
                                <a-avatar :size="30">
                                    <img :src="draw_info.get_userinfo?draw_info.get_userinfo.avatar:''" />
                                </a-avatar>
                                <span class="ml-1">{{ draw_info.get_userinfo?draw_info.get_userinfo.name:'未命名' }}</span>

                            </p>
                            <a-button-group class="w-full mb-2">
                                <a-button class="flex-1" type="primary" status="danger"  @click="onDownLoad(draw_info.image)">
                                    <icon-download />
                                    下载
                                </a-button>
                                <a-button class="flex-1" type="primary" status="warning" @click="send_drawlike(draw_info.id,'star')">
                                    <icon-star />
                                    收藏 {{draw_info.ai_drawlike_count}}

                                </a-button>
                                <a-button class="flex-1" type="primary" status="success"  @click="send_drawlike(draw_info.id,'like')">
                                    <icon-thumb-up />
                                    点赞 {{draw_info.like_count}}
                                </a-button>
                            </a-button-group>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    </a-modal>
</template>
<style  scoped>

.m-waterfall-css .m-img .u-img {
    width: 100%;
    vertical-align: bottom;
}

.m-waterfall-js {
    position: relative;

}

.u-img {
    position: absolute;
    display: inline-block;
    object-fit: contain;
    vertical-align: bottom;
    border-radius: 6px;
    overflow: hidden;
}
</style>
