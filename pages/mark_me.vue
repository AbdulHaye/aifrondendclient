<template>
    <div class="mark-swoole flex w-full">
        <div style="width: 330px; margin-left: 1px;"
             class="relative pt-4 py-3flex h-full flex-col bg-[#fafbfc] draw-list-left flex justify-content-between pb-0"
        >

            <div class="ai-writer__left-panel p-2 overflow-auto">
                <div class="editor-panel__title-wrap"><h4 class="editor-panel__title">思维导图</h4></div>

                <div class="left-panel-setting-block">
                    <div class="left-panel-setting-block__header">
                        <div class="left-panel-setting-block__title fs-5"> 帮我写</div>
                    </div>
                    <a-textarea
                        v-model="mark_ai"
                        :auto-size="{ minRows: 3, maxRows: 5 }"
                        placeholder="请输入简单的描述，AI将智能输出markdown内容"
                    />
                    <div v-if="counter.setting.ai_mark_online=='1'" class="flex items-center justify-between space-x-2 mt-2">
                      <span class="w-[70px]">联网查询</span>
                      <div class="flex items-center">
                        <div class="flex-1">
                          <a-switch v-model="Is_online" />
                        </div>
                        <a-tooltip content="参数释义：可通过联网精准数据">
                          <icon-exclamation-circle class="font-18 ml-1"/>
                        </a-tooltip>
                      </div>

                    </div>
                    <a-button type="primary" class="w-100 mt-2 mb-2" :loading="up_des_load" @click="send_siwei()">
                        生成思维导图描述
                    </a-button>
                    <div class="left-panel-setting-block__header">
                        <div class="left-panel-setting-block__title fs-5"> 内容需求</div>
                        <div class="ai-writer__panel-section__optional fs-6 cursor-pointer" @click="insertC()">
                            试试示例
                        </div>
                    </div>
                    <a-textarea
                        v-model="mark_value"
                        :auto-size="{ minRows: 10, maxRows: 20 }"
                        placeholder="请输入markdown的内容"
                    />
                </div>
            </div>

            <div class="left-panel-footer  p-2">
                <div class="left-panel-footer__tips mb-2">
                    <div class="left-panel-footer__spend-tip">
                        <svg t="1690301472439" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6949" width="24" height="24"><path d="M366 174h292a10 10 0 0 1 10 10v322a10 10 0 0 1-10 10H366a10 10 0 0 1-10-10V184a10 10 0 0 1 10-10z" fill="#4988FD" p-id="6950"></path><path d="M658 546H366c-22.056 0-40-17.944-40-40V184c0-22.056 17.944-40 40-40h292c22.056 0 40 17.944 40 40v322c0 22.056-17.944 40-40 40z m-272-60h252V204H386v282z" fill="#4988FD" p-id="6951"></path><path d="M507.582 304.244a4 4 0 0 1 7.188 0l86.972 178.018c0.586 1.2 1.734 2.03 201.152 28.936a4.002 4.002 0 0 1 2.216 6.87l-144.304 136.648a4.006 4.006 0 0 0-1.184 3.622l35.488 194.43a3.998 3.998 0 0 1-5.798 4.252l-176.244-93.506a4 4 0 0 0-3.75 0l-176.252 93.508a4 4 0 0 1-5.802-4.252l35.478-194.43a4.006 4.006 0 0 0-1.184-3.622l-144.304-136.648a4.002 4.002 0 0 1 2.216-6.868c199.416-26.912 200.564-27.736 201.152-28.938l86.96-178.02z" fill="#DFECFD" p-id="6952"></path><path d="M331.204 887.48a33.92 33.92 0 0 1-30.082-18.148 34.15 34.15 0 0 1-3.376-21.91l32.956-180.61-134.074-126.96c-13.616-12.902-14.196-34.464-1.302-48.074a34.1 34.1 0 0 1 20.136-10.308c104.136-14.054 161.49-21.976 184.632-25.53l80.534-164.864c5.66-11.588 17.654-19.078 30.552-19.078 5.146 0 10.31 1.196 14.936 3.458a34.138 34.138 0 0 1 15.618 15.634l80.54 164.848c23.146 3.554 80.498 11.476 184.634 25.528 18.572 2.502 31.652 19.656 29.15 38.234a34.138 34.138 0 0 1-10.318 20.146l-134.074 126.962 32.958 180.568a33.782 33.782 0 0 1-5.506 25.47 33.778 33.778 0 0 1-21.896 14.086c-7.242 1.318-15.208 0.138-21.874-3.368l-164.154-87.09-164.068 87.042a34.19 34.19 0 0 1-15.922 3.964z m-53.87-353.836l104.852 99.29a33.896 33.896 0 0 1 10.072 30.78l-25.848 141.656 128.848-68.36c9.79-5.19 22.078-5.184 31.85-0.01l128.854 68.364-25.852-141.64a33.904 33.904 0 0 1 10.052-30.778l104.868-99.302c-61.762-8.382-100.142-13.708-121.64-16.872-12.33-1.814-19.714-3.004-23.946-3.858-4.89-0.986-17.88-3.608-24.658-17.488l-63.608-130.192-63.6 130.196c-6.788 13.88-19.772 16.498-24.66 17.484-4.228 0.854-11.612 2.042-23.946 3.856-21.464 3.158-59.842 8.484-121.638 16.874z" fill="#DFECFD" p-id="6953"></path><path d="M418 651a29.9 29.9 0 0 1-21.212-8.788l-66-66c-11.716-11.714-11.716-30.71 0-42.426 11.714-11.714 30.71-11.714 42.426 0l66 66c11.716 11.714 11.716 30.71 0 42.426A29.908 29.908 0 0 1 418 651z" fill="#4988FD" p-id="6954"></path></svg>消耗{{ siwei_limit }}{{counter.setting.money_name_set}}/会员{{counter.setting.mark_siwei_limit}}次
                    </div>
                    <div class="disclaimer">
                        <div class="disclaimer">
                            <a-tooltip
                                class="box-item"
                                effect="dark"
                                placement="top"
                            >
                                <template #content> 您应当合法合规使用本服务，并承担由此产生的所有责任。<br/>本服务生成的作品仅供个人学习交流使用，不可用于商业用途<br/>对您的使用不做保证且不承担任何责任。
                                </template>
                                <div class="d-sm-flex align-items-center">
                                    <svg role="img" aria-label="warning" focusable="false" data-icon="warning"
                                         aria-hidden="true" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg"
                                         class="gd_design_icon  gd_design_icon-warning">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM11.25 14V7H12.75V14H11.25ZM11.25 17V15.5H12.75V17H11.25Z"
                                              fill="currentColor"></path>
                                    </svg>
                                    免责声明
                                </div>

                            </a-tooltip>
                        </div>
                    </div>
                </div>
                <div class="left-panel-footer__button-group">
                    <a-button-group>
                        <a-button @click="saveHtml()" type="primary" size="large" :disabled="send_load">导出HTML
                        </a-button>
                        <a-button @click="savePNG()" type="primary" status="warning" size="large" :disabled="send_load">导出PNG
                        </a-button>
                        <a-button @click="saveJPG()" type="primary" status="danger" size="large" :disabled="send_load">导出JPG
                        </a-button>
                    </a-button-group>
                </div>
            </div>

        </div>
        <div class="editor-panel__content flex-1 mark_ai">
            <div class="main xl:pb-0 ai-siwei">
                <!--header-->
                <div class="ai-header" style="top: 0px; height: 60px;">
                    <div class="ai-header__left" @click="change_drawer()">
                        <icon-menu-unfold size="24"/>
                    </div>
                    <div class="ai-header__logo ai-header__logo--mobile"><span><a class="ai-header__link"><img
                        :src="counter.setting.logo" style="width: 40px;"></a></span>
                    </div>
                    <div class="ai-header__right">
                        <div class="ai-page__right">
                            <div placement="bottomRight">
                                <div>
                                    <div>
                                        <a-tooltip class="item" effect="dark" :content="counter.setting.money_name_set+'：'+user_balance"
                                                   placement="bottom">
                                            <div class="creation"><img
                                                src="@/assets/images/header_jifen.png"
                                                class="creation-count__icon">
                                            </div>
                                        </a-tooltip>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <!--new mark me-->
                <div class="editor-panel">
                    <div class="editor-panel__right-panel">
                        <div class="ai-generate-area">
                            <div class="generate-result-area">
                                <div class="generate-result-area__container">
                                    <div class="generate-empty absolute" v-show="!mark_value"><img
                                        src="@/assets/images/siwei.svg"
                                        class="generate-empty__img">
                                        <div class="generate-empty__title">暂无思维导图生成</div>
                                        <div class="generate-empty__desc">快去左侧输入你的思维描述吧~</div>
                                    </div>


                                  <div class="relative h-full w-full">
                                    <mindmap :key="dataKey"
                                             v-model="data"
                                             :ctm="true"
                                             :edit="true"
                                             :drag="true"
                                             :zoom="true"
                                             :timetravel="true"
                                    ></mindmap>
                                    </div>


                                    <div
                                        class="generate-result-area__text-input-area generate-result-area__text-input-area--result"
                                        style="display: none;"><textarea readonly="readonly"></textarea></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <a-drawer
                    v-model:visible="drawer"
                    title="配置"
                    placement="left"
                    class="left_siwei"
                    width="80%"
                >
                    <div class="editor-panel__title-wrap p-2"><h4 class="editor-panel__title">思维导图</h4></div>
                    <div class="ai-writer__left-panel p-2 overflow-auto">
                        <div class="left-panel-setting-block">
                            <div class="left-panel-setting-block__header">
                                <div class="left-panel-setting-block__title fs-5"> 帮我写</div>
                            </div>
                            <a-textarea
                                v-model="mark_ai"
                                :auto-size="{ minRows: 3, maxRows: 5 }"
                                placeholder="请输入简单的描述，AI将智能输出markdown内容"
                            />
                            <a-button type="primary" class="w-100 mt-2 mb-2" :loading="up_des_load" @click="send_siwei()">
                                生成思维导图描述
                            </a-button>
                            <div class="left-panel-setting-block__header">
                                <div class="left-panel-setting-block__title fs-5"> 内容需求</div>
                                <div class="ai-writer__panel-section__optional fs-6 cursor-pointer" @click="insertC()">
                                    试试示例
                                </div>
                            </div>
                            <a-textarea
                                v-model="mark_value"
                                :auto-size="{ minRows: 10, maxRows: 20 }"
                                placeholder="请输入markdown的内容"
                            />
                        </div>
                    </div>
                    <template #footer>
                        <div class="left-panel-footer  p-2">
                            <div class="left-panel-footer__tips mb-2">
                                <div class="left-panel-footer__spend-tip"><svg t="1690301472439" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6949" width="24" height="24"><path d="M366 174h292a10 10 0 0 1 10 10v322a10 10 0 0 1-10 10H366a10 10 0 0 1-10-10V184a10 10 0 0 1 10-10z" fill="#4988FD" p-id="6950"></path><path d="M658 546H366c-22.056 0-40-17.944-40-40V184c0-22.056 17.944-40 40-40h292c22.056 0 40 17.944 40 40v322c0 22.056-17.944 40-40 40z m-272-60h252V204H386v282z" fill="#4988FD" p-id="6951"></path><path d="M507.582 304.244a4 4 0 0 1 7.188 0l86.972 178.018c0.586 1.2 1.734 2.03 201.152 28.936a4.002 4.002 0 0 1 2.216 6.87l-144.304 136.648a4.006 4.006 0 0 0-1.184 3.622l35.488 194.43a3.998 3.998 0 0 1-5.798 4.252l-176.244-93.506a4 4 0 0 0-3.75 0l-176.252 93.508a4 4 0 0 1-5.802-4.252l35.478-194.43a4.006 4.006 0 0 0-1.184-3.622l-144.304-136.648a4.002 4.002 0 0 1 2.216-6.868c199.416-26.912 200.564-27.736 201.152-28.938l86.96-178.02z" fill="#DFECFD" p-id="6952"></path><path d="M331.204 887.48a33.92 33.92 0 0 1-30.082-18.148 34.15 34.15 0 0 1-3.376-21.91l32.956-180.61-134.074-126.96c-13.616-12.902-14.196-34.464-1.302-48.074a34.1 34.1 0 0 1 20.136-10.308c104.136-14.054 161.49-21.976 184.632-25.53l80.534-164.864c5.66-11.588 17.654-19.078 30.552-19.078 5.146 0 10.31 1.196 14.936 3.458a34.138 34.138 0 0 1 15.618 15.634l80.54 164.848c23.146 3.554 80.498 11.476 184.634 25.528 18.572 2.502 31.652 19.656 29.15 38.234a34.138 34.138 0 0 1-10.318 20.146l-134.074 126.962 32.958 180.568a33.782 33.782 0 0 1-5.506 25.47 33.778 33.778 0 0 1-21.896 14.086c-7.242 1.318-15.208 0.138-21.874-3.368l-164.154-87.09-164.068 87.042a34.19 34.19 0 0 1-15.922 3.964z m-53.87-353.836l104.852 99.29a33.896 33.896 0 0 1 10.072 30.78l-25.848 141.656 128.848-68.36c9.79-5.19 22.078-5.184 31.85-0.01l128.854 68.364-25.852-141.64a33.904 33.904 0 0 1 10.052-30.778l104.868-99.302c-61.762-8.382-100.142-13.708-121.64-16.872-12.33-1.814-19.714-3.004-23.946-3.858-4.89-0.986-17.88-3.608-24.658-17.488l-63.608-130.192-63.6 130.196c-6.788 13.88-19.772 16.498-24.66 17.484-4.228 0.854-11.612 2.042-23.946 3.856-21.464 3.158-59.842 8.484-121.638 16.874z" fill="#DFECFD" p-id="6953"></path><path d="M418 651a29.9 29.9 0 0 1-21.212-8.788l-66-66c-11.716-11.714-11.716-30.71 0-42.426 11.714-11.714 30.71-11.714 42.426 0l66 66c11.716 11.714 11.716 30.71 0 42.426A29.908 29.908 0 0 1 418 651z" fill="#4988FD" p-id="6954"></path></svg> 消耗{{ siwei_limit }}{{counter.setting.money_name_set}}/会员{{counter.setting.mark_siwei_limit}}次
                                </div>
                                <div class="disclaimer">
                                    <div class="disclaimer">
                                        <a-tooltip
                                            class="box-item"
                                            effect="dark"
                                            placement="top"
                                        >
                                            <template #content> 您应当合法合规使用本服务，并承担由此产生的所有责任。<br/>本服务生成的作品仅供个人学习交流使用，不可用于商业用途<br/>对您的使用不做保证且不承担任何责任。
                                            </template>
                                            <div class="d-sm-flex align-items-center">
                                                <svg role="img" aria-label="warning" focusable="false" data-icon="warning"
                                                     aria-hidden="true" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                     class="gd_design_icon  gd_design_icon-warning">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                          d="M20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM11.25 14V7H12.75V14H11.25ZM11.25 17V15.5H12.75V17H11.25Z"
                                                          fill="currentColor"></path>
                                                </svg>
                                                免责声明
                                            </div>

                                        </a-tooltip>
                                    </div>
                                </div>
                            </div>
                            <div class="left-panel-footer__button-group">
                                <a-button-group>
                                    <a-button @click="saveHtml()" type="primary" size="large" :disabled="send_load">导出HTML
                                    </a-button>
                                    <a-button @click="savePNG()" type="primary" status="warning" size="large"
                                              :disabled="send_load">导出PNG
                                    </a-button>
                                    <a-button @click="saveJPG()" type="primary" status="danger" size="large"
                                              :disabled="send_load">导出JPG
                                    </a-button>
                                </a-button-group>

                            </div>
                        </div>

                    </template>

                </a-drawer>
                <!--end-->
            </div>
        </div>
        <Login :login_dialog="login_dialog" @handleCancel="handleCancel"/>
    </div>

