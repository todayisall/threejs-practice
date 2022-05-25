import { Link, Outlet } from "react-router-dom";
import  styles from  "./index.module.less";
const BaseLayout = () => {
  return (
    <div className={styles.layout}>
      {/* A "layout route" is a good place to put markup you want to
              share across all the pages on your site, like navigation. */}
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/shadows">shadows</Link>
          </li>
          <li>
            <Link to="/haunted/indoor">indoor</Link>
          </li>
          <li>
            <Link to="/haunted/hauntedHouse">haunted house</Link>
          </li>
        </ul>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default BaseLayout;
