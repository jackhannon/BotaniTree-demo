import { describe, it} from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from '../src/routeTree.gen';
import {HeaderProvider} from '../src/context/HeaderContext';
import {PlantProvider} from '../src/context/PlantContext';
import {InfoCardProvider} from '../src/context/InfoCardContext';
import React from 'react';

describe("info card", () => {
  const router = createRouter({ routeTree });

  it("info card toggles when toggle is clicked", async () => {
    render(
      <HeaderProvider>
        <PlantProvider>
          <InfoCardProvider>
            <RouterProvider router={router} />
          </InfoCardProvider>
        </PlantProvider>
      </HeaderProvider>
    )
    const toggleButton = screen.getByLabelText("toggle-info-card")

    fireEvent.click(toggleButton)

    waitFor(() => {
      expect(screen.getByLabelText("edit-item")).toBeInTheDocument()
    })

    fireEvent.click(toggleButton)

    waitFor(() => {
      expect(screen.getByLabelText("edit-item")).toBeFalsy()
    })
  });
});