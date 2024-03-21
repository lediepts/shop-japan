import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  username: string;
  password: string;
}

export default function SignIn() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IFormInput>();
  const { data: session } = useSession();
  const [renderCount, setRenderCount] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  useEffect(() => {
    if (callbackUrl) {
      localStorage.setItem("cbUrl", new URL(callbackUrl).pathname);
    }
  }, [callbackUrl]);

  const onSubmit: SubmitHandler<IFormInput> = async ({
    username,
    password,
  }) => {
    try {
      await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: "/",
      });
      setRenderCount(1);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (session) {
      router.push("/");
    } else if (renderCount > 0) {
      setRenderCount(0);
      setError("root", {
        message: "Đăng nhập thất bại!",
      });
    }
  }, [session, renderCount]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl border shadow-md flex flex-col items-center p-4 rounded-lg gap-4"
      >
        <h2 className="text-xl font-bold">Đăng nhập</h2>
        <p className="text-red-500">{errors.root?.message}</p>
        <div className="flex items-center">
          <label className="w-20">Tài khoản</label>
          <input
            {...register("username", { required: true, maxLength: 100 })}
            className="border rounded flex-1 w-48"
          />
        </div>
        <div className="flex items-center">
          <label className="w-20">Mật khẩu</label>
          <input
            type="password"
            {...register("password", { required: true, maxLength: 100 })}
            className="border rounded flex-1 w-48"
          />
        </div>
        <div className="flex items-center my-4">
          <button
            className="primary-btn"
            type="submit"
          >
            ĐĂNG NHẬP
          </button>
        </div>
      </form>
    </div>
  );
}
