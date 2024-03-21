import Link from "next/link";
import React from "react";

export default function Custom404() {
  return (
    <div className="h-[80vh] flex flex-col">
      <div className="flex-1 flex justify-center items-center flex-col gap-4">
        <h1 className="text-7xl font-bold text-center tracking-widest text-red-500">
          404
        </h1>
        <h2 className="text-sm md:text-xl text-center">
          Không tìm thấy trang.<br/> Kiểm tra lại đường dẫn hoặc quay về trang chủ!
        </h2>
        <Link
          href="/"
          className="text-blue-600 border px-4 rounded py-1 underline border-current"
        >
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
