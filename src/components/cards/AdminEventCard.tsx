import { Button, Card, Dropdown, Badge } from "react-bootstrap";
import { useRouter } from "next/router";
import { MdMoreVert } from "react-icons/md";
import { AiTwotoneCalendar, AiOutlineClockCircle } from "react-icons/ai";
import axios from "axios";
import { parseCategory, truncateText } from "@/lib/utils";
import dayjs from "dayjs";
import es from "dayjs/locale/es-do";
import Link from "next/link";
import { CATEGORIES_DICT } from "@/lib/variables";
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

  const timeString = date?.split("T")[0] + "T" + time;

  return (
    <Card key={index}>
      <Card.Header
        className="h-[240px] flex xl:h-[200px] align-center w-100 overflow-hidden py-[12px] px-[16px]"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: `url(https://encoro.app/cdn-cgi/image/quality=85,format=webp/${
            media.split("aws.com/")[1]
          }?width=426&format=webp)`,
        }}
      >
        <Badge bg="primary" className="max-h-[24px]">
          {CATEGORIES_DICT[category]}
        </Badge>

        <Dropdown className="ml-auto max-w-[24px] max-h-[24px]">
          <Dropdown.Toggle
            variant="primary"
            className="p-0 h-[32px] b-none w-[32px] relative top-[-2px] !min-h-[32px] !max-h-[32px]"
          >
            <MdMoreVert className="mx-auto" size={20} />
          </Dropdown.Toggle>

          <Dropdown.Menu variant="light">
            <Dropdown.Item
              href="#/action-1"
              onClick={async () => {
                console.log("MOSTRAR");

                if (toggleVisibilityAction)
                  toggleVisibilityAction(id, userId, is_active);
              }}
            >
              {is_active ? "Ocultar post" : "Mostrar post"}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={async () => {
                console.log("DELETE");
                if (deleteEventAction) deleteEventAction(id, userId);
              }}
            >
              Eliminar
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Card.Header>

      <Card.Body className="flex flex-column gap-[12px]">
        <Link
          className="text-slate-900 no-underline"
          href={`/${category.toLocaleLowerCase().split(" ").join("-")}/${id}`}
        >
          <Card.Title className="text-base mb-0 leading-tight">
            {truncateText(title, 90)}
          </Card.Title>
        </Link>
        <span className="flex items-center gap-[12px]">
          <span className="inline-flex flex-start items-center text-slate-600">
            <AiTwotoneCalendar className="mr-[4px]" size={16} />
            <span className="text-base capitalize">
              {dayjs(date).locale(es).format("MMM D, YYYY")}
            </span>
          </span>
          <span className="h-[12px] w-[1px] bg-slate-300" />
          <span className="inline-flex flex-start items-center text-slate-600">
            <AiOutlineClockCircle className="mr-[4px]" size={16} />
            <span className="text-base">
              {dayjs(timeString).format("h:mm A")}
            </span>
          </span>
        </span>
        <span className="text-base text-slate-600">
          {" "}
          <b className="font-semibold">{followers}</b> Seguidores
        </span>

        <Button
          onClick={() => router.push(`/activity/${id}/edit/`)}
          variant="light"
          className="mt-auto"
        >
          Editar
        </Button>
      </Card.Body>
    </Card>
  );
};

export default AdminEventCard;
