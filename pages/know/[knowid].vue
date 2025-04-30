<template>
    <a-spin :loading="create_load">
        <main class="main overflow-auto ai-knowledge">
            <div class="header pb-2 pt-5 flex justify-content-center align-items-center">
                    <img :src="now_info.avatar" alt="" class="w-10">
                    <h6 class="mb-0 ml-1 text-truncate text-center">{{ now_info.title }}</h6>
                </div>
            <div class="vh-100 overflow-hidden rounded bg-white shadow-sm m-6 p-0">

                <div class="know_information">
                    <div class="h-100 flex sidebar_left_tencent border-right">
                        <!-- Tab Navs -->
                        <nav class="border-r p-2 w-60 mx-2 flex flex-col" aria-label="Tabs" role="tablist">
                            <button type="button"
                                @click="now_right_id=1"
                                class="h-24 hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:bg-gray-200 p-4 md:p-5 rounded-xl dark:hs-tab-active:bg-neutral-700 dark:hover:bg-neutral-700 active"
                                id="tabs-with-card-item-1" data-hs-tab="#tabs-with-card-1"
                                aria-controls="tabs-with-card-1" role="tab">
                                <span class="flex">
                                    <svg class="flex-shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-neutral-200"
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
                                        <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
                                        <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
                                        <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
                                        <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
                                    </svg>
                                    <span class="grow ms-6">
                                        <span
                                            class="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-neutral-200">
                                        数据集
                                        </span>
                                        <span
                                            class="block mt-1 text-gray-800 dark:hs-tab-active:text-gray-200 dark:text-neutral-200">
                                            数据统计</span>
                                    </span>
                                </span>
                            </button>

                            <button type="button"
                                @click="now_right_id=2"
                                class="h-24 hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:bg-gray-200 p-4 md:p-5 rounded-xl dark:hs-tab-active:bg-neutral-700 dark:hover:bg-neutral-700"
                                id="tabs-with-card-item-2" data-hs-tab="#tabs-with-card-2"
                                aria-controls="tabs-with-card-2" role="tab">
                                <span class="flex">
                                    <svg class="flex-shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-neutral-200"
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="m12 14 4-4" />
                                        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                                    </svg>
                                    <span class="grow ms-6">
                                        <span
                                            class="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-neutral-200">
                                        导入数据
                                        </span>
                                        <span
                                            class="block mt-1 text-gray-800 dark:hs-tab-active:text-gray-200 dark:text-neutral-200">
                                            数据输入
                                        </span>
                                    </span>
                                </span>
                            </button>

                            <button type="button"
                                @click="now_right_id=3"
                                class="h-24 hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:bg-gray-200 p-4 md:p-5 rounded-xl dark:hs-tab-active:bg-neutral-700 dark:hover:bg-neutral-700"
                                id="tabs-with-card-item-3" data-hs-tab="#tabs-with-card-3"
                                aria-controls="tabs-with-card-3" role="tab">
                                <span class="flex">
                                    <svg class="flex-shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-neutral-200"
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path
                                            d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                                        <path d="M5 3v4" />
                                        <path d="M19 17v4" />
                                        <path d="M3 5h4" />
                                        <path d="M17 19h4" />
                                    </svg>
                                    <span class="grow ms-6">
                                        <span
                                            class="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-neutral-200">
                                        靶场命中
                                        </span>
                                        <span
                                            class="block mt-1 text-gray-800 dark:hs-tab-active:text-gray-200 dark:text-neutral-200">
                                        数据测试
                                        </span>
                                    </span>
                                </span>
                            </button>

                            <button type="button"
                                @click="now_right_id=4"
                                class="h-24 hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:bg-gray-200 p-4 md:p-5 rounded-xl dark:hs-tab-active:bg-neutral-700 dark:hover:bg-neutral-700"
                                id="tabs-with-card-item-3" data-hs-tab="#tabs-with-card-3"
                                aria-controls="tabs-with-card-3" role="tab">
                                <span class="flex">
                                    <svg t="1719206171566" class="flex-shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-neutral-200" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4284" width="24" height="24"><path d="M635.635 1022.928c-39.368 0-72.301-23.406-90.471-64.289-8.202-18.422-17.35-24.29-23.533-27.066-10.852-4.984-18.864-3.596-29.274 4.353-8.391 6.372-14.006 13.438-17.097 21.577-18.612 47.949-67.885 72.932-118.925 63.216-48.706-9.148-87.506-26.182-118.673-51.986-22.46-18.675-35.33-39.873-39.368-64.92-3.47-21.64 1.956-39.936 7.129-53.437 4.227-11.167 7.445-20.378 7.066-28.895-0.442-8.328-6.688-15.709-14.321-16.719-14.7-1.956-29.968 1.451-45.046 4.921-42.333 9.653-79.935-4.227-105.55-38.422C20.507 735.237 5.176 694.481 2.084 650.129c-3.47-48.643 17.791-85.361 59.873-103.215 15.015-6.372 25.299-15.583 31.356-28.075 5.363-11.041 2.208-16.277-1.199-20.252-11.861-14.258-17.602-17.728-20-18.612C12.179 458.839-7.127 396.38 4.671 345.719c7.382-31.924 18.675-68.831 45.993-100.376 27.192-31.293 60.63-42.649 96.97-32.239l6.814 1.956c11.23 3.281 20.883 6.057 29.463 6.057 29.968-1.893 31.103-18.548 31.608-25.678l0.757-12.113c0.315-2.587-0.442-21.514-2.713-30.599-9.779-38.8 3.028-75.077 36.151-102.017 32.807-26.75 72.743-42.144 125.739-48.453 43.532-5.236 77.159 15.142 95.96 55.267 6.183 12.997 11.104 20.694 17.034 26.435 14.826 14.321 44.605 5.93 53.816-13.186 5.552-11.482 12.744-22.965 21.324-34.195 20.567-26.687 51.166-39.053 85.74-34.069 32.176 4.795 73.879 14.132 109.84 44.037 20.504 17.034 40.441 37.286 46.939 69.336 4.669 23.028-2.082 42.333-7.066 56.403-3.218 9.274-4.416 17.35-3.659 25.425 1.199 13.249 14.069 25.804 27.003 26.245 11.482-0.946 22.712-1.956 32.807-6.183 13.88-5.741 27.76-8.643 41.198-8.643 21.955 0 53.564 7.634 79.746 44.1 24.479 34.132 38.737 74.573 43.721 123.594 4.353 42.649-17.665 78.106-60.314 97.159-9.148 4.101-16.277 9.085-22.145 15.457-7.571 8.076-10.599 18.675-8.58 29.274 1.956 10.41 8.643 18.99 18.233 23.596 17.35 8.139 37.034 19.306 51.923 39.747 17.539 23.848 23.596 52.239 17.981 84.225-4.921 28.643-15.079 70.85-46.056 106.244-29.274 33.438-61.134 40.504-82.711 40.504-9.148 0-18.612-1.262-28.012-3.659-15.773-4.101-31.987-8.012-48.264-4.858-6.877 1.262-15.646 11.167-16.088 18.296-0.82 11.924 0.252 20.504 3.407 27.633 20.504 46.245 4.795 99.178-38.169 128.704-33.501 22.965-71.166 37.412-112.048 42.901C644.468 1022.676 639.989 1022.928 635.635 1022.928zM510.086 855.802c13.943 0 27.949 3.091 41.639 9.274 26.372 11.987 46.561 33.501 60.062 63.973 9.337 20.946 20.252 20.946 23.848 20.946l3.659-0.252c29.842-3.975 56.15-14.069 80.503-30.788 10.599-7.255 20.315-21.892 12.744-39.053-10.599-23.974-10.536-46.876-9.527-62.018 2.776-40.63 36.151-77.979 75.897-85.172 28.958-5.237 57.349 0.315 79.43 5.994 10.347 2.587 19.242 6.751 37.665-14.258 14.574-16.593 23.533-38.422 29.085-70.661 2.713-15.52-1.009-23.217-4.984-28.643-5.047-6.94-13.375-11.798-24.29-16.971-30.851-14.574-52.239-42.207-58.674-75.771-6.435-33.69 3.344-67.443 26.75-92.553 12.492-13.501 27.444-24.164 45.74-32.428 19.179-8.517 18.233-17.413 17.665-23.28-3.659-36.024-13.628-64.92-30.473-88.389-9.842-13.691-17.539-13.691-20.441-13.691-3.785 0-8.265 1.009-13.186 3.091-18.801 7.823-38.359 11.798-57.917 11.798-55.519-2.019-98.042-42.712-102.585-92.742-1.64-18.548 0.82-36.908 7.571-56.024 2.461-7.129 5.047-14.448 4.353-17.791-1.956-9.527-9.274-17.097-22.082-27.76-17.476-14.511-39.558-22.839-74.005-27.949-8.643-0.505-12.744 0.757-17.034 6.309-5.615 7.318-10.158 14.511-13.564 21.514-18.17 37.728-57.349 62.144-99.745 62.144-26.624 0-51.671-10.031-70.535-28.264-15.773-15.331-25.11-32.744-32.239-47.759-6.624-14.195-13.186-14.195-17.476-14.195-42.523 4.858-70.535 15.205-92.175 32.807-14.132 11.545-13.564 19.432-11.419 27.823 3.407 13.754 5.11 42.333 5.11 42.333l0.126 2.145-1.262 21.009c-3.722 52.996-41.892 89.651-97.348 93.31l-7.066 0.189c-18.927 0-35.33-4.732-49.778-8.959l-6.372-1.83c-7.255-0.82-12.555-0.946-21.955 9.842-16.845 19.432-24.416 44.731-30.094 69.147-3.596 15.457-1.073 41.261 20.694 48.958 22.334 7.886 39.368 25.804 51.734 40.567 23.596 28.264 27.507 64.352 10.788 98.925-13.943 28.706-36.971 49.967-68.453 63.342-9.464 4.038-17.161 9.148-15.583 30.977 2.082 30.157 12.492 57.854 30.977 82.459 11.987 15.962 20.252 13.628 30.914 11.167 21.324-4.921 45.551-9.59 71.039-6.183 42.712 5.615 75.33 41.64 77.475 85.613 1.009 22.523-5.236 41.072-11.735 58.169-2.902 7.697-3.848 12.303-3.218 15.962 0.82 5.3 3.091 11.419 13.943 20.441 21.577 17.918 48.832 29.463 85.613 36.403 2.965 0.568 5.93 0.82 8.896 0.82 21.135 0 26.624-14.006 28.391-18.612 7.949-20.757 21.829-38.8 41.072-53.437C467.563 863.184 488.32 855.802 510.086 855.802z" fill="#231815" p-id="4285"></path><path d="M508.193 756.499c-133.373 0-242.266-110.092-242.708-245.358-0.442-135.833 106.244-243.528 242.96-245.231l0 0c136.212 0 245.421 109.524 246.493 244.159 1.136 134.571-108.452 245.105-244.222 246.43L508.193 756.499zM511.537 338.842c-98.358 1.199-173.435 76.781-173.119 172.047 0.315 95.203 76.465 172.678 169.776 172.678l1.767 0c95.645-0.946 172.804-78.484 172.047-172.867C681.25 415.938 604.784 338.842 511.537 338.842z" fill="#231815" p-id="4286"></path></svg>
                                    <span class="grow ms-6">
                                        <span
                                            class="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-neutral-200">
                                        设置信息
                                        </span>
                                        <span
                                            class="block mt-1 text-gray-800 dark:hs-tab-active:text-gray-200 dark:text-neutral-200">
                                        知识库信息
                                        </span>
                                    </span>
                                </span>
                            </button>
                        </nav>
                        <!-- End Tab Navs -->
                        <div class="mt-2 flex-1 p-4 mobile-sell" v-if="now_right_id==1">
                                    <h5>知识库数据：{{ page_count }}组</h5>
                                    <a-row :gutter="20" v-if="page_count > 0">
                                        <a-col :xs="{ span: 24 }" :lg="{ span: 6 }" class="cursor-pointer mb-2 relative"
                                            v-for="(item, index) in know_all_data" :key="index">
                                            <a-card hoverable class="bg-white rounded-3 h-24 max-h-24"
                                                @click="get_vector(item.id)">
                                                <div class="flex items-center justify-between mb-4">
                                                    <span class="flex items-center">
                                                        <a-typography-text class="line-clamp-2">
                                                            <span>{{ item.text }}</span>
                                                            <p>{{ item.description }}</p>
                                                        </a-typography-text>
                                                    </span>

                                                </div>

                                            </a-card>
                                            <div class="flex align-items-center absolute left-5 bottom-2">
                                                {{ item.created_at }}
                                                <icon-delete @click="del_know(item.id)" />
                                            </div>
                                        </a-col>
                                    </a-row>
                                    <a-empty class="mt-20" v-else description="暂无数据"></a-empty>
                                    <a-pagination size="small" :total="page_count" :current="page"
                                        :page-size="page_size" class="justify-content-center mb-2" background simple
                                        @change="handleCurrentChange" :hide-on-single-page=true />
                                </div>


                                <div class="mt-2 flex-1 p-4 mobile-sell" v-if="now_right_id==2">
                                    <div class="top_content">
                                        <!-- Card Section -->
                                        <div class="px-2 py-4 mx-auto radio-int">
                                            <!-- Grid -->
                                            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                                                <!-- Card -->
                                                <div @click="tool_up = indexs + 1" v-for="(items, indexs) in choose"
                                                    :class="tool_up == indexs + 1 ? 'active' : ''" :key="indexs"
                                                    class="cursor-pointer group flex flex-col bg-white border border-2 shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800"
                                                    href="#">
                                                    <div class="p-4 md:p-5">
                                                        <div class="flex">
                                                            <div
                                                                class="flex justify-center items-center size-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg mx-auto">
                                                                <svg v-if="indexs == 0"
                                                                    class="flex-shrink-0 size-7 text-white"
                                                                    xmlns="http://www.w3.org/2000/svg" width="24"
                                                                    height="24" viewBox="0 0 24 24" fill="none"
                                                                    stroke="currentColor" stroke-width="2"
                                                                    stroke-linecap="round" stroke-linejoin="round">
                                                                    <rect width="18" height="10" x="3" y="11" rx="2" />
                                                                    <circle cx="12" cy="5" r="2" />
                                                                    <path d="M12 7v4" />
                                                                    <line x1="8" x2="8" y1="16" y2="16" />
                                                                    <line x1="16" x2="16" y1="16" y2="16" />
                                                                </svg>
                                                                <svg v-if="indexs == 1"
                                                                    class="flex-shrink-0 size-7 text-white"
                                                                    xmlns="http://www.w3.org/2000/svg" width="24"
                                                                    height="24" viewBox="0 0 24 24" fill="none"
                                                                    stroke="currentColor" stroke-width="2"
                                                                    stroke-linecap="round" stroke-linejoin="round">
                                                                    <path d="m7.5 4.27 9 5.15" />
                                                                    <path
                                                                        d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                                                                    <path d="m3.3 7 8.7 5 8.7-5" />
                                                                    <path d="M12 22V12" />
                                                                </svg>
                                                                <svg v-if="indexs == 2"
                                                                    class="flex-shrink-0 size-7 text-white"
                                                                    xmlns="http://www.w3.org/2000/svg" width="24"
                                                                    height="24" viewBox="0 0 24 24" fill="none"
                                                                    stroke="currentColor" stroke-width="2"
                                                                    stroke-linecap="round" stroke-linejoin="round">
                                                                    <polygon
                                                                        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                                                </svg>
                                                                <svg v-if="indexs == 3"
                                                                    class="flex-shrink-0 size-7 text-white"
                                                                    xmlns="http://www.w3.org/2000/svg" width="24"
                                                                    height="24" viewBox="0 0 24 24" fill="none"
                                                                    stroke="currentColor" stroke-width="2"
                                                                    stroke-linecap="round" stroke-linejoin="round">
                                                                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                                                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                                                    <path d="M4 22h16" />
                                                                    <path
                                                                        d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                                                    <path
                                                                        d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                                                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                                                </svg>

                                                            </div>

                                                            <div class="grow ms-3">
                                                                <h3
                                                                    class="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
                                                                    {{ items.title }}
                                                                </h3>
                                                                <p class="text-sm text-gray-500 dark:text-neutral-500">
                                                                    {{ items.description }}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- End Card -->
                                            </div>
                                            <!-- End Grid -->
                                        </div>
                                        <!-- End Card Section -->

                                    </div>
                                    <div class="flex flex-col p-1 one_input" v-if="tool_up == 1">
                                        <label for="top-input" class="mb-2">匹配文本:</label>
                                        <a-textarea class="rounded-md mb-3" v-model="text_input" :auto-size="{
                                            minRows: 7,
                                            maxRows: 7
                                        }" allow-clear show-word-limit max-length="2000" rows="4"
                                            placeholder="输入文本..."></a-textarea>

                                        <label for="bottom-input" class="mb-2">回答:</label>
                                        <a-textarea class="rounded-md" v-model="answers" :auto-size="{
                                            minRows: 7,
                                            maxRows: 7
                                        }" allow-clear show-word-limit max-length="2000" rows="4"
                                            placeholder="输入文本..."></a-textarea>
                                        <a-button :loading="generate_load" type="primary" class="mt-2 w-32"
                                            @click="generate_text()">立即导入
                                        </a-button>
                                    </div>
                                    <div class="two_input p-1" v-if="tool_up == 2">
                                        <a-row :gutter="20">
                                            <a-col :xs="{ span: 24 }" :lg="{ span: generate_list.length > 0 ? 12 : 24 }">
                                                <a-upload @before-remove="remove_file" class="avatar-uploader"
                                                    :action="actionsDoc" :headers="{ 'Authorization': 'Bearer ' + token }"
                                                    @before-upload="beforeUploadDoc" @success="picSuccess" draggable
                                                    accept="application/pdf,.docx,.txt" list-type="text"
                                                    :default-file-list="generate_list">
                                                    <template #upload-button>
                                                        <div>

                                                            <div class="arco-upload-picture-card pl-20 pr-20 h-48">
                                                                <div class="arco-upload-picture-card-text">
                                                                    <icon-cloud class="fs-2" />
                                                                    <div>点击或拖拽.txt, .docx, .pdf文件到这进行解析</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </template>

                                                </a-upload>
                                                <a-button :loading="generate_load" v-if="generate_list.length > 0"
                                                    class="mt-2" type="primary"
                                                    @click="for_generate_in()">开始导入</a-button>
                                            </a-col>
                                            <a-col :xs="{ span: 24 }" :lg="{ span: 12 }" class="overflow-auto generate_col">
                                                <div class="bg-gray-100 generate_all rounded-md p-4 mb-2 flex-column"
                                                    v-for="(ge, ge_index) in generate_list" :key="ge_index">
                                                    <h4>{{ ge.name }}</h4>
                                                    <div class="generate_info" v-if="generate_list.length > 0"
                                                        v-html="ge.text.replace(/\r/g, '<br>').replace(/\t/g, '<br>')">

                                                    </div>
                                                    <a-empty v-else>暂无数据</a-empty>
                                                </div>
                                            </a-col>
                                        </a-row>

                                    </div>
                                    <div class="three_input p-1" v-if="tool_up == 3">
                                        <a-row :gutter="20">
                                            <a-col :xs="{ span: 24 }" :lg="{ span: generate_list.length > 0 ? 12 : 24 }">
                                                <a-upload @before-remove="remove_file" class="avatar-uploader"
                                                    :action="actionsDoc" :headers="{ 'Authorization': 'Bearer ' + token }"
                                                    @before-upload="beforeUploadDoc" @success="picSuccess" draggable
                                                    accept="application/pdf,.docx,.txt" list-type="text"
                                                    :default-file-list="generate_list">
                                                    <template #upload-button>
                                                        <div>

                                                            <div class="arco-upload-picture-card pl-20 pr-20 h-48">
                                                                <div class="arco-upload-picture-card-text">
                                                                    <icon-cloud class="fs-2" />
                                                                    <div>点击或拖拽.txt, .docx, .pdf文件到这进行解析</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </template>

                                                </a-upload>
                                                <a-button :loading="generate_load" v-if="generate_list.length > 0"
                                                    class="mt-2" type="primary"
                                                    @click="qs_generate_in()">开始导入</a-button>
                                            </a-col>
                                            <a-col :xs="{ span: 24 }" :lg="{ span: 12 }" class="overflow-auto generate_col">
                                                <div class="bg-gray-100 generate_all rounded-md p-4 mb-2 flex-column"
                                                    v-for="(ge, ge_index) in generate_list" :key="ge_index">
                                                    <h4>{{ ge.name }}</h4>
                                                    <div class="generate_info" v-if="generate_list.length > 0"
                                                        v-html="ge.text.replace(/\r/g, '<br>').replace(/\t/g, '<br>')">

                                                    </div>
                                                    <a-empty v-else>暂无数据</a-empty>
                                                </div>
                                            </a-col>
                                        </a-row>
                                    </div>
                                    <div class="four_input p-1" v-if="tool_up == 4">
                                        <a-textarea class="rounded-md" v-model="url_info" :auto-size="{
                                            minRows: 7,
                                            maxRows: 7
                                        }" allow-clear rows="4" placeholder="输入链接，以逗号隔开例如:www.baidu.com,xxx.com...">

                                        </a-textarea>
                                        <a-button :loading="generate_load" type="primary" class="mt-2 w-32"
                                            @click="generate_urls()">立即导入
                                        </a-button>
                                    </div>
                                </div>
                                <div class="mt-2 flex-1 p-2" v-if="now_right_id==3">
                                    <div class="top_content">
                                        <a-row :gutter="20">
                                            <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">
                                                <a-textarea class="rounded-md" v-model="search_text" :auto-size="{
                                                    minRows: 7,
                                                    maxRows: 7
                                                }
                                                    " allow-clear placeholder="输入搜索内容">

                                                </a-textarea>
                                                <a-button :loading="generate_load" type="primary" class="mt-2 mb-2 w-32"
                                                    @click="search_pipei()">搜索测试
                                                </a-button>
                                                <h5>搜索记录</h5>
                                                <div class="search_list_left" v-if="search_left.length > 0">
                                                    <a-card class="w-100 cursor-pointer" hoverable
                                                        :style="{ marginBottom: '20px' }"
                                                        @click="check_know_sid(s[0].search_id)"
                                                        v-for="(s, s_index) in search_left" :key="s_index">
                                                        <div :style="{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                        }">
                                                            <span
                                                                :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
                                                                <svg t="1692002618891" class="icon"
                                                                    viewBox="0 0 1024 1024" version="1.1"
                                                                    xmlns="http://www.w3.org/2000/svg" p-id="4353"
                                                                    width="24" height="24">
                                                                    <path
                                                                        d="M893.44 828.6208l-110.8992-114.944c48.896-63.5904 77.9776-143.1552 77.9776-229.5808 0-208.2816-168.8576-377.1392-377.1392-377.1392S106.24 275.8144 106.24 484.096s168.8576 377.1392 377.1392 377.1392c89.856 0 172.2368-31.5392 237.056-84.0192l109.1072 113.1008a44.32384 44.32384 0 0 0 31.9488 13.568c11.1104 0 22.2208-4.1472 30.8224-12.4416 17.664-17.0496 18.1248-45.1584 1.1264-62.8224zM485.632 729.6h-1.4848c-145.9712 0-217.1904-111.0016-234.496-169.9328-5.9392-20.1728 5.632-41.3184 25.8048-47.2576a38.02624 38.02624 0 0 1 47.2064 25.6c1.5872 5.12 37.0688 115.4048 161.4848 115.4048h1.28c20.9408 0 37.9392 16.896 38.0928 37.888 0.1024 21.0432-16.8448 38.1952-37.888 38.2976z"
                                                                        fill="#2595E8" p-id="4354"></path>
                                                                    <path
                                                                        d="M805.2736 324.3008c0-13.2096-0.6656-26.2656-1.5872-39.2704-66.56-106.9056-185.088-178.0736-320.3072-178.0736-208.2816 0-377.1392 168.8576-377.1392 377.1392 0 172.1856 115.456 317.3376 273.152 362.496 242.9952-49.6128 425.8816-264.6016 425.8816-522.2912zM275.456 512.4096a38.02624 38.02624 0 0 1 47.2064 25.6c1.5872 5.12 37.0688 115.4048 161.4848 115.4048h1.28c20.9408 0 37.9392 16.896 38.0928 37.888a38.0416 38.0416 0 0 1-37.888 38.2464h-1.4848c-145.9712 0-217.1904-111.0016-234.496-169.9328-5.9392-20.1216 5.5808-41.2672 25.8048-47.2064z"
                                                                        fill="#3A9CED" p-id="4355"></path>
                                                                    <path
                                                                        d="M483.3792 106.9568c-208.2816 0-377.1392 168.8576-377.1392 377.1392 0 66.56 17.3056 129.024 47.5136 183.296 48.896-2.4576 96-11.6736 140.544-26.4704-23.5008-28.6208-38.0416-58.7264-44.6464-81.2544-5.9392-20.1728 5.632-41.3184 25.8048-47.2576a38.02624 38.02624 0 0 1 47.2064 25.6c0.9216 2.9184 12.9024 40.192 46.2336 71.6288 168.1408-86.0672 284.4672-258.7648 290.1504-459.264-52.48-27.6992-112.2304-43.4176-175.6672-43.4176z"
                                                                        fill="#59ADF8" p-id="4356"></path>
                                                                    <path
                                                                        d="M106.6496 466.9952c186.7264-40.8576 336.896-179.456 393.8816-359.6288-5.6832-0.256-11.4176-0.4096-17.2032-0.4096-202.496 0-367.7184 159.6928-376.6784 360.0384z"
                                                                        fill="#6BC2FC" p-id="4357"></path>
                                                                </svg>
                                                                <a-typography-text>{{ s[0].title }}</a-typography-text>
                                                            </span>
                                                            <icon-delete
                                                                @click="delete_know_sid(s[0].search_id)"></icon-delete>
                                                        </div>

                                                    </a-card>
                                                </div>
                                                <a-empty v-else>暂无数据</a-empty>
                                            </a-col>
                                            <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">
                                                <div class="s_list overflow-hidden">
                                                    <h5>搜索匹配度</h5>
                                                    <div :style="{
                                                        boxSizing: 'border-box',
                                                        backgroundColor: 'var(--color-fill-2)',
                                                    }" class="search_right_list p-2 overflow-auto"
                                                        v-if="search_now_list.length > 0">
                                                        <a-card class="w-100 mb-2" @click="get_vector_search(st.id)"
                                                            :title="st.text" :bordered="false"
                                                            v-for="(st, st_index) in search_now_list" :key="st_index">
                                                            <template #extra>
                                                                匹配度:{{ st.from_number }}
                                                            </template>
                                                            <div class="text-truncate">
                                                                {{ st.answer ? st.answer : '暂无回答' }}
                                                            </div>
                                                        </a-card>
                                                    </div>
                                                    <a-empty v-else>暂无数据</a-empty>
                                                </div>
                                            </a-col>
                                        </a-row>
                                    </div>
                                </div>
                                <div class="mt-2 flex-1" v-if="now_right_id==4">
                                    <a-form ref="formRef" :model="form" class="max-w-xl p-2" @submit="handleSubmit">
                                        <a-form-item field="know_uid" label="知识库ID">
                                            <a-input v-model="form.know_uid" disabled />
                                        </a-form-item>
                                        <a-form-item field="title" label="知识库名称" :rules="[
                                            { required: true, message: '标题必须填写' },
                                        ]" :validate-trigger="['change', 'input']">
                                            <a-input v-model="form.title" placeholder="输入标题名称" />
                                        </a-form-item>
                                        <a-form-item field="avatar" label="知识库头像">
                                            <div class="flex flex-column">
                                                <a-image width="100" height="100" :src="form.avatar" />
                                                <a-upload class="avatar-uploader" :action="actions"
                                                    :show-file-list="false"
                                                    :headers="{ 'Authorization': 'Bearer ' + token }"
                                                    @success="onSuccessUp" @before-upload="beforeUpload">
                                                </a-upload>
                                            </div>

                                        </a-form-item>
                                        <a-form-item field="description" label="知识库描述">
                                            <a-textarea v-model="form.description" placeholder="输入描述词" />
                                        </a-form-item>
                                        <a-form-item>
                                            <a-space>
                                                <a-button html-type="submit">提交</a-button>
                                                <a-button type="primary"
                                                    @click="send_public(know_id)"><icon-rotate-right class="mr-1" />{{
                                                    is_public ? '公开' : '私有'}}知识库</a-button>

                                            </a-space>
                                        </a-form-item>
                                    </a-form>
                                </div>
                    </div>

                </div>


            </div>


            <Nfooter />
        </main>
        <a-modal v-model:visible="dialog_visible" ok-text="修改" title="知识库信息" @ok="change_info">
            <a-skeleton animation v-if="dialog_loading">
                <a-space direction="vertical" :style="{ width: '100%' }" size="large">
                    <a-skeleton-line :rows="3" />
                </a-space>
            </a-skeleton>
            <div class="flex flex-col p-4" v-else>
                <label for="top-input" class="mb-2">匹配文本:</label>
                <a-textarea class="rounded-md mb-3" v-model="dialog_data.text" :auto-size="{
                    minRows: 7,
                    maxRows: 7
                }" allow-clear show-word-limit max-length="2000" rows="4"
                    placeholder="输入文本..."></a-textarea>

                <label for="bottom-input" class="mb-2">回答:</label>
                <a-textarea class="rounded-md" v-model="dialog_data.answer" :auto-size="{
                    minRows: 7,
                    maxRows: 7
                }" allow-clear show-word-limit max-length="2000" rows="4"
                    placeholder="输入文本..."></a-textarea>
            </div>
        </a-modal>
        <a-modal v-model:visible="dialog_visible_search" title="知识库信息">
            <a-skeleton animation v-if="dialog_loading">
                <a-space direction="vertical" :style="{ width: '100%' }" size="large">
                    <a-skeleton-line :rows="3" />
                </a-space>
            </a-skeleton>
            <div class="flex flex-col p-4" v-else>
                <label for="top-input" class="mb-2">匹配文本:</label>
                <a-textarea class="rounded-md mb-3" v-model="dialog_data.text" :auto-size="{
                    minRows: 7,
                    maxRows: 7
                }" allow-clear show-word-limit max-length="2000" rows="4"
                    placeholder="输入文本..."></a-textarea>

                <label for="bottom-input" class="mb-2">回答:</label>
                <a-textarea class="rounded-md" v-model="dialog_data.answer" :auto-size="{
                    minRows: 7,
                    maxRows: 7
                }" allow-clear show-word-limit max-length="2000" rows="4"
                    placeholder="输入文本..."></a-textarea>
            </div>
        </a-modal>
    </a-spin>

