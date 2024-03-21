import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col gap-4">
      <h2 className="text-xl font-bold">
        お探しのページが見つかりませんでした。
      </h2>
      <p>
        お探しのページは「すでに削除されている」、「アクセスしたアドレスが異なっている」などの理由で見つかりませんでした。
      </p>
      <Link className="border py-1 px-6" href={"/"}>
        ホームページへ
      </Link>
    </div>
  );
}
