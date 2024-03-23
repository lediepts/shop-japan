import dbConnect from "@/dbConnect";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toCsv } from "react-csv-downloader";
import Category from "../../models/Category";
import Product from "../../models/Product";
import Trademark from "../../models/Trademark";
import { ICategory, IProduct, ITrademark } from "../../types/interface";

const noImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEcElEQVR4nO1aS6gcRRSd+P+ulIifGH8rMeBvIYiJih9UhAiOyZu6nQExE1CfKEHw9b1N+wE/4EZEjMaIC1GXigEXfnAhCkHFjSuJQhTJIipE3szc25qSWz0zjpN5M857PV1Ppw4UU9XV1V3nTN1bVbe6UgkICAgICAgICPhvY2u6eI5J5LrKLALS1iWA8qOmyqyhnrYuMCg/AHEzwuymyiyhHshL+OejsoZ9LcluAOK9gPKl72SIDwGJdb+D9cR7DWbXF25rQNw0xIe9kic5oMS1LyPEOaz1NWyuL0yACDnSF/v0sr2pboy317q8rxwV9/JEGvrQWiJXjbu30bDHG+THdWFSNnmF9tGNkkQapQiQpvYYQHlgLrVnajkivqJjn/dpufqIPRmIn1jukJyEvBcBorR5fm6X8s4wAQD5SVeO23dNm7wXARRKXuu3YHPdoAl0PPZX1ao9tjJl8iUKYNcA8TMmzu7Qkg5/vUfN4ai2mN24LV48V/MmlmsMyes6aqZBvjQB6qk9CYh/7UxJu3ovJ95gSF4D4i8MybsGeU7F0jo1CSA+Yojbo5zpSsiXagJbsLkOSN4A5Oe1HFF2u5IDlP2AsgeQP3EdQdmt9Yb4HoPythKcFnlvPmB+3p4IxD8b4g90dPQ6g7zdzclJduvYdxRAvhQBGrmTe9agvAKxPKT1Gohw9TFfflRbkm8N8st5vr1Z2xniF/rXCUWRL0UASO1aQP7FTW0o37iXxtltrpwunjfY1iB/akjedM9R03DtuFVD2Vg0eW8mYGJ7NhD/USPZ+Y/OpK2L3B4iloeHPrdg8qULEMVydS2RazVvkF8EZNZVn053gGwMyfcarbn3UXt6GeRLEyDV5S/xLjetIX+u15xvIH7O7dTylaGuBj8GbF1YFvnSBKim9gS3NVWbTu3a/nsbqT0FFviywetlkPfnA5DnDPJvXdK5h88XQEWR11GnjlNnnGErTm8CVFN7GhAfNCQ/6b+fOz4d/u27iyKvPgSQP+qaluaH+RUvAtRdtEgjNe3NS3WgAPKfdZbRT2nSvF4bJoIXE+jH1gV7llsVduJyRZGHRB7sXtf8UiJ4F6Afo8ibmK/U3aSaUGUC8uNEWDUCwBLk8wgSv9SbKlG+U78xCflRIqwKAWAk+Xw5DCRvGZQdBnlRfcg2bF08CflhImxK7XHeBYB/Qx5lT3cq04BJVwTdTE1CvguTyP3aXgMzXgWACcn32vVE4COTkh+ENwFgmeS7w96gfL1S8t4EqC95SmvXaCxgFHnYaU/VLXO+r5D5lfbVy0LIrBLy5QVEqBsQ9ZJe7To+g/xn387zUPSYPaO8kBjxh30HlbtdqKuEBHH7Tu2Tzhg6wv6u46enNg1GncNRg9ktZWxpVwJIsps7IwIKe2gNm+s1jgfIv489n/f/7YA7Hh93+LIMEWQjIO8bdz7vP/H7USKbKkWjHj5IkvBBUrTKHN7UUZ/lYa8AlPdmlrzCLLQv1RC3KwQEBAQEBAQEBFT+V/gLekIrfWmA73EAAAAASUVORK5CYII=`;
export default function Index() {
  const [state, setState] = useState("init");
  const [data, setData] = useState<IProduct[]>([]);
  const [trademarks, setTrademarks] = useState<ITrademark[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data: products } = await axios<IProduct[]>("/api/product");
        const { data: tm } = await axios<ITrademark[]>("/api/trademark");
        const { data: ct } = await axios<ICategory[]>("/api/category");
        setData(products);
        setCategories(ct);
        setTrademarks(tm);
      } catch (err) {
        console.log(err);
      } finally {
        setState("finished");
      }
    })();
  }, []);

  const columns = useMemo<MRT_ColumnDef<IProduct>[]>(
    () => [
      {
        accessorKey: "image", //access nested data with dot notation
        header: "Ảnh",
        size: 150,
        Cell: ({ cell }) => {
          const img = cell.getValue<string[]>()[0];
          return <img src={img || noImage} alt="" className="w-16 h-16" />;
        },
      },
      {
        accessorKey: "name", //access nested data with dot notation
        header: "Tên SP",
        enableClickToCopy: true,
        size: 150,
      },
      {
        accessorKey: "description", //access nested data with dot notation
        header: "Chi tiết",
        size: 300,
        Cell: ({ cell }) => (
          <Box
            component="div"
            className="max-h-32 overflow-auto"
            dangerouslySetInnerHTML={{ __html: cell.getValue<string>() }}
          ></Box>
        ),
      },
      {
        accessorKey: "price", //access nested data with dot notation
        header: "Giá",
        filterFn: "between",
        size: 100,
        Cell: ({ cell }) => (
          <Box component="span">
            {cell.getValue<number>()?.toLocaleString?.("ja-JP", {
              style: "currency",
              currency: "JPY",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Box>
        ),
      },
      {
        accessorKey: "categoryId", //access nested data with dot notation
        header: "Danh mục",
        size: 150,
        Cell: ({ cell }) => {
          const name = categories.find(
            (f) => f._id === cell.getValue<string>()
          );
          return <Box component="span">{name?.name || ""}</Box>;
        },
      },
      {
        accessorKey: "trademarkId", //access nested data with dot notation
        header: "Thương hiệu",
        size: 150,
        Cell: ({ cell }) => {
          const name = trademarks.find(
            (f) => f._id === cell.getValue<string>()
          );
          return <Box component="span">{name?.name || ""}</Box>;
        },
      },
    ],
    []
  );
  const handleExportRows = async () => {
    const csvData = await toCsv({
      columns: columns.map((v) => v.header),
      datas: data.map((row) =>
        columns.reduce((p, c) => {
          const key = c.accessorKey;
          const value = (row as any)[`${key}`];
          return {
            ...p,
            [c.header]: value,
          };
        }, {} as { [key: string]: any })
      ),
      separator: ",",
      wrapColumnChar: '"',
    });
    if (typeof csvData === "string") {
      const fn = "SP_" + format(new Date(), "dd.MM.yyyy_HH.mm");
      const csvContent = "data:text/csv;charset=utf-8," + csvData;
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", fn + ".csv");
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        link.remove();
      }, 5000);
    }
  };
  const table = useMaterialReactTable({
    columns,
    data,
    enableEditing: true,
    editDisplayMode: "row",
    localization: MRT_Localization_VI,
    state: {
      density: "compact",
    },
    getRowId: (row) => row._id,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <Tooltip title="Edit">
          <Link href={"/product/" + row.original._id}>
            <IconButton color="info">
              <EditIcon />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={async () => {
              if (
                window.confirm(
                  `Bạn chắc chắn muốn xoá ${row.original.name} chứ?`
                )
              ) {
                try {
                  await axios.delete(`/api/product/${row.original._id}`);
                  setData(data.filter((f) => f._id !== row.original._id));
                } catch (error) {
                  console.log(error);
                }
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <div className="py-4 flex flex-col gap-4">
      <Link href="/" className="link">
        Quay lại
      </Link>
      <Stack gap={1} direction="row">
        <Link href={"/product/create"}>
          <Button
            variant="contained"
            sx={{
              minWidth: 120,
            }}
            color="success"
          >
            Thêm sản phẩm
          </Button>
        </Link>
        <Button
          disabled={data.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() => handleExportRows()}
          startIcon={<FileDownloadIcon />}
        >
          Xuất dữ liệu sang excel
        </Button>
      </Stack>
      {state === "finished" ? (
        <MaterialReactTable table={table} />
      ) : (
        <div className="h-44 skeleton-box flex items-center justify-center">
          <p className="text-center">Đang tải dữ liệu...</p>
        </div>
      )}
    </div>
  );
}
