<template>
  <main class="flex-1 bg-[--right-bg-color] h-full w-100vw min-w-600px">
    <div class="size-full" style="background: var(--right-theme-bg-color)">
      <ActionBar :current-label="appWindow.label" />
      <!-- 需要判断当前路由是否是信息详情界面 -->
      <ChatBox :active-item="activeItem" v-if="msgBoxShow && isChat && activeItem !== -1" />

      <Details :content="DetailsContent" v-else-if="detailsShow && isDetails" />

      <!-- 聊天界面背景图标 -->
      <div v-else class="flex-center size-full select-none">
        <img
          v-if="imgTheme === ThemeEnum.DARK && themes.versatile === 'default'"
          class="w-110px h-100px"
          src="@/assets/img/hula_bg_d.svg"
          alt="" />
        <img v-else-if="imgTheme === ThemeEnum.DARK" class="w-110px h-100px" src="@/assets/img/hula-bg-h.png" alt="" />
        <img v-else class="svg-icon w-110px h-100px" src="@/assets/img/hula_bg_l.png" alt="" />
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import Mitt from '@/utils/Bus.ts'
import router from '@/router'
import { setting } from '@/stores/setting.ts'
import { MittEnum, ThemeEnum } from '@/enums'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

const appWindow = WebviewWindow.getCurrent()
const settingStore = setting()
const { themes } = storeToRefs(settingStore)
const msgBoxShow = ref(false)
const detailsShow = ref(false)
const activeItem = ref()
const DetailsContent = ref()
const imgTheme = ref(themes.value.content)
const prefers = matchMedia('(prefers-color-scheme: dark)')
// 判断当前路由是否是聊天界面
const isChat = computed(() => {
  return router.currentRoute.value.path.includes('/message')
})
// 判断当前路由是否是信息详情界面
const isDetails = computed(() => {
  return router.currentRoute.value.path.includes('/friendsList')
})

/** 跟随系统主题模式切换主题 */
const followOS = () => {
  imgTheme.value = prefers.matches ? ThemeEnum.DARK : ThemeEnum.LIGHT
}

watchEffect(() => {
  if (themes.value.pattern === ThemeEnum.OS) {
    followOS()
    prefers.addEventListener('change', followOS)
  } else {
    imgTheme.value = themes.value.content || ThemeEnum.LIGHT
    prefers.removeEventListener('change', followOS)
  }
})

onMounted(() => {
  Mitt.on(MittEnum.NOT_MSG, () => {
    msgBoxShow.value = false
    activeItem.value = -1
  })
  if (isChat) {
    Mitt.on(MittEnum.MSG_BOX_SHOW, (event: any) => {
      msgBoxShow.value = event.msgBoxShow
      activeItem.value = event.item
    })
  }

  if (isDetails) {
    Mitt.on(MittEnum.DETAILS_SHOW, (event: any) => {
      DetailsContent.value = event.context
      detailsShow.value = event.detailsShow as boolean
    })
  }
})
</script>
