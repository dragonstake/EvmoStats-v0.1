export default {
  // Runtime config: https://nuxtjs.org/docs/directory-structure/nuxt-config/#runtimeconfig
  publicRuntimeConfig: {    
    apiKeybase: 'https://keybase.io/_/api/1.0/',
    apiEvmos: 'http://localhost:1317/',
    backendWs: 'ws://localhost:8082/v1/graphql',    
    backendHttp: 'http://localhost:8082/v1/graphql',    
    theme: '@/assets/scss/themes/evmos.scss',
  },
  privateRuntimeConfig: {
    adminSecret: process.env.ADMIN_SECRET,
  },

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Evmos stats',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/themes/evmos.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: './plugins/vue-gtag.js',
      mode: 'client',
    },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://github.com/nuxt-community/apollo-module
    '@nuxtjs/apollo',
    // https://helmetjs.github.io/
    'nuxt-helmet',
    // https://github.com/markdown-it/markdown-it
    '@nuxtjs/markdownit',
  ],

  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]],
      compact: true,
    },
  },

  // Build configuration: https://github.com/nuxt-community/apollo-module
  apollo: {
    clientConfigs: {
      default: '~/apollo/client-configs/default.js',
    },
  },

  // helmet options
  // @see https://helmetjs.github.io/docs/
  helmet: {
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
    frameguard: {
      action: 'sameorigin',
    },
    hsts: {
      maxAge: 15552000,
    },
    contentSecurityPolicy: false,
  },

  markdownit: {
    runtime: true,
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        loader: 'vue-svg-loader',
      },
    ],
  },
}
