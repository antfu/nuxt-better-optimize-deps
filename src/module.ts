import { defineNuxtModule } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

const excludeList = [
  // Vue
  'vue',
  '@vue/runtime-core',
  '@vue/runtime-dom',
  '@vue/reactivity',
  '@vue/shared',
  '@vue/devtools-api',
  'vue-router',
  'vue-demi',

  // Nuxt Deps
  'pathe',
  'unenv',
  'klona',
  'devalue',
  'hookable',
  'unctx',
  'h3',
  'ofetch',
  'ufo',

  // Ecosystem
  'pinia',
  '@vueuse/core',
  '@vueuse/shared',
  '@vueuse/math',
]

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-better-optimize-deps',
    configKey: 'betterOptimizeDeps',
  },
  defaults: {},
  setup(_options, nuxt) {
    nuxt.hook('vite:extendConfig', (config, { isServer }) => {
      // Force disable server side discovery
      if (isServer) {
        config.optimizeDeps ||= {}
        config.optimizeDeps.noDiscovery = true
        return
      }

      config.optimizeDeps ||= {}
      // Remove excluded items from include list
      config.optimizeDeps.include = config.optimizeDeps.include?.filter(x => !excludeList.includes(x)) || []
      // Add excluded items
      config.optimizeDeps.exclude = Array.from(new Set([
        ...config.optimizeDeps.exclude || [],
        ...excludeList,
      ]))
    })
  },
})
