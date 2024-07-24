import { describe, expect, it} from 'vitest';
import {screen, render, waitFor, fireEvent } from '@testing-library/react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from '../src/routeTree.gen';
import {HeaderProvider} from '../src/context/HeaderContext'
import {PlantProvider} from '../src/context/PlantContext'
import {InfoCardProvider} from '../src/context/InfoCardContext'


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
      expect(screen.queryAllByLabelText(/item-[\d]+$/).length).toBe(0)
    })

    await waitFor(() => {
      expect(screen.queryAllByLabelText("add-new-item").length).toBe(1)
    })

    const createButton = screen.queryByLabelText("add-new-item");
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.queryByLabelText("name-input")).toBeInTheDocument()
    })

    const nameField = screen.queryByLabelText("name-input");
    const name = "item 1"

    fireEvent.change(nameField, { target: { value: name } });

    const confirmButton = screen.queryByLabelText("confirm-changes");
    fireEvent.click(confirmButton)
    screen.debug()

    await waitFor(() => {
      expect(screen.queryAllByLabelText(/item-[\d]+$/).length).toBe(1)
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

    const individual = screen.getByLabelText(/item-[\d]+$/)
    fireEvent.click(individual)

    const gridButton = screen.getByLabelText("grid view")
    fireEvent.click(gridButton)

    await waitFor(() => {
      expect(screen.queryAllByLabelText("add-new-item").length).toBe(1)
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

    const confirmButton = screen.queryByLabelText("confirm-changes");
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.queryAllByLabelText(/item-[\d]+$/).length).toBe(1)
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

    await waitFor(() => {
      expect(screen.queryByLabelText("delete-item")).toBeInTheDocument()
    })
    const deleteButton = screen.queryByLabelText("delete-item");
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.queryAllByLabelText(/item-[\d]+$/).length).toBe(0)
    })
  });
}) 