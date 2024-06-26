import { useWindow } from '@/hooks/useWindow.ts'
import { emit } from '@tauri-apps/api/event'
import { EventEnum } from '@/enums'
import { delay } from 'lodash-es'
import { invoke } from '@tauri-apps/api/tauri'
import axios from 'axios'

const { createWebviewWindow } = useWindow()
/**
 * 上半部分操作栏配置
 * @param url 路由地址
 * @param icon 图标
 * @param title 创建新窗口时的标题
 * @param iconAction 选择后的图标
 * @param badge 角标
 * @param tip 提示信息
 * @param size 窗口大小
 * @param window 窗口参数
 */
const itemsTop = ref<OPT.L.Common[]>([
  {
    url: 'message',
    icon: 'message',
    iconAction: 'message-action'
  },
  {
    url: 'friendsList',
    icon: 'avatar',
    iconAction: 'avatar-action'
  },
  {
    url: 'dynamic',
    icon: 'fire',
    title: '动态',
    iconAction: 'fire-action2',
    size: {
      width: 840,
      height: 800
    },
    window: {
      isDrag: true,
      resizable: false
    }
  },
  {
    url: 'robot',
    icon: 'robot',
    title: 'GPT',
    iconAction: 'robot-action',
    tip: '机器人新功能在开发中',
    size: {
      width: 980,
      height: 800
    },
    window: {
      isDrag: false,
      resizable: true
    }
  }
])
/** 下半部分操作栏配置 */
const itemsBottom: OPT.L.Common[] = [
  {
    title: '邮件',
    url: 'mail',
    icon: 'mail',
    iconAction: 'mail-action2',
    size: {
      width: 840,
      height: 600
    },
    window: {
      isDrag: false,
      resizable: true
    }
  },
  {
    title: '文件管理器',
    url: 'mail',
    icon: 'file',
    iconAction: 'file-action2',
    size: {
      width: 840,
      height: 600
    },
    window: {
      isDrag: false,
      resizable: true
    }
  },
  {
    title: '收藏',
    url: 'mail',
    icon: 'collect',
    iconAction: 'heart',
    size: {
      width: 840,
      height: 600
    },
    window: {
      isDrag: false,
      resizable: true
    }
  }
]
/** 设置列表菜单项 */
const moreList = ref<OPT.L.MoreList[]>([
  {
    label: '检查更新',
    icon: 'arrow-circle-up',
    click: () => {
      // todo 检查更新
      console.log('检查更新')
    }
  },
  {
    label: '设置',
    icon: 'settings',
    click: async () => {
      // todo 设置
      await createWebviewWindow('设置', 'settings', 840, 840)
    }
  },
  {
    label: '关于',
    icon: 'info',
    click: async () => {
      // todo 关于
      await createWebviewWindow('关于', 'about', 360, 480)
    }
  },
  {
    label: '退出账号',
    icon: 'power',
    click: async () => {
      localStorage.removeItem('USER_INFO')
      localStorage.removeItem('TOKEN')
      // 清空axios请求头
      const instance = axios.create()
      instance.defaults.headers.common.Authorization = ''
      // todo 退出账号 需要关闭其他的全部窗口
      await createWebviewWindow('登录', 'login', 320, 448, 'home', true, false, 320, 448).then(() => {
        /** 给一点延迟，不然创建登录窗口后还没有来得及设置阴影和圆角效果 */
        delay(async () => {
          /** 如果图标在闪烁则先暂停闪烁 */
          await invoke('tray_blink', { isRun: false }).catch((error) => {
            console.error('暂停闪烁失败:', error)
          })
          /** 通知全部打开的窗口然后关闭 */
          await emit(EventEnum.LOGOUT)
          await emit('logout_success')
        }, 300)
      })
    }
  }
])

export { itemsTop, itemsBottom, moreList }
