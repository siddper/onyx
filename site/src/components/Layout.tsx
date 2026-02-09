import { Outlet } from "react-router";
import Nav from "./Nav";

export default function Layout() {
  return (
    <div className="bg-bg min-h-screen text-ink">
      <Nav />
      <Outlet />
    </div>
  );
}