</template>
<script setup lang="ts">
import { ref } from "vue";
import { Message, Modal } from "@arco-design/web-vue";

definePageMeta({
    middleware: ['islogin']
})
import {
    IconCloud,
    IconDelete, IconPlus, IconRotateRight
} from "@arco-design/web-vue/es/icon";

const route = useRoute()
const token = useCookie('token');
const router = useRouter();
import { useCounter } from "~/store/counter";
import { change_know, get_vector_id, know_generate } from "~/utils/api";
const url_info = ref('')
const counter = useCounter()
const create_load = ref(false)
const know_id = ref(route.params.knowid)
const now_info = ref({})
const know_all_data = ref([])
const page_count = ref(1)
const page_size = ref(24)
const page = ref(1)
const form = reactive({
    title: '',
    know_uid: know_id.value,
    description: '',
    avatar: ''
});
const handleSubmit = ({ values, errors }) => {
    change_know({
        uid: know_id.value,
        title: form.title,
        description: form.description,
        avatar: form.avatar
    }).then((res: any) => {
        now_know()
        Message.success('修改成功')
    }).catch((err: any) => {
        console.log(err)
    })
}

const send_public = (id: any) => {
    public_knowledge({
        know_uid: id
    }).then((res: any) => {
        Message.success(res._rawValue.message)
        now_know()
    }).catch((err: any) => {
        console.log(err)
    })
}
const actions = counter.setting.APP_URL + '/api/upload_know'
const actionsDoc = counter.setting.APP_URL + '/api/upload_know_txt'

