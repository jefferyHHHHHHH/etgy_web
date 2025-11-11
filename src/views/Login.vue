<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/modules/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const user = useUserStore()

const form = ref({ username: '', password: '', role: 'volunteer' as 'volunteer' | 'admin' })
const loading = ref(false)

async function onSubmit() {
  if (!form.value.username || !form.value.password) return ElMessage.warning('请输入账号与密码')
  try {
    loading.value = true
    await user.login(form.value.username, form.value.password, form.value.role)
    ElMessage.success('登录成功')
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <div class="login__bg">
      <div class="orb orb--1" />
      <div class="orb orb--2" />
      <div class="orb orb--3" />
      <div class="grid" />
    </div>

    <div class="login__panel">
      <div class="login__brand">
        <img src="../assets/logo.jpg" alt="logo" class="login__logo" />
        <div class="login__title">
          <h2>益路同行管理后台</h2>
          <p>请登录以继续</p>
        </div>
      </div>

      <el-form label-position="top" class="login__form" @submit.prevent>
        <el-form-item label="登录身份">
          <el-radio-group v-model="form.role">
            <el-radio-button label="volunteer">志愿者</el-radio-button>
            <el-radio-button label="admin">管理员</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="账号">
          <el-input v-model="form.username" autocomplete="username" placeholder="请输入账号" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            autocomplete="current-password"
            placeholder="请输入密码"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" class="login__submit" @click="onSubmit"
            >登录</el-button
          >
        </el-form-item>
      </el-form>

      <div class="login__footer">
        <span>忘记密码？请联系管理员重置</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.login {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
  background: linear-gradient(160deg, var(--color-bg-page), var(--color-bg-container));

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .grid {
    position: absolute;
    inset: -50% -50% -50% -50%;
    background-image: radial-gradient(circle at 1px 1px, rgb(0 0 0 / 7%) 1px, transparent 0);
    background-size: 24px 24px;
    mask-image: radial-gradient(closest-side, black, transparent);
    opacity: 0.25;
  }

  .orb {
    position: absolute;
    width: 540px;
    height: 540px;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.45;
    animation: float 18s ease-in-out infinite;
    background: radial-gradient(circle at 30% 30%, rgb(59 130 246 / 50%), transparent 60%);

    &--1 {
      top: -120px;
      left: -120px;
    }
    &--2 {
      bottom: -160px;
      right: -160px;
      animation-delay: -6s;
      background: radial-gradient(circle at 70% 40%, rgb(236 72 153 / 45%), transparent 60%);
    }
    &--3 {
      top: 20%;
      right: 10%;
      animation-delay: -12s;
      background: radial-gradient(circle at 30% 60%, rgb(34 197 94 / 45%), transparent 60%);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) translateX(0);
    }
    25% {
      transform: translateY(-14px) translateX(10px);
    }
    50% {
      transform: translateY(8px) translateX(-8px);
    }
    75% {
      transform: translateY(-6px) translateX(-12px);
    }
  }

  &__panel {
    position: relative;
    width: 420px;
    padding: 28px 26px 18px;
    border-radius: $radius-lg;
    background: color-mix(in oklab, var(--color-bg-container) 82%, transparent);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-xl);
    backdrop-filter: blur(10px);
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  &__logo {
    width: 34px;
    height: 34px;
  }

  &__title {
    h2 {
      margin: 0;
      font-size: 18px;
      color: var(--color-text-primary);
    }
    p {
      margin: 2px 0 0;
      font-size: 12px;
      color: var(--color-text-tertiary);
    }
  }

  &__form :deep(.el-form-item__label) {
    color: var(--color-text-secondary);
  }

  &__submit {
    width: 100%;
  }

  &__footer {
    margin-top: 4px;
    text-align: center;
    color: var(--color-text-tertiary);
    font-size: 12px;
  }
}
</style>
