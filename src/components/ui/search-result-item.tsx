import Link from "next/link";
import { truncateText } from "@/lib/utils";
import { CATEGORIES_DICT } from "@/lib/variables";
import { AiTwotoneCalendar, AiOutlineClockCircle } from "react-icons/ai";
import dayjs from "dayjs";
import es from "dayjs/locale/es-do";
import { EventSearchResultType } from "@/interfaces";

dayjs.locale(es);

type EventSearchResultTypeExtended = EventSearchResultType & {
  onClick?: () => void;
};
export default function SearchResultItem({
  title,
  media,
  date,
  category,
  time,
  id,
  onClick,
}: EventSearchResultTypeExtended) {
  return (
    <Link
      onClick={onClick}
      className="p-[16px] border-b-[1px] border-slate-100 flex flex-wrap gap-[12px] items-center no-underline"
      href={"/" + category + "/" + id + "/"}
    >
      <div className="flex gap-[12px] items-center">
        <img
          src={`https://encoro.app/cdn-cgi/image/quality=85,width=188,format=webp/${media[0]}`}
          className="w-[64px] h-[64px] lg:h-[80px] lg:w-[80px] object-cover rounded-[8px]"
        />

        <div className="flex flex-col gap-[4px]">
          <h3 className="text-lg font-semibold text-slate-900 mb-0 leading-tight">
            {truncateText(title, 80)}
          </h3>

          <div className=" hidden lg:flex gap-[12px] items-center ">
            <span className={`text-base font-semibold text-${category}`}>
              {CATEGORIES_DICT[category]}
            </span>

            <span className="h-[16px] w-[1px] bg-slate-200 border-solid  relative"></span>

            <span className="inline-flex flex-start items-center text-slate-600">
              <AiTwotoneCalendar className="mr-[8px]" size={20} />
              <span className="text-base capitalize">
                {dayjs(date).locale(es).format("MMMM D, YYYY")}
              </span>
            </span>

            <span className="h-[16px] w-[1px] bg-slate-200 border-solid  relative"></span>

            <span className="inline-flex flex-start items-center text-slate-600">
              <AiOutlineClockCircle className="mr-[8px]" size={20} />
              <span className="text-base ">
                {dayjs(date.split("T")[0] + time).format("h:mm A")}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex lg:hidden gap-[12px] items-center ">
        <span className={`text-base font-semibold text-${category}`}>
          {CATEGORIES_DICT[category]}
        </span>

        <span className="h-[16px] w-[1px] bg-slate-200 border-solid  relative"></span>

        <span className="inline-flex flex-start items-center text-slate-600">
          <AiTwotoneCalendar className="mr-[8px]" size={20} />
          <span className="text-base capitalize">
            {dayjs(date).locale(es).format("MMMM D, YYYY")}
          </span>
        </span>

        <span className="h-[16px] w-[1px] bg-slate-200 border-solid  relative"></span>

        <span className="inline-flex flex-start items-center text-slate-600">
          <AiOutlineClockCircle className="mr-[8px]" size={20} />
          <span className="text-base ">
            {dayjs(date.split("T")[0] + time).format("h:mm A")}
          </span>
        </span>
      </div>
    </Link>
  );
}
