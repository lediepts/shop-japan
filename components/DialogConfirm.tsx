import { LoadingButton } from "@mui/lab";
import { Box, Breakpoint, DialogContent, Stack } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: any;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  title?: string;
  closeButtonText?: string;
  primaryButton?: boolean;
  primaryButtonText?: string;
  loading?: boolean;
  maxWidth?: Breakpoint;
  disabled?: boolean;
  backdropClick?: boolean;
  useEnterKey?: boolean;
  primaryButtonColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  component?: React.ElementType<any>;
  handleClose: () => void;
  handleSubmit?: () => void | Promise<void>;
  children?: string | JSX.Element | JSX.Element[] | any;
}

export default function DialogConfirm({
  open,
  loading,
  title = "",
  maxWidth = "sm",
  primaryButton = true,
  closeButtonText = "Đóng",
  primaryButtonText = "Lưu",
  children,
  primaryButtonColor = "primary",
  component = "div",
  disabled = false,
  backdropClick,
  handleClose,
  handleSubmit,
}: Props) {
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        fullWidth
        maxWidth={maxWidth}
        onClose={(_e, reason) => {
          if (backdropClick || reason !== "backdropClick") {
            handleClose();
          }
        }}
        sx={{
          "& .MuiPaper-root": {
            opacity: 0.98,
            margin: 1,
            width: "95%",
          },
        }}
      >
        <Stack component={component} spacing={1}>
          <DialogTitle sx={{ fontWeight: "bold", py: 1 }}>{title}</DialogTitle>
          <DialogContent>
            <Box sx={{ py: 1, maxHeight: "75vh" }}>{children}</Box>
          </DialogContent>
          <DialogActions>
            <Stack
              width="100%"
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              mb={1}
            >
              <LoadingButton
                loading={loading}
                variant="outlined"
                color="inherit"
                size="small"
                sx={{
                  width: 100,
                }}
                onClick={() => handleClose()}
              >
                {closeButtonText}
              </LoadingButton>
              {primaryButton && (
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  color={primaryButtonColor}
                  disabled={disabled}
                  size="small"
                  type={component === "form" ? "submit" : "button"}
                  sx={{
                    minWidth: 100,
                  }}
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubmit && (await handleSubmit());
                  }}
                >
                  {primaryButtonText}
                </LoadingButton>
              )}
            </Stack>
          </DialogActions>
        </Stack>
      </Dialog>
    </>
  );
}
