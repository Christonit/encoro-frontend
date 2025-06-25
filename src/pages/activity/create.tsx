import Head from "next/head";
import { DatePicker } from "@/components/DatePicker";
import { AutoComplete as SearchDirection } from "@/components/location/AutoComplete";
import { useFormik } from "formik";
import { TimePicker } from "antd";
import { AiOutlineClockCircle } from "react-icons/ai";
import * as Yup from "yup";
import { useState, SyntheticEvent, useEffect } from "react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import {
  IMediaToUpload,
  AutoCompleteI,
  userI,
  statusMessageType,
} from "@/interfaces";
import StatusModal from "@/components/messages/StatusModal";
import EventMediaInputGroup from "@/components/complex/EventMediaInputGroup";
import { useRouter } from "next/router";
import { $axios } from "@/lib/utils";
import { CATEGORIES } from "@/lib/variables";
import RequiredStar from "@/components/ui/required-star";
import { useBackend } from "@/hooks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { FeeToggleGroup } from "@/components/complex/FeeToggleGroup";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";

export default function CreateEvent() {
  const [media, setMedia] = useState<IMediaToUpload>();
  const [eventDate, setEventDate] = useState<Date>();
  const [eventTime, setEventTime] = useState<any>("");
  const [direction, setDirection] = useState<AutoCompleteI>();
  const [displayRequiredLocation, setDisplayRequiredLocation] = useState(false);
  const [displayRequiredMedia, setDisplayRequiredMedia] = useState(false);
  const [displayRequiredFee, setDisplayRequiredFee] = useState(false);
  const [displayRequiredDateTime, setDisplayRequiredDateTime] = useState(false);
  const [entrance_format, setEntranceFormat] = useState("free");
  const [event_link, setEventLink] = useState<string | null>(null);
  const [fee, setEntranceFee] = useState<number>(0);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const format = "hh:mm A";
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState<userI>();
  const [newEventUrl, setNewEventUrl] = useState<string>("");
  const { push: navigateTo } = useRouter();
  const [statusMessage, setStatusMessage] = useState<statusMessageType>({
    type: null,
    show: false,
    message: {
      title: "",
      body: "",
    },
  });
  const { post } = useBackend();

  const setMediaState = (e: SyntheticEvent, i?: number) => {
    const target = e.target as HTMLInputElement;

    if (!target.files) return;

    if (
      target &&
      target.files?.length &&
      i === 1 &&
      (!media || media?.mainMedia)
    ) {
      setMedia({ ...media, mainMedia: target.files[0] });
    } else {
      let arr: File[] = [];

      if (media?.secondaryMedia && media?.secondaryMedia.length) {
        arr.push(...media?.secondaryMedia);
      }

      if (arr[i! - 2]) {
        arr[i! - 2] = target.files[target.files.length - 1];
      } else {
        arr.push(target.files[target.files.length - 1]);
      }

      setMedia({ ...media!, secondaryMedia: arr });
    }
  };

  const handleSubmit = () => {
    if (!media) setDisplayRequiredMedia(true);

    if (!direction) setDisplayRequiredLocation(true);

    if (eventTime === "" || eventDate) setDisplayRequiredDateTime(true);
    formik.handleSubmit();
  };

  const formik = useFormik({
    initialValues: {
      title: "",

      category: "",

      description: "",
      hashtags: "",
      direction: "",
      adquire_ticket: "",
      entrance_format: "",
      fee: 0,
      ticket_link: "",
    },

    validationSchema: Yup.object({
      title: Yup.string()

        .min(10, "Debe ser de más de 10 caracteres o más.")

        .required("Requerido"),

      category: Yup.string().required("Requerido"),

      description: Yup.string().required("Requerido"),
    }),

    onSubmit: async (values, { resetForm }) => {
      if (!session && !userInfo) return;

      const { title, description, category } = values;

      if (eventTime && eventDate) {
        setDisplayRequiredDateTime(false);
      }

      if (fee && displayRequiredFee) {
        setDisplayRequiredFee(false);
      }

      if (media?.mainMedia) {
        setDisplayRequiredMedia(false);
      }

      if (direction && displayRequiredLocation) {
        setDisplayRequiredLocation(false);
      }

      if (
        !title ||
        !description ||
        !category ||
        !media ||
        !eventDate ||
        !eventTime ||
        !direction
      )
        return;

      if (!["free", "pay"].includes(entrance_format)) return;

      const textWithLineBreaks = description.replace(/(?:\r\n|\r|\n)/g, "<br>");

      console.log("EVENT LINK", event_link);

      const event = {
        title,
        description: textWithLineBreaks,
        category,
        eventDate,
        fee,
        eventTime,
        entrance_format,
        direction,
        hashtags,
        ticket_link: event_link,
      };

      // Replace line breaks with <br> tags before saving to the database

      // When displaying the text, use innerHTML to render the line breaks as HTML line breaks
      // If has no media cancels execution.
      if (media) {
        //1. Takes the files from the media state which is filled from the inputs.

        //2. makes array of name,type keys.
        let files = media?.secondaryMedia
          ? [media.mainMedia, ...media?.secondaryMedia].map((file) => {
              return { name: file.name, type: file.type };
            })
          : [{ name: media.mainMedia.name, type: media.mainMedia.type }];

        //3. Is submited to our create an event endpoint alongside the event data for url signing.
        const response = await post("/api/events", {
          event,
          files,
          id: userInfo?.id,
        });

        //4. Resets the files array so it has the files instead of just text.
        files = media?.secondaryMedia
          ? [media.mainMedia, ...media?.secondaryMedia]
          : [media.mainMedia];

        //5. Loops the files to save the file in our S3 bucket from our signed urls.
        const signedUrls = response.data.urls;
        signedUrls.map(async (url: string, index: number) => {
          await $axios.put(url, files[index], {
            headers: {
              "Content-type": files[index].type,
              "Access-Control-Allow-Origin": "*",
            },
          });
        });

        if (response.status === 200) {
          setNewEventUrl(
            `/${response.data.new_event.category}/${response.data.new_event.id}`
          );

          setEventDate(undefined);
          setEventTime("");
          setDirection(undefined);
          setHashtags([]);
          setMedia(undefined);
          resetForm();
          setEntranceFee(0);

          setStatusMessage({
            show: true,
            type: "success",
            message: {
              title: "Evento publicado exitosamente",
              body: "Serás redireccionado a tu lista de eventos en breve.",
            },
          });
        }
      }
    },
  });

  useEffect(() => {
    if (session?.user && session.user.name) {
      setUserInfo(session["user"]!);
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }
  return (
    <div>
      <Head>
        <title>Publicar nueva actividad - Encoro</title>
        <meta
          name="description"
          content="Publica una nueva actividad, compartela con tu comunidad, amplía tu alcance y da vida a tus pasiones."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://encoro.app/activity/create" />
        <meta property="og:title" content="Publicar nueva actividad - Encoro" />
        <meta
          property="og:description"
          content="Publica una nueva actividad, compartela con tu comunidad, amplía tu alcance y da vida a tus pasiones."
        />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="lg:py-8">
        <div className="container mx-auto px-4 lg:px-0 !max-w-[1200px]">
          {/* Preview Header Section */}
          <h1 className="text-2xl font-semibold mb-6 ">Crea tu evento</h1>

          <div className="py-6 sticky top-[64px] z-30 bg-white border-y border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div>
                <h2 className="text-3xl font-bold mb-1">
                  {formik.values.title || "Placeholder Event Title"}
                </h2>
                <div className="flex flex-wrap gap-4 text-slate-600 text-base">
                  <span>
                    [
                    {eventDate
                      ? dayjs(eventDate).format("MMMM D, YYYY")
                      : "No dates specified Yet"}
                    ]
                  </span>
                  <span>[{direction?.direction || "Event Location"}]</span>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 md:mt-0 px-6 py-2 rounded bg-slate-200 text-slate-500 font-semibold cursor-not-allowed"
                disabled
              >
                Preview event
              </button>
            </div>
          </div>
          <div className="flex flex-row gap-8">
            {/* Sidebar */}
            <div className="relative">
              <nav className="w-64 min-w-[200px] border-r border-slate-200  py-6 sticky top-[188px] z-30 bg-white">
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#basic-details"
                      className="block py-2 px-4 rounded hover:bg-slate-100 font-medium sidebar-link active"
                    >
                      Detalles basicos
                    </a>
                  </li>
                  <li>
                    <a
                      href="#media"
                      className="block py-2 px-4 rounded hover:bg-slate-100 font-medium sidebar-link"
                    >
                      Media
                    </a>
                  </li>
                  <li>
                    <a
                      href="#dates-location"
                      className="block py-2 px-4 rounded hover:bg-slate-100 font-medium sidebar-link"
                    >
                      Fecha y ubicación
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <form
                onSubmit={(props) => {
                  if (!media) setDisplayRequiredMedia(true);
                  if (!direction) setDisplayRequiredLocation(true);
                  if (fee && isNaN(fee)) setDisplayRequiredFee(true);
                  if (eventTime === "" || eventDate)
                    setDisplayRequiredDateTime(true);
                  formik.handleSubmit(props);
                }}
                className="mb-[32px] lg:my-[32px]"
              >
                {/* Basic Details Section */}
                <div
                  id="basic-details"
                  className="gap-y-6 lg:gap-y-8 grid grid-cols-1  border-b border-slate-200"
                >
                  <h2 className="text-2xl font-semibold ">Detalles basicos</h2>
                  <div className="grid gap-y-6 md:gap-y-8 w-full">
                    <div className="">
                      <label className="block font-medium mb-1">
                        Titulo <RequiredStar />
                      </label>
                      <Input
                        type="text"
                        {...formik.getFieldProps("title")}
                        placeholder="Digita tu titulo"
                      />
                      {formik.touched.title && formik.errors.title ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.title}
                        </div>
                      ) : null}
                    </div>
                    <div className="">
                      <label className="block font-medium mb-1">
                        Categoria <RequiredStar />
                      </label>
                      <Select
                        value={formik.values.category}
                        onValueChange={(value) =>
                          formik.setFieldValue("category", value)
                        }
                        name="category"
                        aria-label="Selecciona una categoria"
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.filter((cat) => cat.value !== "all").map(
                            (cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {formik.touched.category && formik.errors.category ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.category}
                        </div>
                      ) : null}
                    </div>
                    <div className="">
                      <label className="block font-medium mb-1">
                        Descripción <RequiredStar />
                      </label>
                      <Textarea
                        {...formik.getFieldProps("description")}
                        name="description"
                        rows={3}
                        placeholder="Describe tu evento"
                      />
                      {formik.touched.description &&
                      formik.errors.description ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.description}
                        </div>
                      ) : null}
                    </div>
                    <div className="">
                      <label className="block font-medium mb-1">Hashtags</label>
                      <Input
                        type="text"
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            setHashtags(e.target.value.split(/[, ]+/));
                          }
                        }}
                        placeholder="Ej: musica,arte,fiesta"
                      />
                      {hashtags && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {hashtags.map((hashtag, i) => (
                            <Badge key={i} variant="secondary">
                              #{hashtag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row gap-9 items-center mb-8">
                      <label className="block font-medium">
                        Tipo de asistencia
                      </label>
                      <div className="flex gap-0">
                        <button
                          type="button"
                          className={`fee-toggle rounded-l-full${
                            entrance_format === "free"
                              ? " fee-toggle--active"
                              : ""
                          }`}
                          onClick={() => setEntranceFormat("free")}
                        >
                          Gratis
                        </button>
                        <button
                          type="button"
                          className={`fee-toggle rounded-r-full${
                            entrance_format === "pay"
                              ? " fee-toggle--active"
                              : ""
                          }`}
                          onClick={() => setEntranceFormat("pay")}
                        >
                          Pago
                        </button>
                      </div>
                      {entrance_format === "pay" && (
                        <div className="flex items-center gap-2 ">
                          <span className="text-lg">$</span>
                          <Input
                            type="number"
                            onChange={(e) =>
                              setEntranceFee(Number(e.target.value))
                            }
                            placeholder="Indique el precio"
                            aria-label="Indique el precio"
                            className="max-w-[220px]"
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-1 cursor-pointer text-slate-400 hover:text-slate-700">
                                  <AiOutlineInfoCircle size={18} />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                Esto es para dar una idea del precio en caso de
                                que, por ejemplo, haya diferentes costos. El
                                precio se mostrara en pesos dominicanos.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {displayRequiredFee && (
                            <span className="text-red-500 text-xs ml-2">
                              El precio debe ser un número o mayor a 0
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Media Section */}
                <div id="media" className="pt-8 pb-8 border-b border-slate-200">
                  <div className="">
                    <h2 className="text-2xl font-semibold mb-2">Media</h2>
                  </div>
                  <div className="flex flex-col gap-y-[32px] md:gap-y-[52px]">
                    <EventMediaInputGroup
                      id="create-event-media"
                      isRequired
                      displayWarning={displayRequiredMedia}
                      setImage={setMediaState}
                    />
                    <div className="mb-4">
                      <label className="block font-medium mb-1">
                        Enlace para adquirir o reservar
                      </label>
                      <Input
                        type="text"
                        placeholder="Indica el enlace para adquirir o reservar tu cupo"
                        onChange={(e) => setEventLink(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Dates and Location Section */}
                <div id="dates-location" className="pt-8 pb-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">
                      Date and Location
                    </h2>
                  </div>
                  <div className="mb-4">
                    <label className="block font-medium mb-1">
                      Dirección <RequiredStar />
                    </label>
                    <SearchDirection
                      displayWarning={displayRequiredLocation}
                      clearSearch={() => setDirection(undefined)}
                      onChangeLocation={(value: any) => {
                        setDirection({
                          city: value.city,
                          city_id: value.city_id,
                          direction: value.location,
                          place_id: value.id,
                          address_terms: value.terms,
                        });
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-medium mb-1">
                      Fecha <RequiredStar />
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <DatePicker
                        className="border border-slate-200 rounded-md w-full md:max-w-[348px] h-[40px]"
                        seletedDate={eventDate}
                        isForm
                        handleDateChange={setEventDate}
                      />
                      <div className="flex items-center gap-2 max-w-[172px] md:w-full lg:w-[50%]">
                        <span className="text-slate-500">
                          <AiOutlineClockCircle />
                        </span>
                        <TimePicker
                          use12Hours
                          placeholder="Hora del evento"
                          format={format}
                          className="w-full max-w-[132px] timepicker"
                          onOk={(val) => {
                            const minute: any = dayjs(val, "HH:mm").minute();
                            const hour: any = dayjs(val, "HH:mm").hour();
                            setEventTime(hour + ":" + minute + ":00");
                          }}
                        />
                      </div>
                    </div>
                    {displayRequiredDateTime && (
                      <span className="text-red-500 text-xs mt-1 block">
                        Indicar una hora y fecha es requerido.
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-auto  lg:hidden justify-center flex">
                  {/* TODO: Create Preview Event Functionality */}
                  {/* <Button>Previzualizar</Button> */}
                  <button type="submit" className="h-[40px] max-w-[400px]">
                    Publicar evento
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {statusMessage.type && (
        <StatusModal
          title={statusMessage.message.title}
          message={statusMessage.message.body}
          type={statusMessage.type}
          show={statusMessage.show}
          closeModal={() => {
            setStatusMessage((status) => ({ ...status, show: false }));
            setTimeout(() => {
              navigateTo(newEventUrl);
            }, 500);
          }}
        />
      )}
    </div>
  );
}