</template>
<script setup lang="ts">
import {ref} from "vue";
import {Message} from "@arco-design/web-vue";

import html2canvas from 'html2canvas';
import fileSaver from 'file-saver';
import {useCounter} from '~/store/counter'
import {IconExclamationCircle, IconMenuUnfold} from "@arco-design/web-vue/es/icon";
import mindmap from 'vue3-mindmap'
import 'vue3-mindmap/dist/style.css'

definePageMeta({
  middleware: ['mustlogin']
})
const counter = useCounter()


useHead({
    title: '思维导图 - '+counter.setting.title,
    meta: [
        { name: 'description', content: counter.setting.description},
        { name: 'keywords', content: counter.setting.keywords}
    ]
})
const mark_value = ref(counter.setting.siwei_example) as any;


function parseMarkdown(markdown) {
  if (markdown){
    const lines = markdown.trim().split('\n');
    const root = { name: '', children: [] };
    let stack = [{ node: root, indent: -1 }];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      const indent = line.match(/^\s*/)[0].length;

      if (trimmedLine.startsWith('#')) {
        const level = trimmedLine.match(/^#+/)[0].length;
        const node = { name: trimmedLine.substring(level).trim(), children: [] };

        while (stack.length > 0 && stack[stack.length - 1].indent >= level) {
          stack.pop();
        }

        stack[stack.length - 1].node.children.push(node);
        stack.push({ node, indent: level });
      } else if (trimmedLine.startsWith('- ')) {
        const node = { name: trimmedLine.substring(2).trim(), children: [] };

        while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
          stack.pop();
        }

        stack[stack.length - 1].node.children.push(node);
        stack.push({ node, indent });
      }
    });

    // 如果根节点的 children 只有一个元素，并且这个元素有 children，则提升这个元素为根节点
    if (root.children.length === 1 && root.children[0].children) {
      return [root.children[0]];
    }
    return [root];

  }else{
    return [{
      "name":"如何学习D3",
      "children": [
        {
          "name":"预备知识",
          "children": [
            { "name":"HTML & CSS" },
            { "name":"JavaScript" },
          ]
        },
        {
          "name":"安装",
          "collapse": true,
          "children": [ { "name": "折叠节点" } ]
        },
        { "name":"进阶", "left": true },
      ]
    }]
  }



}

