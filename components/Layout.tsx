import { useSession } from "next-auth/react";
import Header from "./Header";
import NotFound from "./NotFound";
import { usePathname } from "next/navigation";

export default function Layout({ children }: any) {
  const pathname = usePathname();
  const { status, data } = useSession({
    required: !/^\/auth[\s\S]+/g.test(pathname),
  });
  if (status === "loading") {
    return "Loading or not authenticated...";
  }
  if (status === "authenticated" && !data) return <NotFound />;
  return (
    <div>
      <Header />
      <div className="mb-20">
        <div className="container">{children}</div>
      </div>
      <footer className="fixed bottom-0 left-0 w-screen bg-primary text-white flex justify-center items-center py-1 text-sm z-50">
        Copyright © {new Date().getFullYear()}
        <a
          href="#"
          className="italic mx-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          @lediepts
        </a>
        All Rights Reserved.
      </footer>
    </div>
  );
}
