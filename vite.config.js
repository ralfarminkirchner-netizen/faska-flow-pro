import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const pagesBase = '/faska-flow-pro/'
const publicAssetDirectories = [
  'animal-friends',
  'illustrations',
  'klebensfrei',
  'premium',
  'premium-sky',
  'rap',
  'sky-bitmaps',
  'textures',
]

// Public assets are referenced throughout the existing app with root-relative
// URLs. Prefix only those known directories during the Pages build so the
// regular root deployment keeps its current behavior.
const publicAssetBasePlugin = (base) => {
  const directories = publicAssetDirectories.join('|')
  const rootAssetPattern = new RegExp(`(["'\`])\\/(${directories})\\/`, 'g')

  return {
    name: 'faska-public-asset-base',
    enforce: 'pre',
    transform(code, id) {
      if (!/\.[jt]sx?$/.test(id)) return null

      const transformed = code.replace(
        rootAssetPattern,
        (_, quote, directory) => `${quote}${base}${directory}/`,
      )

      return transformed === code ? null : { code: transformed, map: null }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === 'pages' ? pagesBase : '/'

  return {
    base,
    plugins: [
      publicAssetBasePlugin(base),
      tailwindcss(),
      react()
    ],
    preview: {
      allowedHosts: [".up.railway.app"],
    },
    build: {
      minify: false,
      chunkSizeWarningLimit: 5000,
    }
  }
})
