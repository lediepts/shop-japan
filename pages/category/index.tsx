import dbConnect from "@/dbConnect";
import { yupResolver } from "@hookform/resolvers/yup";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import {
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toCsv } from "react-csv-downloader";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import DialogConfirm from "../../components/DialogConfirm";
import Category from "../../models/Category";
import { ICategory } from "../../types/interface";

interface FormInput {
  name: string;
  alias: string;
}

export default function Index({
  data: { categories },
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState<"create" | string>();
  const [data, setData] = useState(categories);

  const schema = yup.object({
    name: yup
      .string()
      .uppercase()
      .trim()
      .required("Yêu cầu bắt buộc nhập")
      .min(2, "Nhập ít nhất 2 kí tụ"),
    alias: yup
      .string()
      .uppercase()
      .trim()
      .required("Yêu cầu bắt buộc nhập")
      .min(3, "Nhập ít nhất 3 kí tụ")
      .max(5, "Nhập tối đa 5 kí tự")
      .matches(/^[A-z]+$/, "Chỉ được phép nhập 3-5 kí tự không phải số."),
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      alias: "",
    },
  });

  const columns = useMemo<MRT_ColumnDef<ICategory>[]>(
    () => [
      {
        accessorKey: "name", //access nested data with dot notation
        header: "Tên danh mục",
        size: 150,
      },
      {
        accessorKey: "alias",
        header: "Kí hiệu",
        size: 150,
      },
    ],
    []
  );
  const handleExportRows = async (rows: MRT_Row<ICategory>[]) => {
    const csvData = await toCsv({
      columns: columns.map((v) => v.header),
      datas: rows.map((row) =>
        columns.reduce((p, c) => {
          const key = c.accessorKey as any;
          const tmp = row.original as any;
          return {
            ...p,
            [c.header]: tmp[key],
          };
        }, {} as any)
      ),
      separator: ",",
      wrapColumnChar: '"',
    });
    if (typeof csvData === "string") {
      const fn = "danh_muc_" + format(new Date(), "dd.MM.yyyy_HH.mm");
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
    renderTopToolbarCustomActions: () => (
      <Stack direction="row" gap={1}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setOpenDialog("create");
          }}
        >
          Thêm
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Xuất dữ liệu sang excel
        </Button>
      </Stack>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <Tooltip title="Edit">
          <IconButton
            color="info"
            onClick={() => {
              setValue("name", row.original.name);
              setValue("alias", row.original.alias);
              setOpenDialog(row.original._id);
            }}
          >
            <EditIcon />
          </IconButton>
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
                  await axios.delete(`/api/category/${row.original._id}`);
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

  const onSubmit: SubmitHandler<FormInput> = async ({ alias, name }) => {
    try {
      setLoading(true);
      if (openDialog === "create") {
        const { data: newItem } = await axios.post<ICategory>("/api/category", {
          alias,
          name,
        });
        setData([...data, newItem]);
      } else {
        await axios.put<ICategory>(`/api/category/${openDialog}`, {
          alias,
          name,
        });
        const index = data.findIndex((f) => f._id === openDialog);
        if (index >= 0) {
          const tmp = [...data];
          tmp.splice(index, 1, { ...tmp[index], name, alias });
          setData(tmp);
        }
      }
      setLoading(false);
      reset();
      setOpenDialog(undefined);
    } catch (_) {
      alert(
        "Có lỗi xảy ra do tên hoặc kí hiệu đã tồn tại hoặc chưa đủ độ dài yêu cầu"
      );
      setLoading(false);
    }
  };
  return (
    <div className="py-4">
      <div className="pb-4">
        <Link href="/" className="link">
          Quay lại
        </Link>
      </div>
      <DialogConfirm
        open={!!openDialog}
        handleClose={() => {
          reset();
          setOpenDialog(undefined);
        }}
        title={openDialog === "create" ? "Thêm danh mục" : "Cập nhật danh mục"}
        loading={loading}
        disabled={Object.keys(errors).length > 0}
        handleSubmit={handleSubmit(onSubmit)}
        component="form"
      >
        <Stack gap={2}>
          <TextField
            variant="standard"
            required
            fullWidth
            label={"Tên danh mục"}
            placeholder="Vui lòng nhập tên danh mục"
            InputLabelProps={{ shrink: true }}
            {...register("name")}
            error={"name" in errors}
            helperText={errors.name?.message}
          />
          <TextField
            variant="standard"
            required
            fullWidth
            label={"Kí hiệu danh mục"}
            placeholder="Vui lòng nhập kí hiệu danh mục độ dài từ 3 đến 5 kí tự"
            InputLabelProps={{ shrink: true }}
            {...register("alias")}
            error={"alias" in errors}
            helperText={errors.alias?.message}
          />
        </Stack>
      </DialogConfirm>
      <MaterialReactTable table={table} />
    </div>
  );
}

export const getStaticProps = (async () => {
  await dbConnect();
  const categories = (
    (await Category.find().sort({ name: -1 }).lean().exec()) as ICategory[]
  ).map((v) => ({ ...v, _id: v._id.toString() }));
  return {
    props: {
      data: {
        categories,
      },
    },
  };
}) satisfies GetStaticProps;
