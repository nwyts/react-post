import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-11/12 md:w-8/12 lg:w-6/12 xl:w-3/12">
        <Outlet />
      </div>
    </div>
  );
}
