import { BrowserRouter, Route, RouteObject, Routes } from "react-router-dom";
import BaseLayout from "../components/BaseLayout";
import NoMatch from "../components/NoMatch";
import HauntedHouse from "../pages/HauntedHouse";
import Home from "../pages/Home";
import Indoor from "../pages/Indoor";
import Shadows from "../pages/Shadows";

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
          <Route path="/haunted/indoor" element={<Indoor />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
};

export { Router };
