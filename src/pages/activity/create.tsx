import Head from "next/head";
import { DatePicker } from "@/components/DatePicker";
import { AutoComplete as SearchDirection } from "@/components/location/AutoComplete";
import { useFormik } from "formik";
import { AutoComplete, TimePicker } from "antd";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  addDays,
  format as formatDate,
  isAfter,
  isBefore,
  isSameDay,
  addWeeks,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ImportantInfoBox } from "@/components/complex/ImportantInfoBox";

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

  // Recurrence state
  const [recurrenceType, setRecurrenceType] = useState<
    "once" | "recurrent" | "specific"
  >("once");
  const [recurrenceStartDate, setRecurrenceStartDate] = useState<
    Date | undefined
  >(undefined);
  const [recurrenceTime, setRecurrenceTime] = useState<string>("");
  const [recurrenceWeeks, setRecurrenceWeeks] = useState<number>(4);
  const [recurrenceDays, setRecurrenceDays] = useState<string[]>([]); // e.g. ['Monday', 'Wednesday']
  const [recurrencePreview, setRecurrencePreview] = useState<Date[]>([]);
  const [onceDate, setOnceDate] = useState<Date | undefined>(undefined);
  const [onceTime, setOnceTime] = useState<string>("");
  const [specificDates, setSpecificDates] = useState<
    { date: Date | undefined; time: string }[]
  >([{ date: undefined, time: "" }]);

  const weekDays = [
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
    { label: "Sunday", value: 0 },
  ];

  // Generate preview dates when relevant state changes
  useEffect(() => {
    if (
      recurrenceType === "recurrent" &&
      recurrenceStartDate &&
      recurrenceWeeks > 0 &&
      recurrenceDays.length > 0
    ) {
      const preview: Date[] = [];
      let current = recurrenceStartDate;
      let weeks = 0;
      while (weeks < recurrenceWeeks) {
        weekDays.forEach((day) => {
          if (recurrenceDays.includes(day.label)) {
            const date = addDays(
              recurrenceStartDate,
              weeks * 7 + ((day.value - recurrenceStartDate.getDay() + 7) % 7)
            );
            if (
              isAfter(date, addWeeks(recurrenceStartDate, recurrenceWeeks)) ||
              isBefore(date, recurrenceStartDate)
            )
              return;
            if (!preview.some((d) => isSameDay(d, date))) {
              preview.push(date);
            }
          }
        });
        weeks++;
      }
      preview.sort((a, b) => a.getTime() - b.getTime());
      setRecurrencePreview(preview);
    } else {
      setRecurrencePreview([]);
    }
  }, [recurrenceType, recurrenceStartDate, recurrenceWeeks, recurrenceDays]);

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
      secondary_category: "",
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

      console.log("First Log", values, {
        entrance_format,
        fee,
        direction,
        media,
        recurrenceType,
        specificDates,
        recurrencePreview,
        recurrenceTime,
      });
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

      if (!title || !description || !category || !media || !direction) return;

      if (recurrenceType == "once" && !onceDate) return;
      if (recurrenceType == "recurrent" && !recurrencePreview.length) return;
      if (recurrenceType == "specific" && !specificDates.length) return;

      if (!["free", "pay"].includes(entrance_format)) return;

      const textWithLineBreaks = description.replace(/(?:\r\n|\r|\n)/g, "<br>");

      console.log("EVENT LINK", event_link);

      const eventsArray = generateEventsArray();
      if (eventsArray.length === 0) {
        setDisplayRequiredDateTime(true);
        return;
      }

      console.log("Request Payload", { events: eventsArray });

      let files = media?.secondaryMedia
        ? [media.mainMedia, ...media?.secondaryMedia].map((file) => ({
            name: file.name,
            type: file.type,
          }))
        : [{ name: media.mainMedia.name, type: media.mainMedia.type }];

      const response = await post("/api/events", {
        events: eventsArray,
        files,
        id: userInfo?.id,
      });

      files = media?.secondaryMedia
        ? [media.mainMedia, ...media?.secondaryMedia]
        : [media.mainMedia];

      const signedUrls = response.data.urls;
      await Promise.all(
        signedUrls.map((url: string, index: number) =>
          $axios.put(url, files[index], {
            headers: {
              "Content-type": files[index].type,
              "Access-Control-Allow-Origin": "*",
            },
          })
        )
      );

      if (response.status === 200) {
        setNewEventUrl("/user/my-events");

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
            title: "Evento(s) publicado(s) exitosamente",
            body: "Serás redireccionado a tu lista de eventos en breve.",
          },
        });
      }
    },
  });

  useEffect(() => {
    if (session?.user && session.user.name) {
      setUserInfo(session["user"]!);
    }
  }, [session]);

  function generateEventsArray() {
    const baseEvent = {
      title: formik.values.title,
      description: formik.values.description.replace(/(?:\r\n|\r|\n)/g, "<br>"),
      category: formik.values.category,
      direction,
      fee,
      entrance_format,
      hashtags,
      ticket_link: event_link,
      ...(formik.values.secondary_category && {
        secondary_category: formik.values.secondary_category,
      }),
    };

    if (recurrenceType === "once" && onceDate && onceTime) {
      return [
        {
          ...baseEvent,
          eventDate: onceDate,
          eventTime: onceTime,
        },
      ];
    }

    if (
      recurrenceType === "recurrent" &&
      recurrencePreview.length > 0 &&
      recurrenceTime
    ) {
      return recurrencePreview.map((date) => ({
        ...baseEvent,
        eventDate: date,
        eventTime: recurrenceTime,
      }));
    }

    if (recurrenceType === "specific") {
      return specificDates
        .filter((entry) => entry.date && entry.time)
        .map((entry) => ({
          ...baseEvent,
          eventDate: entry.date,
          eventTime: entry.time,
        }));
    }

    return [];
  }

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

          {!userInfo?.is_business ? (
            <section className="mb-6  py-8 min-h-[75vh]">
              <div className="p-4 lg:p-8 border border-slate-200 bg-slate-100 rounded-2xl mb-6 flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Información importante
                </h2>

                <p>
                  Para poder publicar eventos en Encoro, primero debes completar
                  tu perfil de negocio. Por favor,{" "}
                  <a href="/user/profile" className="text-blue-600 underline">
                    haz clic aquí para ir a tu perfil
                  </a>{" "}
                  y asegúrate de llenar todos los campos requeridos. Solo con el
                  perfil completo podrás publicar actividades.
                </p>
                <p>
                  Esta restricción es temporal: en el futuro, se implementará un
                  proceso de validación diferente para publicar eventos.
                </p>
              </div>
            </section>
          ) : (
            <>
              <h1 className="text-2xl lg:text-3xl font-semibold my-6 lg:mt-0 lg:mb-6 ">
                Crea tu evento
              </h1>

              <div className="py-4 lg:py-6 lg:sticky top-[56px] z-30 bg-white border-y border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div>
                    <h2 className="text-xl lg:text-3xl font-bold mb-1">
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
                <div className="relative hidden lg:block">
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
                      className="gap-y-4 lg:gap-y-6 lg:gap-y-8 grid grid-cols-1  border-b border-slate-200  py-8 lg:pb-16 lg:pt-0"
                    >
                      <h2 className="text-xl lg:text-2xl font-semibold ">
                        Detalles basicos
                      </h2>
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
                            onValueChange={(value) => {
                              formik.setFieldValue("category", value);
                              if (formik.values.secondary_category === value) {
                                formik.setFieldValue("secondary_category", "");
                              }
                            }}
                            name="category"
                            aria-label="Selecciona una categoria"
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccione una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.filter(
                                (cat) => cat.value !== "all"
                              ).map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
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
                            Subcategoría (opcional)
                          </label>
                          <Select
                            value={formik.values.secondary_category || ""}
                            onValueChange={(value) =>
                              formik.setFieldValue("secondary_category", value)
                            }
                            name="secondary_category"
                            aria-label="Selecciona una subcategoría"
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccione una subcategoría (opcional)" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.filter(
                                (cat) =>
                                  cat.value !== "all" &&
                                  cat.value !== formik.values.category
                              ).map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          <label className="block font-medium mb-1">
                            Hashtags
                          </label>
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
                        <div className="flex flex-row gap-9 items-center lg:mb-8">
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
                                    Esto es para dar una idea del precio en caso
                                    de que, por ejemplo, haya diferentes costos.
                                    El precio se mostrara en pesos dominicanos.
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

                    {/* Dates and Location Section */}
                    <div
                      id="dates-location"
                      className="py-8 lg:py-16 border-b border-slate-200"
                    >
                      <div className="mb-4 lg:mb-6">
                        <h2 className="text-xl lg:text-2xl font-semibold mb-2">
                          Fecha y ubicación
                        </h2>
                      </div>
                      <div id="event-dates" className="mb-4 lg:mb-6">
                        <label className="block font-medium mb-1">
                          Recurrencia
                        </label>
                        <RadioGroup
                          className="flex flex-row gap-3 lg:gap-6 mb-6 flex-wrap"
                          value={recurrenceType}
                          onValueChange={(val) => setRecurrenceType(val as any)}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="once" id="once" />
                            <label htmlFor="once">Solo una vez</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="recurrent" id="recurrent" />
                            <label htmlFor="recurrent">Recurrente</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="specific" id="specific" />
                            <label htmlFor="specific">Fechas específicas</label>
                          </div>
                        </RadioGroup>
                        {recurrenceType === "once" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="flex flex-row gap-4 items-end">
                              <div className="flex-1 min-w-[220px]">
                                <label className="block font-medium mb-1">
                                  Fecha
                                </label>
                                <DatePicker
                                  className="border border-slate-200 rounded-md w-full min-w-[240px] h-[40px]"
                                  seletedDate={onceDate}
                                  appearance="form"
                                  handleDateChange={setOnceDate}
                                />
                              </div>
                            </div>

                            <div className="flex-1">
                              <label className="block font-medium mb-1">
                                Hora
                              </label>
                              <Input
                                type="time"
                                value={onceTime}
                                onChange={(e) => setOnceTime(e.target.value)}
                                className=" w-[120px]"
                              />
                            </div>
                          </div>
                        )}
                        {recurrenceType === "recurrent" && (
                          <div className="space-y-4 lg:space-y-6 ">
                            <div className="flex flex-col md:flex-row gap-4 lg:items-end">
                              <div>
                                <label className="block font-medium mb-1">
                                  Comenzando en
                                </label>
                                <DatePicker
                                  className="border border-slate-200 rounded-md w-full min-w-[240px] h-[40px]"
                                  seletedDate={recurrenceStartDate}
                                  appearance="form"
                                  handleDateChange={setRecurrenceStartDate}
                                />
                              </div>
                              <div>
                                <label className="block font-medium mb-1">
                                  Hora
                                </label>
                                <Input
                                  type="time"
                                  value={recurrenceTime}
                                  onChange={(e) =>
                                    setRecurrenceTime(e.target.value)
                                  }
                                  className="w-[120px]"
                                />
                              </div>
                            </div>

                            <div>
                              <div>
                                <label className="block font-medium mb-1">
                                  Duración
                                </label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={12}
                                  value={recurrenceWeeks}
                                  onChange={(e) =>
                                    setRecurrenceWeeks(
                                      Math.max(
                                        1,
                                        Math.min(12, Number(e.target.value))
                                      )
                                    )
                                  }
                                  className="w-[60px] inline-block mr-2"
                                />
                                <span>semanas</span>
                              </div>
                              <div>
                                <label className="block font-medium mb-1">
                                  Days
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                  {weekDays.map((day) => (
                                    <button
                                      type="button"
                                      key={day.label}
                                      className={`fee-toggle${
                                        recurrenceDays.includes(day.label)
                                          ? " fee-toggle--active"
                                          : ""
                                      }`}
                                      onClick={() => {
                                        setRecurrenceDays((prev) =>
                                          prev.includes(day.label)
                                            ? prev.filter(
                                                (d) => d !== day.label
                                              )
                                            : [...prev, day.label]
                                        );
                                      }}
                                    >
                                      {day.label.slice(0, 3)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              {recurrencePreview.length > 0 && (
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4">
                                  <div className="flex items-center gap-2 mb-2 text-slate-700">
                                    <AiOutlineInfoCircle />
                                    <span className="font-semibold">
                                      {recurrencePreview.length} events will be
                                      created at the following dates:
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {recurrencePreview
                                      .slice(0, 5)
                                      .map((date, idx) => (
                                        <span
                                          key={idx}
                                          className="bg-slate-200 rounded-full px-3 py-1 text-sm"
                                        >
                                          {formatDate(date, "eeee, MMMM do")}
                                          {recurrenceTime
                                            ? `, ${recurrenceTime}`
                                            : ""}
                                        </span>
                                      ))}
                                    {recurrencePreview.length > 5 && (
                                      <span className="bg-slate-300 rounded-full px-3 py-1 text-sm">
                                        +{recurrencePreview.length - 5}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {recurrenceType === "specific" && (
                          <div className="space-y-4">
                            <label className="block font-medium mb-1">
                              Fechas
                            </label>
                            {specificDates.map((entry, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col md:flex-row gap-2 md:gap-4 lg:items-end w-full"
                              >
                                <div className="flex-1 min-w-[160px]">
                                  <DatePicker
                                    className="border border-slate-200 rounded-md w-full min-w-[240px] h-[40px]"
                                    seletedDate={entry.date}
                                    appearance="form"
                                    handleDateChange={(
                                      date: Date | undefined
                                    ) => {
                                      setSpecificDates((prev) =>
                                        prev.map((e, i) =>
                                          i === idx ? { ...e, date } : e
                                        )
                                      );
                                    }}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="font-medium">Hora</label>
                                  <Input
                                    type="time"
                                    value={entry.time}
                                    onChange={(e) =>
                                      setSpecificDates((prev) =>
                                        prev.map((d, i) =>
                                          i === idx
                                            ? { ...d, time: e.target.value }
                                            : d
                                        )
                                      )
                                    }
                                    className="w-[100px]"
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="bg-slate-100 border border-slate-200 rounded-md px-4 py-2 font-semibold text-slate-900 hover:bg-slate-200 lg:ml-2"
                                  onClick={() =>
                                    setSpecificDates((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                  disabled={specificDates.length === 1}
                                >
                                  Remove date
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="bg-slate-100 border border-slate-200 rounded-md px-4 py-2 font-semibold text-slate-900 hover:bg-slate-200"
                              onClick={() =>
                                setSpecificDates((prev) => [
                                  ...prev,
                                  { date: undefined, time: "" },
                                ])
                              }
                              disabled={specificDates.length >= 8}
                            >
                              + Add new date
                            </button>
                          </div>
                        )}
                      </div>

                      <div id="event-location" className="">
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
                    </div>

                    {/* Media Section */}
                    <div
                      id="media"
                      className="py-8 lg:py-16 border-b border-slate-200"
                    >
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
                            Enlace para adquirir entradas, obtener más
                            información o hacer reservas
                          </label>
                          <Input
                            type="text"
                            placeholder="Indica el enlace para adquirir o reservar tu cupo"
                            onChange={(e) => setEventLink(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center md:justify-end gap-4 mt-8">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          if (formik && formik.resetForm) formik.resetForm();
                        }}
                        className="min-w-[160px]"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="default"
                        className="min-w-[160px]"
                      >
                        Publicar evento
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
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
