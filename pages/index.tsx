"use client";
import Link from "next/link";
import { BiCategoryAlt } from "react-icons/bi";
import { FaTrademark } from "react-icons/fa6";
import { IoMdCart } from "react-icons/io";
import {
  MdOutlineSettingsSuggest,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { TbReport } from "react-icons/tb";

const menus = [
  {
    path: "/category",
    icon: <BiCategoryAlt className="text-5xl" />,
    text: <p>Quản lý danh mục</p>,
  },
  {
    path: "/trademark",
    icon: <FaTrademark className="text-5xl" />,
    text: <p>Quản lý thương hiệu</p>,
  },
  {
    path: "/product",
    icon: <MdProductionQuantityLimits className="text-5xl text-pink-500" />,
    text: <p className="text-pink-500 font-semibold">Quản lý sản phẩm</p>,
  },
  {
    path: "/order",
    icon: <IoMdCart className="text-5xl" />,
    text: <p className="font-semibold">Quản lý đơn hàng</p>,
  },
  {
    path: "/report",
    icon: <TbReport className="text-5xl" />,
    text: <p className="font-semibold">Quản lý báo cáo</p>,
  },
  {
    path: "/setting",
    icon: <MdOutlineSettingsSuggest className="text-5xl text-orange-500" />,
    text: <p className="font-semibold text-orange-500">Điều chỉnh</p>,
  },
];

export default function Index() {
  return (
    <div className="flex flex-wrap gap-4 py-[2vh] text-primary justify-center items-center">
      {menus.map((menu) => {
        return (
          <Link
            href={menu.path}
            key={menu.path}
            className="border border-current rounded shadow flex flex-col justify-center items-center h-36 md:h-44 aspect-square p-1 hover:shadow-lg hover:bg-primary/10 text-xs md:text-base"
          >
            {menu.icon}
            {menu.text}
          </Link>
        );
      })}
    </div>
  );
}
