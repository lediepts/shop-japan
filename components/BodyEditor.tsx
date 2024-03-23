"use client";
import { Box, Stack, Typography } from "@mui/material";
import { useEffect } from "react";

interface Props {
  value: string;
  title: string;
  id?: string;
  error?: boolean;
  setValue: (val: string) => void;
}
export default function BodyEditor({
  title,
  id = "honbun",
  value = "",
  error,
  setValue,
}: Props) {
  useEffect(() => {
    const div = document.createElement("div");
    const honbun = document.getElementById(id)!;
    honbun.innerHTML = "";
    honbun.appendChild(div);
    const { SUNEDITOR } = window as any;
    const editor = SUNEDITOR.create(div, {
      stickyToolbar: "0",
      defaultStyle: "font-size:16px;padding:0;",
      tagsBlacklist: "script|link|meta",
      pasteTagsBlacklist: "script|link|meta",
      defaultTag: "p",
      display: "block",
      popupDisplay: "full",
      minHeight: "200px",
      height: "100%",
      fontSize: [8, 10, 12, 14, 16, 18, 20, 24, 36, 48],
      fontSizeUnit: "px",
      placeholder: "Nhập văn bản ...",
      charCounter: true,
      buttonList: [
        [
          "undo",
          "redo",
          "fontSize",
          "formatBlock",
          "blockquote",
          "bold",
          "underline",
          "italic",
          "strike",
          "subscript",
          "superscript",
          "fontColor",
          "hiliteColor",
          "removeFormat",
          "outdent",
          "indent",
          "align",
          "list",
          "table",
          "link",
          "image",
        ],
      ],
    });
    editor.onChange = (contents: string) => {
      setValue(contents);
    };
    return () => {
      editor.destroy();
    };
  }, []);

  return (
    <Stack
      gap={1}
      sx={{
        flex: 1,
        maxWidth: "100%",
        "& p": {
          m: "0 !important",
        },
      }}
    >
      <Box
        component="fieldset"
        sx={{
          py: 0,
          color: error ? "#f10" : "currentColor",
          "& .editable": {
            outline: error ? "1px solid #f10" : "none",
          },
        }}
      >
        <Typography component="legend" variant="body2">
          {title}
        </Typography>
        <div id={id} className="editable cursor-text"></div>
      </Box>
    </Stack>
  );
}
