"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { GrUserAdmin } from "react-icons/gr";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data } = useSession();
  const pathname = usePathname();
  return (
    <div className="py-2 bg-primary text-white">
      <div className="flex justify-between container gap-2 items-center">
        <Link href="/" className="flex-1 text-xl font-bold flex">
          QUẢN LÝ SHOP
        </Link>
        {data ? (
          <div className="flex justify-end container gap-2 items-center flex-1">
            {data.user.role === "admin" && (
              <GrUserAdmin className="text-yellow-400 text-xl" />
            )}
            <p>{data.user.name.toUpperCase()}</p>
            <button
              className="border text-xs px-2 py-1 rounded"
              onClick={() => signOut()}
            >
              Đăng xuất
            </button>
          </div>
        ) : /^\/auth[\s\S]+/g.test(pathname) ? null : (
          <div className="flex justify-end container gap-2 items-center flex-1">
            <button className="border px-2 rounded " onClick={() => signIn()}>
              login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
