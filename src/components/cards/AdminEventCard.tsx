import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { MdMoreVert } from "react-icons/md";
import { AiTwotoneCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { parseCategory, truncateText } from "@/lib/utils";
import dayjs from "dayjs";
import es from "dayjs/locale/es-do";
import Link from "next/link";
import { CATEGORIES_DICT } from "@/lib/variables";
import { Badge } from "@/components/ui/badge";
dayjs.locale("es-do");

type AdminEventCardI = {
  index: number;
  id: string;
  media: string;
  category: string;
  userId: string;
  is_active: boolean;
  title: string;
  date: string;
  time: string;
  followers?: number;
  toggleVisibilityAction?: (
    id: string,
    user_id: string,
    is_active: boolean
  ) => void;
  deleteEventAction?: (id: string, user_id: string) => void;
};

const AdminEventCard = ({
  index,
  id,
  media,
  category,
  userId,
  is_active,
  title,
  date,
  time,
  toggleVisibilityAction,
  deleteEventAction,
  followers,
}: AdminEventCardI) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timeString = date?.split("T")[0] + "T" + time;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div
      key={index}
      className="bg-white rounded-lg shadow-sm border overflow-hidden"
    >
      <div
        className="h-[240px] flex xl:h-[200px] items-start w-full overflow-hidden py-3 px-4 relative"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: `url(https://encoro.app/cdn-cgi/image/quality=85,format=webp/${
            media.split("aws.com/")[1]
          }?width=426&format=webp)`,
        }}
      >
        <Badge className="max-h-[24px]">{CATEGORIES_DICT[category]}</Badge>
        <div className="ml-auto relative" ref={dropdownRef}>
          <button
            className="p-0 h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="Opciones"
            type="button"
          >
            <MdMoreVert size={20} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-slate-100"
                onClick={() => {
                  setDropdownOpen(false);
                  if (toggleVisibilityAction)
                    toggleVisibilityAction(id, userId, is_active);
                }}
              >
                {is_active ? "Ocultar post" : "Mostrar post"}
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-red-600"
                onClick={() => {
                  setDropdownOpen(false);
                  if (deleteEventAction) deleteEventAction(id, userId);
                }}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <Link
          className="text-slate-900 no-underline"
          href={`/${category.toLocaleLowerCase().split(" ").join("-")}/${id}`}
        >
          <div className="text-base mb-0 leading-tight font-semibold">
            {truncateText(title, 90)}
          </div>
        </Link>
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center text-slate-600">
            <AiTwotoneCalendar className="mr-1" size={16} />
            <span className="text-base capitalize">
              {dayjs(date).locale(es).format("MMM D, YYYY")}
            </span>
          </span>
          <span className="h-3 w-px bg-slate-300" />
          <span className="inline-flex items-center text-slate-600">
            <AiOutlineClockCircle className="mr-1" size={16} />
            <span className="text-base">
              {dayjs(timeString).format("h:mm A")}
            </span>
          </span>
        </span>
        <span className="text-base text-slate-600">
          <b className="font-semibold">{followers}</b> Seguidores
        </span>
        <button
          onClick={() => router.push(`/activity/${id}/edit/`)}
          className="mt-auto bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2 px-4 rounded transition"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default AdminEventCard;
