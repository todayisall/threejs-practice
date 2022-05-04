import { Link, Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
              share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/shadows">shadows</Link>
          </li>
          <li>
            <Link to="/haunted/house">indoor</Link>
          </li>
        </ul>
      </nav>

      <hr />
      <Outlet />
    </div>
  );
};

export default BaseLayout;
