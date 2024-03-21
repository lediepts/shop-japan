import Link from "next/link";
import { FaComments } from "react-icons/fa6";
import { MdArticle, MdCategory, MdPublic } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";

const Index = () => {
  return (
    <div className="container p-4 flex flex-col gap-8">
      <div className="flex justify-center">
        <Link
          href="/"
          className="p-4 rounded shadow-lg flex items-center justify-center gap-2 text-2xl text-white bg-blue-700 hover:bg-blue-500 w-full max-w-lg"
        >
          <MdPublic className="text-4xl" />
          公開サイトへ
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Link
          href="/category/"
          className="border border-orange-700 p-4 rounded shadow-lg flex items-center justify-center gap-2 text-xl text-orange-700 hover:text-white hover:bg-orange-700"
        >
          <MdCategory className="text-3xl" />
          カテゴリー一覧
        </Link>
        <Link
          href="/posts/"
          className="border border-teal-500 p-4 rounded shadow-lg flex items-center justify-center gap-2 text-xl text-teal-500 hover:text-white hover:bg-teal-500"
        >
          <MdArticle className="text-3xl" />
          記事一覧
        </Link>
        <Link
          href="/comment/"
          className="border border-teal-500 p-4 rounded shadow-lg flex items-center justify-center gap-2 text-xl text-teal-500 hover:text-white hover:bg-teal-500"
        >
          <FaComments className="text-3xl" />
          コメント一覧
        </Link>
        <Link
          href="/posts/register"
          className="border border-blue-600 p-4 rounded shadow-lg flex items-center justify-center gap-2 text-xl text-blue-600 hover:text-white hover:bg-blue-600"
        >
          <TfiWrite />
          投稿
        </Link>
      </div>
    </div>
  );
};
Index.auth = true;
export default Index;
