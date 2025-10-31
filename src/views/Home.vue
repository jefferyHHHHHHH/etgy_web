<script setup lang="ts">
import HelloWorld from '../components/HelloWorld.vue'
import ExportExcelDemo from '../components/ExportExcelDemo.vue'
import { useAppStore } from '../stores/modules/app'
import { useUserStore } from '../stores/modules/user'
import { useSettingsStore } from '../stores/modules/settings'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const appTitle = import.meta.env.VITE_APP_TITLE

const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const { t, locale } = useI18n()

const { sidebarCollapsed } = storeToRefs(appStore)
const { isAuthenticated, userName, token } = storeToRefs(userStore)
const { theme, apiBase } = storeToRefs(settingsStore)

async function doLogin() {
  await userStore.login('admin', '123456')
}

async function doLogout() {
  await userStore.logout()
}

function toggleTheme() {
  settingsStore.setTheme(settingsStore.theme === 'light' ? 'dark' : 'light')
}

function setLang(lang: 'zh-CN' | 'en') {
  settingsStore.setLocale(lang)
  locale.value = lang
}
</script>

<template>
  <div>
    <div>
      <a href="https://vite.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>

    <HelloWorld :msg="t('app.title')" />
    <ExportExcelDemo />

    <div style="margin-top: 16px">
      <div><strong>VITE_APP_TITLE:</strong> {{ appTitle }}</div>
      <div>
        <strong>{{ t('env.apiBase') }}:</strong> {{ apiBase }}
      </div>
    </div>

    <div style="margin-top: 24px; padding: 12px; border: 1px solid #eee">
      <h3>App Store</h3>
      <div>sidebarCollapsed: {{ sidebarCollapsed }}</div>
      <button @click="appStore.toggleSidebar">{{ t('actions.toggleTheme') }}</button>
    </div>

    <div style="margin-top: 16px; padding: 12px; border: 1px solid #eee">
      <h3>User Store</h3>
      <div>isAuthenticated: {{ isAuthenticated }}</div>
      <div>userName: {{ userName }}</div>
      <div>token: {{ token }}</div>
      <button :disabled="isAuthenticated" @click="doLogin">{{ t('actions.login') }}</button>
      <button :disabled="!isAuthenticated" @click="doLogout">{{ t('actions.logout') }}</button>
    </div>

    <div style="margin-top: 16px; padding: 12px; border: 1px solid #eee">
      <h3>Settings Store</h3>
      <div>theme: {{ theme }}</div>
      <div>apiBase: {{ apiBase }}</div>
      <button @click="toggleTheme">{{ t('actions.toggleTheme') }}</button>
    </div>

    <div style="margin-top: 16px; padding: 12px; border: 1px solid #eee">
      <h3>I18n</h3>
      <button @click="setLang('zh-CN')">中文</button>
      <button @click="setLang('en')">English</button>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
