<template>
  <div v-if="isLegacyDay() && !dismissed" ref="panelWrapRef" class="fixed z-[1002] pointer-events-auto" :style="panelWrapStyle" role="dialog" aria-live="polite" aria-label="Cookie preferences">
    <div class="w-[min(96vw,480px)] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden font-sans cb-flash will-change-transform">
      <div class="px-3.5 py-3 border-b border-slate-100">
        <strong class="text-sm">CoolBox values your privacy</strong>
        <div class="text-xs text-gray-500 mt-0.5">Help us calibrate your Experience Enablement Framework.</div>
      </div>

      <div class="grid gap-2 p-3">
        <div v-for="(item, i) in items" :key="item.key" class="flex items-center justify-between gap-3">
          <div class="grid">
            <div class="text-sm font-semibold text-gray-900">{{ item.title }}</div>
            <div class="text-xs text-gray-500">{{ item.desc }}</div>
          </div>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              :checked="toggles[i]"
              @change="onToggleChange(i, $event)"
              class="!dui-toggle !dui-toggle-success !transition-all plain border-solid border-gray-500"
              :aria-checked="toggles[i] ? 'true' : 'false'"
            />
          </label>
        </div>
      </div>

      <div class="p-3 pt-2">
        <div ref="ctaRef" class="relative h-16 group">
          <button
            class="dui-btn dui-btn-primary absolute left-0 top-1/2 -translate-y-1/2 "
            :class="!allOn ? 'opacity-60 pointer-events-none' : ''"
            @click="confirm"
          >
            <span v-if="allOn">
              Confirm Preferences
            </span>
            <template v-else>
              <span  class="group-hover:hidden">
                Confirm Preferences
              </span>
              <span class="hidden group-hover:inline">
                Please enable everything 🥺
              </span>
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- teleport to avoid clipping -->
    <teleport to="body">
      <button
        v-if="isLegacyDay() && !dismissed"
        ref="acceptRef"
        class="dui-btn fixed transition-all duration-150 z-[2147483647] cursor-not-allowed"
        :class="{'transition-none': followPanel }"
        :style="acceptStyle"
        @mouseenter="detachAndDodge"
        @touchstart.prevent="detachAndDodge"
        @click.prevent="makeHarder"
      >
        Accept all (recommended)
      </button>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, reactive, ref} from 'vue'
import type { CSSProperties } from 'vue'
import {failureToast} from "~/utils/apiUtils.js";
import {isLegacyDay} from "~/utils/isLegacyDay.js";

const dismissed = ref(false)

const items = [
  { key: 'essential', title: 'Essential Operations', desc: 'Powers baseline platform continuity and uptime optics.' },
  { key: 'analytics', title: 'Performance & Analytics', desc: 'Unlocks insights to supercharge outcome-driven improvements.' },
  { key: 'personalisation', title: 'Personalisation', desc: 'Tailors experiences for hyper-relevant engagement moments.' },
  { key: 'marketing', title: 'Marketing & Partnerships', desc: 'Enables value-aligned outreach and synergistic affiliations.' },
  { key: 'social', title: 'Social Pixels', desc: 'Facilitates community insights across multi-tenant ecosystems.' },
  { key: 'advertising', title: 'Advertising', desc: 'Drives contextually relevant ad experiences and monetisation.' },
  { key: 'functional', title: 'Functional Enhancements', desc: 'Empowers advanced features for enriched user interactions.' },
]

const toggles = reactive<boolean[]>(Array.from({ length: items.length }, () => false))

function toggle(i: number) {
  flip(i)
  flip(i - 1)
  flip(i + 1)
}
function flip(i?: number) {
  if (i === undefined || i < 0 || i >= toggles.length) return
  toggles[i] = !toggles[i]
}

const allOn = computed(() => toggles.every(Boolean))

function confirm() { dismissed.value = true }

function makeHarder() {
  // randomly flip 3 switches
  for (let k = 0; k < 3; k++) {
    const i = Math.floor(Math.random() * toggles.length)
    toggle(i)
  }

  failureToast("Nuh uh. Please adjust your preferences manually.")
}

// goofy runaway button logic
const ctaRef = ref<HTMLDivElement | null>(null)
const acceptRef = ref<HTMLButtonElement | null>(null)
const acceptPos = reactive({ x: 0, y: 0 })
const placed = ref(false)
const followPanel = ref(true)
const acceptOffset = reactive({ dx: 0, dy: 0 })
const acceptStyle = computed<CSSProperties>(() => ({ left: acceptPos.x + 'px', top: acceptPos.y + 'px', visibility: placed.value ? 'visible' : 'hidden' }))
let rafId: number | null = null

function detachAndDodge() {
  if (followPanel.value) followPanel.value = false
  dodgeRandom()
}

async function placeInitial() {
  const btn = acceptRef.value
  const cta = ctaRef.value
  const panel = panelWrapRef.value
  if (!btn || !panel) return
  const brect = btn.getBoundingClientRect()
  const prect = panel.getBoundingClientRect()

  // help me
  if (cta) {
    const crect = cta.getBoundingClientRect()
    const targetX = Math.max(0, crect.left + crect.width - brect.width)
    const targetY = Math.max(0, crect.top + (crect.height - brect.height) / 2)
    acceptOffset.dx = targetX - prect.left
    acceptOffset.dy = targetY - prect.top
    acceptPos.x = panelPos.x + acceptOffset.dx
    acceptPos.y = panelPos.y + acceptOffset.dy
  } else {
    // backup logic :D
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    acceptOffset.dx = Math.max(8, vw - brect.width - 24) - prect.left
    acceptOffset.dy = Math.max(8, vh - brect.height - 80) - prect.top
    acceptPos.x = panelPos.x + acceptOffset.dx
    acceptPos.y = panelPos.y + acceptOffset.dy
  }
  placed.value = true
}