const choose = ref([
    {
        title: '手动输入',
        description: '手动输入问答对，是最精准的数据',
    },
    {
        title: '直接分段',
        description: '选择文本文件，直接将其按分段进行处理',
    },
    {
        title: '问答解析',
        description: '选择文本文件，让大模型自动生成问答对',
    },
    {
        title: '链接解析',
        description: '输入URL链接，自动解析网页中的文字数据',
    },

])
const text_input = ref('')
const answers = ref('')
const generate_load = ref(false)
const generate_list = ref([])

const generate_text = () => {
    generate_load.value = true
    know_generate({
        uid: know_id.value,
        text: text_input.value,
        answer: answers.value
    }).then((res: any) => {
        now_know()
        text_input.value = ''
        answers.value = ''
        generate_load.value = false
        Message.success('导入成功')
    }).catch((err: any) => {
        generate_load.value = false
        console.log(err)
    })
}
const search_text = ref('')
const search_left = ref([])
const search_now_list = ref([])
const { public: { baseUrl } } = useRuntimeConfig()
const headers = {
    'Authorization': `Bearer ${token.value}`,
    'Accept': 'text/event-stream',
}
const for_generate_in = async () => {
    generate_load.value = true
    let formData = new FormData();
    formData.append('uid', know_id.value as string);
    formData.append('list', JSON.stringify(generate_list.value));
    const res = await fetch(`${window.APP_CONFIG.baseUrl}for_generate`, {
        method: 'POST',
        headers: headers,
        body: formData,

    })
    if (res.status == 200) {
        Message.success('导入成功')
        generate_load.value = false
        generate_list.value = []
        now_know()
    }
    if (res.status != 200) {
        Message.error('导入失败')
        generate_load.value = false
        return
    }

}
const generate_urls = async () => {
    generate_load.value = true
    urls_generate({
        uid: know_id.value,
        urls: url_info.value,
    }).then((res: any) => {
        now_know()
        url_info.value = ''
        generate_load.value = false
        Message.success('导入成功')
    }).catch((err: any) => {
        generate_load.value = false
        console.log(err)
    })

}
const check_know_sid = (sid: any) => {
    get_know_sid({
        uid: know_id.value,
        sid: sid
    }).then((res: any) => {
        now_know()
        search_now_list.value = res._rawValue.data
    }).catch((err: any) => {
        console.log(err)
    })
}
const delete_know_sid = (sid: any) => {
    del_know_sid({
        uid: know_id.value,
        sid: sid
    }).then((res: any) => {
        now_know()
        search_now_list.value = []
        Message.success('删除成功')
    }).catch((err: any) => {
        console.log(err)
    })
}
const search_pipei = async () => {
    generate_load.value = true
    search_know({
        uid: know_id.value,
        search_text: search_text.value,
    }).then((res: any) => {
        now_know()
        search_text.value = ''
        generate_load.value = false
        search_now_list.value = res._rawValue.data
        Message.success('搜索成功')
    }).catch((err: any) => {
        generate_load.value = false
        console.log(err)
    })

}
const qs_generate_in = async () => {
    generate_load.value = true
    let formData = new FormData();
    formData.append('uid', know_id.value as string);
    formData.append('list', JSON.stringify(generate_list.value));
    const res = await fetch(`${window.APP_CONFIG.baseUrl}qs_generate`, {
        method: 'POST',
        headers: headers,
        body: formData,

    })
    if (res.status == 200) {
        Message.success('导入成功')
        generate_load.value = false
        generate_list.value = []
        now_know()
    }
    if (res.status != 200) {
        Message.error('导入失败')
        generate_load.value = false
        return
    }

}
const tool_up = ref(1)
const changeRadio = (ids: any) => {
    tool_up.value = ids
}
const is_public = ref(false)
const now_know = () => {
    know_get({
        uid: know_id.value,
        page: page.value,
        limit: page_size.value
    }).then((res: any) => {
        now_info.value = res._rawValue.data
        form.title = res._rawValue.data.title
        form.description = res._rawValue.data.description
        form.avatar = res._rawValue.data.avatar
        is_public.value = res._rawValue.data.is_public
        know_all_data.value = res._rawValue.vector
        page_count.value = res._rawValue.page_count
        search_left.value = res._rawValue.search_list
    }).catch((err: any) => {
        console.log(err)
    })
}
now_know()
const dialog_info = ref({})
const dialog_visible = ref(false)
const dialog_loading = ref(false)
const dialog_data = reactive({
    text: '',
    answer: '',
})
const get_vector = (id: string) => {
    dialog_visible.value = true
    dialog_loading.value = true
    get_vector_id({
        uid: id
    }).then((res: any) => {
        dialog_loading.value = false
        dialog_info.value = res._rawValue.data
        dialog_data.text = res._rawValue.data.text
        dialog_data.answer = res._rawValue.data.answer
    }).catch((err: any) => {
        console.log(err)
    })
}
const dialog_visible_search = ref(false)
const get_vector_search = (id: string) => {
    dialog_visible_search.value = true
    dialog_loading.value = true
    get_vector_search_id({
        id: id
    }).then((res: any) => {
        dialog_loading.value = false
        dialog_info.value = res._rawValue.data
        dialog_data.text = res._rawValue.data.text
        dialog_data.answer = res._rawValue.data.answer
    }).catch((err: any) => {
        console.log(err)
    })
}
const change_info = () => {
    change_know_dialog({
        uid: dialog_info.value.id,
        text: dialog_data.text,
        answer: dialog_data.answer
    }).then((res: any) => {
        now_know()
        dialog_visible.value = false
        Message.success('修改成功')
    }).catch((err: any) => {
        console.log(err)
    })
    return false
}
const del_know = (id: string) => {
    del_know_id({
        uid: id
    }).then((res: any) => {
        now_know()
        Message.success('删除成功')
    }).catch((err: any) => {
        console.log(err)
    })
}
const imageUrl = ref('')
const picSuccess = (currentFile) => {
    // 获取currentFile里的response的data值
    if (currentFile.response.status != 200) {
        Message.error('上传失败!')
        return
    }
    Message.clear()
    Message.success('上传成功!')

    imageUrl.value = currentFile.response.data;
    console.log(currentFile)
    generate_list.value.push({
        uid: currentFile.uid,
        text: currentFile.response.list,
        name: currentFile.response.file_name,
        url: currentFile.response.data
    })
};
const remove_file = (file) => {
    console.log(file)
    return new Promise((resolve, reject) => {
        Modal.confirm({
            title: '移出文件',
            content: `确认删除 ${file.name}`,
            onOk: () => {
                generate_list.value = generate_list.value.filter((item: any) => item.uid != file.uid)
                resolve(true);
            },
            onCancel: () => reject('cancel'),
        });
    });

}
const handleCurrentChange = (val: number) => {
    page.value = val
    now_know()
}
const onSuccessUp = (currentFile) => {
    // 获取currentFile里的response的data值
    if (currentFile.response.status != 200) {
        Message.error('上传失败!')
        return
    }
    form.avatar = currentFile.response.data;
    Message.success('上传成功!')
};
const beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isGIF = file.type === 'image/gif';
    const isLt2M = file.size / 1024 / 1024 < 10;

    if (!isJPG && !isPNG && !isGIF) {
        Message.error('上传图片只能是 JPG/PNG/GIF 格式!')
        return false
    }
    if (!isLt2M) {
        Message.error('上传图片大小不能超过 10MB!')
        return false
    }
    return true
};
const beforeUploadDoc = (file) => {
    const isDoc = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const isDoc2 = file.type === 'application/msword';
    const isPdf = file.type === 'application/pdf';
    const txt = file.type === 'text/plain';
    const isLt2M = file.size / 1024 / 1024 < 10;

    if (!isDoc && !isDoc2 && !isPdf && !txt) {
        Message.error('上传文件只能是 docx/pdf/txt 格式!')
        return false
    }
    if (!isLt2M) {
        Message.error('上传文件大小不能超过 10MB!')
        return false
    }
    return true
};

const now_right_id = ref(1)
const now_right = (id: number) => {
    now_right_id.value = id
}

</script>
<style>
.ai-knowledge .arco-upload-picture-card {
    min-height: 10rem
}

.ai-knowledge .arco-tabs-left.arco-tabs-vertical .arco-tabs-content {
    padding-left: 0px;
}
</style>
