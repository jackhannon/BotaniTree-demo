import { describe, it} from 'vitest';
import { render } from '@testing-library/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from '../src/routeTree.gen';
import {HeaderProvider} from '../src/context/HeaderContext';
import {PlantProvider} from '../src/context/PlantContext';
import {InfoCardProvider} from '../src/context/InfoCardContext';
import React from 'react';

describe("info card", () => {
  const router = createRouter({ routeTree });

  it("info card opens", async () => {
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


  
  it("info card closes", async () => {
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
});