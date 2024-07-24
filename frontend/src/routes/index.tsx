import { createFileRoute } from '@tanstack/react-router'
import PlantView from '../pages/PlantView'
export const Route = createFileRoute('/')({
  component: () => (<PlantView/>)
})