let data = ref(parseMarkdown(mark_value.value));
const dataKey = ref(0);



// 监听 mark_value 的变化
watch(mark_value, (newVal, oldVal) => {
  if (newVal !== '') {
    data.value = parseMarkdown(newVal);
    dataKey.value++; // 更新 key 强制刷新组件
  }
});



const login_dialog = ref(false)
const handleCancel = () => {
    login_dialog.value = false
}
const insertC = () => {
    mark_value.value = counter.setting.siwei_example;
}
const send_load = ref(false)
const up_des_load = ref(false)
const drawer = ref(false)
const mark_ai = ref('')
const saveHtml = () => {
  if (!token.value){
    login_dialog.value = true
    return false;
  }
    send_load.value = true
    send_siwei_html().then(res => {
        const svg = document.querySelector('#markmap');
        let html = svg.outerHTML;
        html += '<style>#markmap{height:100vh;width:100%}</style>';
        const blob = new Blob([html], {type: 'text/html'});
        const a = document.createElement('a');
        a.download = 'markmap.html';
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
        get_user_balance()
        send_load.value = false
        Message.success(res._rawValue.message)
    }).catch(err => {
        send_load.value = false
        console.log(err)
    })
}
const colorMode = useColorMode()

const savePNG = async () => {
  if (!token.value){
    login_dialog.value = true
    return false;
  }
    send_load.value = true
    send_siwei_html().then(async res => {
        const svg = document.querySelector('.generate-result-area__container');
        const html = svg.outerHTML;

        if (colorMode.preference == 'dark') {
            svg.style.backgroundColor = 'black';
        } else if (colorMode.preference == 'light'){
            svg.style.backgroundColor = '#fff';
        }
        const canvas = await html2canvas(<HTMLElement>svg); // 将SVG转换成Canvas元素
        canvas.toBlob((blob) => { // 将Canvas元素转换成Blob对象
            fileSaver.saveAs(blob, 'md.png'); // 使用file-saver库保存为PNG格式的图片文件
        });
        get_user_balance()
        send_load.value = false
        Message.success(res._rawValue.message)
    }).catch(err => {
        send_load.value = false
        console.log(err)
    })
}

