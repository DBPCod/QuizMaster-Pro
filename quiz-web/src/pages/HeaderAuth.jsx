import { FaPuzzlePiece } from 'react-icons/fa';

export default function HeaderAuth() {
  return (
    <section className="flex w-full bg-[#E8ECFB] justify-between items-center px-6 h-12">
      <div className="flex items-center gap-2">
        <FaPuzzlePiece className="text-[#2563EB] text-xl" />
        <strong className="text-[#2563EB] text-xl">QuizMaster</strong>
      </div>
      <div className="flex items-center gap-2">
        <a href='#' className="text-[#475569]">Trợ giúp</a>
        <button className=" flex bg-[#2563EB] hover:bg-[#2563EB]/80 text-white px-6 py-1.5 rounded-[20px] items-center">Trang chủ</button>
      </div>
    </section>
  )
}
