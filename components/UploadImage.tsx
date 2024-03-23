import {
  flipImage,
  loadCanvasAndResize,
  rotateImage90Deg,
  rotateImageMinus90Deg,
} from "@/converts";
import CropIcon from "@mui/icons-material/Crop";
import FlipIcon from "@mui/icons-material/Flip";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import { Button, Stack } from "@mui/material";
import "cropperjs/dist/cropper.css";
import { createRef, useEffect, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { AiOutlineCloudUpload } from "react-icons/ai";
import DialogConfirm from "./DialogConfirm";
import { FaSyncAlt } from "react-icons/fa";
import { BiReset } from "react-icons/bi";

interface Props {
  value?: string;
  onChange: (val: string) => void;
}
export default function UploadImage({ value, onChange }: Props) {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string>();
  const [cropData, setCropData] = useState<string>();
  const cropperRef = createRef<ReactCropperElement>();
  const [state, setState] = useState(0);

  useEffect(() => {
    if (value) setImage(value);
  }, []);
  useEffect(() => {
    if (image) {
      setTimeout(() => {
        setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      }, 100);
    }
  }, [image]);

  function reset() {
    form.current?.reset();
    setImage(undefined);
    setCropData(undefined);
    setState(0);
  }
  const handleUpload = async () => {
    setLoading(true);
    try {
      if (!image && !cropData) throw "error";
      onChange(cropData || image || "");
      setLoading(false);
      reset();
    } catch (_) {
      setLoading(false);
    }
  };
  return (
    <>
      <Button variant="outlined" color="success" size="small" component="label">
        <AiOutlineCloudUpload fontSize={20} style={{ marginRight: 4 }} />
        Thêm ảnh
        <form ref={form}>
          <input
            hidden
            accept=".jpg,.jpeg,.png,.webp,.svg"
            multiple
            type="file"
            onChange={async (e) => {
              if (e.target.files && e.target.files.length) {
                const f = e.target.files[0];
                if (f.size > 1024 * 1024 * 10) {
                  reset();
                  return alert("File is too big!");
                }
                const base64 = await loadCanvasAndResize(f);
                setImage(base64);
              } else {
                reset();
              }
            }}
          />
        </form>
      </Button>
      {image && (
        <DialogConfirm
          open={true}
          loading={loading}
          handleClose={() => {
            reset();
          }}
          disabled={state !== 1 || !cropData}
          maxWidth="lg"
          handleSubmit={handleUpload}
          primaryButtonText="lưu ảnh"
        >
          <Stack alignItems="center">
            <div className="flex flex-col md:flex-row gap-2 items-center">
              {state === 0 && (
                <div className="flex-1 flex flex-col gap-2 items-center ">
                  <Button
                    color="warning"
                    variant="contained"
                    sx={{
                      minWidth: 0,
                      p: 2,
                    }}
                    onClick={() => {
                      if (typeof cropperRef.current?.cropper !== "undefined") {
                        setCropData(
                          cropperRef.current?.cropper
                            .getCroppedCanvas()
                            .toDataURL()
                        );
                        setState(1);
                      }
                    }}
                  >
                    <CropIcon />
                  </Button>
                  <Cropper
                    ref={cropperRef}
                    aspectRatio={1 / 1}
                    src={image}
                    viewMode={1}
                    minCropBoxHeight={50}
                    minCropBoxWidth={50}
                    responsive
                    autoCropArea={1}
                    rotatable
                  />
                </div>
              )}
              {state === 1 && (
                <div className="flex-1">
                  <div className="flex gap-2 justify-center items-center border shadow p-1">
                    <Button
                      color="warning"
                      variant="outlined"
                      size="small"
                      onClick={async () => {
                        setState(0);
                        setCropData("");
                      }}
                    >
                      <BiReset className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={async () => {
                        const tmp = await rotateImageMinus90Deg(cropData);
                        setCropData(tmp);
                      }}
                    >
                      <RotateLeftIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={async () => {
                        const tmp = await rotateImage90Deg(cropData);
                        setCropData(tmp);
                      }}
                    >
                      <RotateRightIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={async () => {
                        const tmp = await flipImage(cropData);
                        setCropData(tmp);
                      }}
                    >
                      <FlipIcon />
                    </Button>
                  </div>
                  <img src={cropData || image} alt="cropped" />
                </div>
              )}
            </div>
          </Stack>
        </DialogConfirm>
      )}
    </>
  );
}
