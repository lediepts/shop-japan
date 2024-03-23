"user client";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Stack, TextField } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  MdDelete,
  MdOutlineChevronLeft,
  MdOutlineChevronRight,
} from "react-icons/md";
import BodyEditor from "../../components/BodyEditor";
import UploadImage from "../../components/UploadImage";
import { ICategory, IProduct, ITrademark } from "../../types/interface";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dbConnect from "@/dbConnect";
import Category from "../../models/Category";
import Trademark from "../../models/Trademark";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { useRouter } from "next/navigation";

interface FormInput extends Omit<IProduct, "_id"> {}

export default function Create({
  data: { categories, trademarks },
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const schema = yup.object({
    name: yup.string().trim().required("Yêu cầu bắt buộc nhập").uppercase(),
    description: yup.string().trim().required("Yêu cầu bắt buộc nhập"),
    image: yup.array().required(),
    categoryId: yup.string().required("Yêu cầu bắt buộc nhập"),
    trademarkId: yup.string().required("Yêu cầu bắt buộc nhập"),
    price: yup
      .number()
      .required("Yêu cầu bắt buộc nhập")
      .transform((val) => parseInt(val)),
    other: yup.string(),
  });
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      image: [],
      price: 1,
      categoryId: "",
      trademarkId: "",
      other: "",
    },
  });
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      setLoading(true);
      await axios.post<IProduct>("/api/product", data);
      setLoading(false);
      reset();
      router.push("/product");
    } catch (_) {
      alert(
        "Có lỗi xảy ra do tên hoặc kí hiệu đã tồn tại hoặc chưa đủ độ dài yêu cầu"
      );
      setLoading(false);
    }
  };
  const { image, description, other, categoryId, trademarkId } = getValues();
  return (
    <Box
      maxWidth="md"
      mx="auto"
      p={1}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Link href="/product" className="link">
        Quay lại
      </Link>
      <p className="text-xl font-semibold">Thêm sản phẩm</p>
      <div className="border flex flex-col gap-2 p-2">
        <p>Ảnh sản phầm</p>
        <div className="flex flex-col md:flex-row gap-2 justify-start items-center flex-wrap">
          {image.map((img, i) => {
            return (
              <div
                key={i}
                className="border p-1 rounded shadow w-[200px] aspect-square relative"
              >
                <img src={img} className="w-full h-full object-contain" />
                <div className="absolute bottom-0 left-0 w-full h-10 bg-white/70 shadow flex justify-center items-center gap-4">
                  <Button
                    color="info"
                    variant="contained"
                    sx={{
                      minWidth: 0,
                      p: 1,
                      borderRadius: "50%",
                    }}
                    className="rotate-90 md:rotate-0"
                    disabled={i === 0}
                    onClick={() => {
                      const tmp = [...image];
                      const n = tmp[i - 1];
                      if (n) {
                        tmp[i - 1] = tmp[i];
                        tmp[i] = n;
                        setValue("image", tmp, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    <MdOutlineChevronLeft />
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    sx={{
                      minWidth: 0,
                      p: 1,
                      borderRadius: "50%",
                    }}
                    onClick={() => {
                      const tmp = [...image];
                      tmp.splice(i, 1);
                      setValue("image", tmp, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <MdDelete />
                  </Button>
                  <Button
                    color="info"
                    variant="contained"
                    sx={{
                      minWidth: 0,
                      p: 1,
                      borderRadius: "50%",
                    }}
                    className="rotate-90 md:rotate-0"
                    disabled={i === image.length - 1}
                    onClick={() => {
                      const tmp = [...image];
                      const n = tmp[i + 1];
                      if (n) {
                        tmp[i + 1] = tmp[i];
                        tmp[i] = n;
                        setValue("image", tmp, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    <MdOutlineChevronRight />
                  </Button>
                </div>
              </div>
            );
          })}
          <UploadImage
            onChange={(data) =>
              setValue("image", [...image, data], {
                shouldValidate: true,
              })
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Autocomplete
          disablePortal
          options={categories.map((v) => v._id)}
          fullWidth
          value={categoryId}
          getOptionLabel={(option) => {
            const tmp = categories.find((f) => f._id === option);
            return tmp?.name || "";
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={"Danh mục"}
              required
              size="small"
              variant="outlined"
              error={"categoryId" in errors}
            />
          )}
          onChange={(_event, selectedOption) => {
            if (selectedOption) {
              setValue("categoryId", selectedOption, {
                shouldValidate: true,
              });
            }
          }}
        />
        <Autocomplete
          disablePortal
          options={trademarks.map((v) => v._id)}
          fullWidth
          value={trademarkId}
          getOptionLabel={(option) => {
            const tmp = trademarks.find((f) => f._id === option);
            return tmp?.name || "";
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={"Thương hiệu"}
              required
              size="small"
              variant="outlined"
              error={"trademarkId" in errors}
            />
          )}
          onChange={(_event, selectedOption) => {
            if (selectedOption) {
              setValue("trademarkId", selectedOption, {
                shouldValidate: true,
              });
            }
          }}
        />
        <TextField
          variant="outlined"
          required
          fullWidth
          size="small"
          label={"Tên sản phẩm"}
          placeholder="Vui lòng nhập tên sản phẩm"
          {...register("name")}
          error={"name" in errors}
          helperText={errors.name?.message}
        />
        <BodyEditor
          id="description"
          title="Chi tiết sản phẩm"
          setValue={(val) => {
            setValue("description", val, { shouldValidate: true });
          }}
          value={description}
          error={"description" in errors}
        />
        <TextField
          variant="outlined"
          margin="dense"
          size="small"
          required
          fullWidth
          label={"Giá"}
          type="number"
          placeholder="Vui lòng nhập giá sản phẩm"
          {...register("price")}
          error={"price" in errors}
          helperText={errors.price?.message}
        />
        <TextField
          variant="outlined"
          required
          fullWidth
          label={"Lưu ý,Chú thích(Memo)"}
          multiline
          minRows={5}
          placeholder="Nhập lưu ý ..."
          InputLabelProps={{ shrink: true }}
          {...register("other")}
          error={"other" in errors}
          helperText={errors.other?.message}
        />
        <div>
          <LoadingButton
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            sx={{
              minWidth: 120,
              textAlign: "center",
            }}
            className="flex items-center gap-2"
            color="success"
            disabled={Object.keys(errors).length > 0}
            loading={loading}
          >
            Lưu
            <SaveAsIcon />
          </LoadingButton>
        </div>
      </div>
    </Box>
  );
}
export const getStaticProps = (async () => {
  await dbConnect();
  const categories = (
    (await Category.find().sort({ name: -1 }).lean().exec()) as ICategory[]
  ).map((v) => ({ ...v, _id: v._id.toString() }));
  const trademarks = (
    (await Trademark.find().sort({ name: -1 }).lean().exec()) as ITrademark[]
  ).map((v) => ({ ...v, _id: v._id.toString() }));
  return {
    props: {
      data: {
        categories,
        trademarks,
      },
    },
  };
}) satisfies GetStaticProps;