// dvd-logo movemento
const panelWrapRef = ref<HTMLDivElement | null>(null)
const panelPos = reactive({ x: 0, y: 0 })
const panelVel = reactive({ vx: -80, vy: -60 }) // px/s, starts moving up-left
const panelWrapStyle = computed<CSSProperties>(() => ({ left: panelPos.x + 'px', top: panelPos.y + 'px' }))
let rafPanel: number | null = null
let lastTs: number | null = null

async function placePanelInitial() {
  const el = panelWrapRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  panelPos.x = Math.max(8, vw - rect.width - 16)
  panelPos.y = Math.max(8, vh - rect.height - 16)
  // compute accept offset and position to follow panel initially
  await placeInitial()
}

function stepPanel(ts: number) {
  if (lastTs == null) lastTs = ts
  const dt = Math.min(0.05, (ts - lastTs) / 1000) // clamp dt
  lastTs = ts

  const el = panelWrapRef.value
  if (!el) { rafPanel = requestAnimationFrame(stepPanel); return }
  const rect = el.getBoundingClientRect()
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  let nx = panelPos.x + panelVel.vx * dt
  let ny = panelPos.y + panelVel.vy * dt

  const maxX = Math.max(0, vw - rect.width)
  const maxY = Math.max(0, vh - rect.height)

  if (nx <= 0) { nx = 0; panelVel.vx = Math.abs(panelVel.vx) }
  else if (nx >= maxX) { nx = maxX; panelVel.vx = -Math.abs(panelVel.vx) }

  if (ny <= 0) { ny = 0; panelVel.vy = Math.abs(panelVel.vy) }
  else if (ny >= maxY) { ny = maxY; panelVel.vy = -Math.abs(panelVel.vy) }

  panelPos.x = nx
  panelPos.y = ny

  // while following, keep the accept button anchored to the panel so ppl don't notice it's cursed
  if (followPanel.value) {
    acceptPos.x = panelPos.x + acceptOffset.dx
    acceptPos.y = panelPos.y + acceptOffset.dy
  }

  rafPanel = requestAnimationFrame(stepPanel)
}

function onResizePanel() {
  // ensure position remains in bounds on resize cause I'm taking this too seriously
  const el = panelWrapRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  panelPos.x = Math.min(panelPos.x, Math.max(0, vw - rect.width))
  panelPos.y = Math.min(panelPos.y, Math.max(0, vh - rect.height))
  // recompute accept offset to keep alignment with CTA after resize
  placeInitial()
}

onMounted(async () => {
  await placePanelInitial()
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('resize', onResizePanel, { passive: true })
  rafPanel = requestAnimationFrame(stepPanel)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onResizePanel)
  if (rafPanel) cancelAnimationFrame(rafPanel)
  if (rafId) cancelAnimationFrame(rafId)
})

function onMouseMove(ev: MouseEvent) {
  // don’t dodge while following the panel, wait for interaction
  if (followPanel.value) return
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    const btn = acceptRef.value
    if (!btn) return

    const brect = btn.getBoundingClientRect()
    const cx = ev.clientX
    const cy = ev.clientY
    const bx = brect.left + brect.width / 2
    const by = brect.top + brect.height / 2
    const dx = bx - cx
    const dy = by - cy
    const dist = Math.hypot(dx, dy)
    const threshold = 140

    if (dist < threshold) {
      const nx = dx / (dist || 1)
      const ny = dy / (dist || 1)
      const step = Math.min(240, threshold - dist + 100)
      let newX = (brect.left) + nx * step
      let newY = (brect.top) + ny * step

      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
      const btnW = brect.width
      const btnH = brect.height

      newX = Math.min(Math.max(0, newX), vw - btnW)
      newY = Math.min(Math.max(0, newY), vh - btnH)

      acceptPos.x = newX
      acceptPos.y = newY
    }
  })
}

function dodgeRandom() {
  const btn = acceptRef.value
  if (!btn) return
  const brect = btn.getBoundingClientRect()
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  acceptPos.x = Math.random() * (vw - brect.width)
  acceptPos.y = Math.random() * (vh - brect.height)
}

function onToggleChange(i: number, ev: Event) {
  const el = ev.target as HTMLInputElement
  // set clicked to the browser-calculated value... apparently this seems to work a lot better than vue's reactivity
  toggles[i] = !!el.checked
  // flip neighbors only
  const a = i - 1, b = i + 1
  if (a >= 0) toggles[a] = !toggles[a]
  if (b < toggles.length) toggles[b] = !toggles[b]
}
</script>

<style>
@keyframes cb-flash-kf {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0), 0 0 0 2px rgba(239,68,68,0); border-color: #e5e7eb; }
  50% { box-shadow: 0 0 24px 6px rgba(239,68,68,.45), 0 0 0 2px rgba(239,68,68,1); border-color: #ef4444; }
}
.cb-flash { animation: cb-flash-kf 1.2s ease-in-out infinite !important; }
</style>
