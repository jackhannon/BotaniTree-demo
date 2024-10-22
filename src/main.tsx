import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import {HeaderProvider} from './context/HeaderContext'
import {PlantProvider} from './context/PlantContext'
import {InfoCardProvider} from './context/InfoCardContext'

const router = createRouter({ routeTree, basepath: import.meta.env.BASE_URL })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeaderProvider>
      <PlantProvider>
        <InfoCardProvider>
          <RouterProvider router={router}/>
        </InfoCardProvider>
      </PlantProvider>
    </HeaderProvider>
  </React.StrictMode>,
)