const saveJPG = async () => {
  if (!token.value){
    login_dialog.value = true
    return false;
  }
    send_load.value = true
    send_siwei_html().then(async res => {

        const svg = document.querySelector('.generate-result-area__container');
        const html = svg.outerHTML;
        if (colorMode.preference == 'dark') {
            svg.style.backgroundColor = 'black';
        } else if (colorMode.preference == 'light'){
            svg.style.backgroundColor = '#fff';
        }
        const canvas = await html2canvas(<HTMLElement>svg); // 将SVG转换成Canvas元素
        canvas.toBlob((blob) => { // 将Canvas元素转换成Blob对象
            fileSaver.saveAs(blob, 'md.jpg'); // 使用file-saver库保存为PNG格式的图片文件
        });
        get_user_balance()
        send_load.value = false
        Message.success(res._rawValue.message)
    }).catch(err => {
        send_load.value = false
        console.log(err)
    })
}
const siwei_limit = ref(0)
const user_balance = ref(0)
const get_user_balance = () => {
    get_siwei_limit().then(res => {
        siwei_limit.value = res._rawValue.siwei
        user_balance.value = res._rawValue.data
    })
}
get_user_balance()
const change_drawer = () => {
    drawer.value = true
}
const token = useCookie('token')
const {public: {baseUrl}} = useRuntimeConfig()
const headers = {
    'Authorization': `Bearer ${token.value}`,
    'Accept': 'text/event-stream',
}
const isInvalidJSON = (data:string)=> {
  try {
    JSON.parse(data);
    return true; // 解析成功，是错误的 JSON 数据
  } catch (error) {
    return false; // 解析失败，不是错误的 JSON 数据
  }
}
const streams = ref()
const last_content = ref('')
const Is_online = ref(false)
const send_siwei = async () => {
    if (mark_ai.value == '') {
        Message.error('请输入内容')
        return false
    }
    if (!token.value){
      login_dialog.value = true
      return false;
    }
    mark_value.value = ''
    last_content.value = ''
    up_des_load.value = true
    const res = await fetch(`${window.APP_CONFIG.baseUrl}siwei_send`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            content: mark_ai.value,
            is_online: Is_online.value,
            type: 'siwei'
        }),

    })

    if (res.status == 500) {
        up_des_load.value = false
        Message.error('服务器错误')
        return false
    }
    if (res.status == 401) {
        up_des_load.value = false
        Message.error('请先登录')
        return false
    }
    if (res.status == 402) {
        up_des_load.value = false
        Message.error('发送次数已达上限或余额不足')
        return false
    }
    if (res.status == 403) {
        up_des_load.value = false
        Message.error('禁止发送违禁词')
        return false
    }
    let partialData = '';
    const stream = res.body?.getReader();
    const onData = ({value}: { value: Uint8Array }) => {
      const chunk = new TextDecoder().decode(value);
      if (isInvalidJSON(chunk)) {
        const json = JSON.parse(chunk);
        if (json.error && json.error.message) {
          Message.error(json.error.message);
          return; // 或者进行其他错误处理
        }
        return;
      }
      const lines = (partialData + chunk).split('\n');

      partialData = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === 'data: [DONE]') {
          // 如果是最后一行，跳过处理
          continue;
        }

        try {
          const trimmedLine = line.trim(); // 去除行首尾的空格
          if (trimmedLine.startsWith('data:')) {
            const jsonData = trimmedLine.slice(5); // 去除 "data:" 前缀
            const json = JSON.parse(jsonData);
            if (json.choices) {
              for (const choice of json.choices) {
                const content = choice.delta?.content;
                if (content) {
                  last_content.value = content
                  mark_value.value += content
                }
                if (choice.finish_reason === 'stop') {
                  break;
                }
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    };


    const read = async () => {
        const result = await stream?.read();
        if (result?.done) {
            up_des_load.value = false
            mark_ai.value = ''
            console.log('done')

        } else {
            onData(result!);
            await read();
        }
    };
    await read();
}
</script>
<style scoped>

</style>
