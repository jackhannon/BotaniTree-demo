import { describe, it} from 'vitest';
import { render} from '@testing-library/react'

import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from '../src/routeTree.gen'
import {HeaderProvider} from '../src/context/HeaderContext'
import {PlantProvider} from '../src/context/PlantContext'
import {InfoCardProvider} from '../src/context/InfoCardContext'

describe("individuals", () => {
  const router = createRouter({ routeTree })

  it("tree displays", async () => {
    render(
      <HeaderProvider>
        <PlantProvider>
          <InfoCardProvider>
            <RouterProvider router={router} />
          </InfoCardProvider>
        </PlantProvider>
      </HeaderProvider>
    )
  });



  it("add individual", async () => {
    render(
      <HeaderProvider>
        <PlantProvider>
          <InfoCardProvider>
            <RouterProvider router={router} />
          </InfoCardProvider>
        </PlantProvider>
      </HeaderProvider>
    )
  });



  it("edit tree individual", async () => {
    render(
      <HeaderProvider>
        <PlantProvider>
          <InfoCardProvider>
            <RouterProvider router={router} />
          </InfoCardProvider>
        </PlantProvider>
      </HeaderProvider>
    )
  });


  
  it("remove tree individual", async () => {
    render(
      <HeaderProvider>
        <PlantProvider>
          <InfoCardProvider>
            <RouterProvider router={router} />
          </InfoCardProvider>
        </PlantProvider>
      </HeaderProvider>
    )
  });
}) 