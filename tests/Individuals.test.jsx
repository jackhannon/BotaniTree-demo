import { describe, expect, it} from 'vitest';
import {screen, render, waitFor, fireEvent } from '@testing-library/react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from '../src/routeTree.gen';
import {HeaderProvider} from '../src/context/HeaderContext'
import {PlantProvider} from '../src/context/PlantContext'
import {InfoCardProvider} from '../src/context/InfoCardContext'
import React from 'react';


describe("individuals", () => {
  const router = createRouter({ routeTree })
  it("individuals display on tree", async () => {
    render(
      <HeaderProvider>
        <PlantProvider>
          <InfoCardProvider>
            <RouterProvider router={router} />
          </InfoCardProvider>
        </PlantProvider>
      </HeaderProvider>
    )

    await waitFor(() => {
      expect(screen.getByLabelText("tree view")).toBeInTheDocument()
    })

    await waitFor(() => {
      const itemCount = screen.queryAllByLabelText(/item-[\d]+$/).length;
      expect(itemCount).toBeGreaterThan(0); 
    })
  });


  
  it("individuals display on grid", async () => {
    render(
      <HeaderProvider>
        <PlantProvider>
          <InfoCardProvider>
            <RouterProvider router={router} />
          </InfoCardProvider>
        </PlantProvider>
      </HeaderProvider>
    )

    const gridButton = screen.getByLabelText("grid view")
    fireEvent.click(gridButton)

    await waitFor(() => {
      const itemCount = screen.queryAllByLabelText(/item-[\d]+$/).length;
      expect(itemCount).toBeGreaterThan(0); 
    })
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

    const gridButton = screen.getByLabelText("grid view")
    fireEvent.click(gridButton)

    await waitFor(() => {
      expect(screen.queryAllByLabelText("add-new-item").length).toBe(1)
    })

    const addNewItemButton = screen.getByLabelText("add-new-item")

    fireEvent.click(addNewItemButton)

    await waitFor(() => {
      expect(screen.queryByLabelText("name-input")).toBeInTheDocument()
    })
    const nameInput = screen.getByLabelText("name-input");
    const name = "item x";
    fireEvent.change(nameInput, { target: { value: name } });

    const confirmButton = screen.queryByLabelText("confirm-changes");
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.queryByText(name)).toBeInTheDocument();
    })
  });



  it("edit individual", async () => {
    render(
      <HeaderProvider>
        <PlantProvider>
          <InfoCardProvider>
            <RouterProvider router={router} />
          </InfoCardProvider>
        </PlantProvider>
      </HeaderProvider>
    )

    const itemInfoButton = screen.queryByLabelText("item-0-info");
    fireEvent.click(itemInfoButton);
   
    const editButton = screen.queryByLabelText("edit-item");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.queryByLabelText("edit-name")).toBeInTheDocument()
    });

    const nameField = screen.queryByLabelText("name-input");
    const name = "I001 edited";

    fireEvent.change(nameField, { target: { value: "" } });
    fireEvent.change(nameField, { target: { value: name } });

    const confirmSpeciesEditButton = screen.queryByLabelText("confirm-changes");
    fireEvent.click(confirmSpeciesEditButton);
    
    await waitFor(() => {
      expect(screen.queryByText(name)).toBeInTheDocument();
    });
  });



  it("remove individual", async () => {
    render(
      <HeaderProvider>
        <PlantProvider>
          <InfoCardProvider>
            <RouterProvider router={router} />
          </InfoCardProvider>
        </PlantProvider>
      </HeaderProvider>
    )

    const itemInfoButton = screen.queryByLabelText("item-0-info");
    fireEvent.click(itemInfoButton);
   
    const editButton = screen.queryByLabelText("edit-item");
    fireEvent.click(editButton);

    const nameField = screen.queryByLabelText("name-input");
    const name = nameField.value;
    

    await waitFor(() => {
      expect(screen.queryByLabelText("delete-item")).toBeInTheDocument()
    })
    const deleteButton = screen.queryByLabelText("delete-item");
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.queryByText(name)).toBeNull();
    })
  });
}) 