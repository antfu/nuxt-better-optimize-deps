import { defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  /**
   * Exclude known dependencies from the ecosystem
   *
   * @default true
   */
  ecosystem?: boolean
  /**
   * Additional dependencies to exclude from optimization
   */
  exclude?: string[]
}

// Later these should provided by Nuxt by default
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
  'defu',
  'ofetch',
  'ufo',
  '@unhead/vue',
]

const ecosystemList = [
  // Ecosystem - later they should be providede by the ecosystem module
  'pinia',
  '@vueuse/core',
  '@vueuse/shared',
  '@vueuse/math',
  'primevue',
  'shiki',
]

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-better-optimize-deps',
    configKey: 'betterOptimizeDeps',
  },
  defaults: {
    ecosystem: true,
  },
  setup(options, nuxt) {
    nuxt.hook('vite:extendConfig', (config, { isServer }) => {
      // Force disable server side discovery
      if (isServer) {
        config.optimizeDeps ||= {}
        config.optimizeDeps.noDiscovery = true
        return
      }

      const list = [
        ...excludeList,
      ]

      if (options.ecosystem)
        list.push(...ecosystemList)

      if (options.exclude)
        list.push(...options.exclude)

      config.optimizeDeps ||= {}
      // Remove excluded items from include list
      config.optimizeDeps.include = config.optimizeDeps.include
        ?.filter(x => !list.includes(x)) || []
      // Add excluded items
      config.optimizeDeps.exclude = []

      for (const item of list) {
        if (!config.optimizeDeps.exclude.includes(item))
          config.optimizeDeps.exclude.push(item)
      }
    })
  },
})
