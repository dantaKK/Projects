import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createStyleImportPlugin({
    libs: [
      {
        libraryName: 'zarm',
        esModule: true,
        resolveStyle: name => `zarm/es/${name}/style/css`
      }
    ]
  })],
  css:{
    modules:{
      localsConvention:'dashesOnly'
    },
   
  },
  resolve:{
    alias:{  // 路径别名
      // 项目的物理路径
      '@':path.resolve(__dirname,'src'),
       'utils':path.resolve(__dirname,'src/utils')
    }
  },
  server:{
    // 代理解决跨域问题
     proxy:{
      '/api':{   
                target:'http://localhost:7001/',
                changeOrigin:true,
                rewrite:(path)=>path.replace(/^\/api/,'')
              }
     
        }
  }
})
