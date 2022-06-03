import { BrowserRouter, Route, RouteObject, Routes } from "react-router-dom";
import BaseLayout from "../components/BaseLayout";
import NoMatch from "../components/NoMatch";
import HauntedHouse from "../pages/HauntedHouse";
import Home from "../pages/Home";
import Indoor from "../pages/Indoor";
import Shadows from "../pages/Shadows";
import Particles from "../pages/Particles";

const Router = () => {
  {
    /* 所有的路由配置均在 BrowserRouter 内部 */
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/shadows" element={<Shadows />} />
          <Route path="/indoor" element={<Indoor />} />
          <Route path="/hauntedHouse" element={<HauntedHouse />} />
          <Route path="/particles" element={<Particles />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
};

export { Router };
