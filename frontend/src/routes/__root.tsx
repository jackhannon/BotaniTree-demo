import { createRootRoute, Outlet } from '@tanstack/react-router';
import InfoCard from '../features/InfoCard/components/InfoCard';
import Header from '../features/header/components/Header';
import {useInfoCardContext} from '../context/InfoCardContext';


const RouteComponent = () => {
  const {catagory, itemId} = useInfoCardContext();

  return (
    <>
      <Header />
      <Outlet />
      <InfoCard key={(catagory + String(itemId))} />
    </>
  );
};

export const Route = createRootRoute({
  component: RouteComponent
});