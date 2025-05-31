import Head from "next/head";
import { DatePicker } from "@/components/DatePicker";
import { isJsonString } from "@/lib/utils";
import StatusModal from "@/components/messages/StatusModal";
import ConfirmationModal from "@/components/messages/ConfirmationModal";
import { AutoComplete } from "@/components/location/AutoComplete";
import { useFormik } from "formik";
import { AiOutlineClockCircle, AiOutlineCloseCircle } from "react-icons/ai";
import cx from "classnames";
import { AiOutlineWarning, AiOutlineFileImage } from "react-icons/ai";
import { TimePicker } from "antd";
import * as Yup from "yup";
import { useState, SyntheticEvent, useEffect } from "react";
import dayjs from "dayjs";
import es from "dayjs/locale/es-do";
import { fromUnixTime } from "date-fns";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  IMediaToUpload,
  AutoCompleteI,
  userI,
  eventI,
  statusMessageType,
} from "@/interfaces";
import { useBackend, useNavigation } from "@/hooks";
import { CATEGORIES } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function UpdateEvent() {
  const router = useRouter();
  const { post } = router.query;
  const [media, setMedia] = useState<IMediaToUpload>();
  const [firstImage, setFirstImage] = useState<File>();
  const [secondImage, setSecondImage] = useState<File>();
  const [thirdImage, setThirdImage] = useState<File>();
  const [fourthImage, setFourthImage] = useState<File>();
  const [fiftImage, setFiftImage] = useState<File>();
  const [eventDate, setEventDate] = useState<Date>();
  const [eventTime, setEventTime] = useState<any>("");
  const [direction, setDirection] = useState<AutoCompleteI>();
  const [entrance_format, setEntranceFormat] = useState("free");
  const [fee, setEntranceFee] = useState<number>(0);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const format = "hh:mm A";
  const [isLoading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState<userI>();
  const [defaultValues, setDefaultValues] = useState<eventI>();
  const [showToast, toggleToast] = useState(true);
  const [showConfirmUpdateModal, toggleConfirmUpdateModal] = useState(false);
  const [displayRequiredFee, setDisplayRequiredFee] = useState(false);
  const { get } = useBackend();
  const [eventToPatch, setPayload] = useState<any>(null);

  const { patch } = useBackend();

  const { push } = useNavigation();

  const [statusMessage, setStatusMessage] = useState<statusMessageType>({
    type: null,
    show: false,
    message: {
      title: "",
      body: "",
    },
  });

  const deletePreviewMediaBtn = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path><path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg>`;

  const removeImage = (
    imageIndex: number,
    deleteFromServer: boolean = false
  ) => {
    if (deleteFromServer) return;
    switch (imageIndex) {
      case 2:
        setSecondImage(undefined);
        break;
      case 3:
        setThirdImage(undefined);
        break;
      case 4:
        setFourthImage(undefined);
        break;
      case 5:
        setFourthImage(undefined);
        break;
    }

    const imageBlock = document.getElementById(`image-block-` + imageIndex);
    const deleteButton = document.querySelector(
      `button[data-image-index="${imageIndex}"]`
    );

    const svgIcon = imageBlock?.parentElement?.childNodes[0] as HTMLElement;

    if (svgIcon.tagName === "svg") {
      svgIcon.classList.remove("hidden");
    }
    deleteButton?.remove();
    imageBlock?.remove();
  };

  const getEvent = async (id: string) => {
    try {
      console.log({ FETCH_POST: id });
      const { data } = await get(`/api/events/${id}`);

      console.log({ FETCH_POST: data });
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const setMediaState = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    if (!target.files) return;

    let arr: File[] = [];
    if (media?.secondaryMedia && media?.secondaryMedia.length) {
      arr.push(...media?.secondaryMedia);
    }

    arr.push(target.files[0]);

    setMedia({ ...media!, secondaryMedia: arr });
  };

  const format_date = (date: string | number) => {
    const unix = dayjs(date).unix();
    const transformed = fromUnixTime(unix);

    return dayjs(transformed).locale(es).format("MMMM D, YYYY");
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: defaultValues?.title,

      category: defaultValues?.category,

      description: defaultValues?.description,
      hashtags: defaultValues?.hashtags,
      direction: defaultValues?.direction,
      adquire_ticket: "",
      entrance_format: defaultValues?.entrance_format,
      fee: defaultValues?.fee,
      ticket_link: defaultValues?.ticket_link,
    },

    validationSchema: Yup.object({
      title: Yup.string()

        .min(10, "Must be 10 characters or more")

        .required("Required"),

      category: Yup.string().required("Required"),

      description: Yup.string().required("Required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      console.log(1);
      if (!session && !userInfo) return;
      console.log(2);

      const { title, description, category, ticket_link } = values;
      console.log(3);

      if (
        title === "" ||
        description === "" ||
        category === "" ||
        !eventDate ||
        eventTime === "" ||
        !direction
      ) {
        return;
      }
      console.log(4);

      if (!["free", "pay"].includes(entrance_format)) return;
      console.log(5);

      if (fee && (isNaN(fee) || fee < 0)) setDisplayRequiredFee(true);
      if (fee && displayRequiredFee) setDisplayRequiredFee(false);

      const textWithLineBreaks = description?.replace(
        /(?:\r\n|\r|\n)/g,
        "<br>"
      );

      let event: any = {
        title,
        description: textWithLineBreaks,
        category,
        eventDate,
        fee,
        eventTime,
        entrance_format,
        ticket_link,
        direction,
        hashtags,
        post_id: post,
      };

      //If has no media cancels execution.
      // if (media) {
      //1. Takes the files from the media state which is filled from the inputs.
      // let files: any = [];
      //2. makes array of name,type keys.

      let files = [firstImage, secondImage, thirdImage, fourthImage, fiftImage];

      console.log({ files });
      const updatedImagePosition = {
        one: false,
        two: false,
        three: false,
        four: false,
        five: false,
      };
      if (firstImage! && firstImage!.size != 0) updatedImagePosition.one = true;
      if (secondImage! && secondImage!.size != 0)
        updatedImagePosition.two = true;
      if (thirdImage! && thirdImage!.size != 0)
        updatedImagePosition.three = true;
      if (fourthImage! && fourthImage!.size != 0)
        updatedImagePosition.four = true;
      if (fiftImage! && fiftImage!.size != 0) updatedImagePosition.five = true;

      const filesmetadata = files.map((file) => {
        if (!file) return { name: "", type: "" };
        return { name: file!.name, type: file!.type };
      });

      console.log({ filesmetadata });
      event = { ...event, updatedImagePosition, filesmetadata };
      // //3. Is submited to our create an event endpoint alongside the event data for url signing.

      setPayload({ event, files });

      toggleConfirmUpdateModal(true);
    },
  });

  const patchEvent = async () => {
    const { event, files } = eventToPatch;

    const response = await patch("/api/events", {
      event,
      id: userInfo?.id,
    });

    toggleConfirmUpdateModal(false);
    if (response.data.new_media) {
      const signedUrls = response.data.new_media;

      const filesToUpload = files.filter((file: any) => file);

      console.log(5, { signedUrls, files, filesToUpload });

      const secondary_files = [
        secondImage,
        thirdImage,
        fourthImage,
        fiftImage,
      ].filter((file) => file);

      const main_image = firstImage;
      console.log({ secondary_files, main_image });

      if (signedUrls.main) {
        await axios.put(signedUrls.main, main_image, {
          headers: {
            "Content-type": main_image!.type,
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      signedUrls.secondaries.map(async (url: string, index: number) => {
        if (url !== "" && secondary_files[index]) {
          await axios.put(url, secondary_files[index], {
            headers: {
              "Content-type": secondary_files[index]!.type,
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      });
    }
    if (response.status === 200) {
      setStatusMessage({
        show: true,
        type: "success",
        message: {
          title: "Evento modificado exitosamente",
          body: "Seras redireccionado a tu lista de eventos en breve.",
        },
      });
    }
  };

  const setImage = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const target = event.target;
    if (target && target.files?.length) {
      const reader = new FileReader();

      console.log({ target });

      const idForImage = target.getAttribute("data-image");
      const indexForImage = Number(target.getAttribute("data-image-index"));
      reader.onload = function (e) {
        const src = e.target!.result as string;

        console.log({ idForImage });

        const image: HTMLImageElement | null = document.getElementById(
          idForImage!
        ) as HTMLImageElement;

        if (image) {
          image.src = src;
        } else {
          const imageTag = document.createElement("img");
          imageTag.id = idForImage!; // Set the ID as per your requirement
          imageTag.src = src;
          target.parentElement!.append(imageTag);

          const deleteButton = document.createElement("button");
          deleteButton.onclick = () => removeImage(indexForImage);
          deleteButton.innerHTML = deletePreviewMediaBtn;
          deleteButton.setAttribute("data-image-index", String(indexForImage)); // Set the ID as per your requirement
          deleteButton.classList.add("delete-media-btn"); // Set the ID as per your requirement

          target.parentElement!.append(deleteButton);
          target.parentElement!.append(imageTag);

          const placeholderIcon = target.previousSibling as HTMLElement;
          placeholderIcon.classList.add("hidden");
        }
      };

      reader.readAsDataURL(target.files[0]);

      if (index === 1) setFirstImage(target.files[0]);
      if (index === 2) setSecondImage(target.files[0]);
      if (index === 3) setThirdImage(target.files[0]);
      if (index === 4) setFourthImage(target.files[0]);
      if (index === 5) setFiftImage(target.files[0]);
    }
  };
  useEffect(() => {
    if (session?.user && session.user.name) {
      setUserInfo(session["user"]!);
    }
  }, [session]);

  useEffect(() => {
    if (post) {
      const post_id: string = post as string;

      console.log(3, { post_id });

      getEvent(post_id).then((data) => {
        if (data) {
          setDefaultValues({
            ...data,
            hashtags: data.hashtags
              ? isJsonString(data.hashtags)
                ? JSON.parse(data.hashtags)
                : data.hashtags
              : "",
          });
          setHashtags(
            isJsonString(data.hashtags)
              ? JSON.parse(data.hashtags)
              : data.hashtags
          );
          setLoading(false);
          setEventDate(data.date);
          setEventTime(data.time);
          setDirection({
            direction: data.direction,
            place_id: "",
            address_terms: [""],
          });
        }
      });
    }
  }, [post]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  if (!defaultValues) return;

  const MEDIA_INPUT_ID = "media-input";

  return (
    <div>
      <Head>
        <title>Actualiza tu evento</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>
      {statusMessage.type && (
        <StatusModal
          title={statusMessage.message.title}
          message={statusMessage.message.body}
          type={statusMessage.type}
          show={statusMessage.show}
          closeModal={() => {
            setStatusMessage((status) => ({ ...status, show: false }));

            setTimeout(() => {
              push("/user/my-events/");
            }, 2000);
          }}
        />
      )}
      {showConfirmUpdateModal && (
        <ConfirmationModal
          title={"Actualizar evento"}
          ilustration={<AiOutlineWarning size={76} />}
          message={
            "Validas que la informacion mostrada es la correcta. Estas a  punto de modificar la informacion del evento. "
          }
          show={showConfirmUpdateModal}
          closeModal={() => {
            toggleConfirmUpdateModal(false);
          }}
          continueAction={patchEvent}
        />
      )}

      <div className="mx-auto max-w-7xl px-4">
        <form onSubmit={formik.handleSubmit} className="mb-16">
          <div className="mb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
              <h1 className="text-3xl font-semibold">Actualiza tu evento</h1>

              <div className="ml-auto hidden gap-4 lg:flex">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="min-w-[120px] text-sm font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  className="min-w-[120px] text-sm"
                  variant="default"
                  type="submit"
                >
                  Actualizar
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="grid gap-8 md:gap-13">
              <div className="space-y-2">
                <Label>Titulo</Label>
                <Input
                  type="text"
                  placeholder="Digita tu titulo"
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className="text-sm text-red-500">{formik.errors.title}</div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={formik.values.category}
                  onValueChange={(value) => formik.setFieldValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => {
                      if (cat.value !== "all")
                        return (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        );
                    })}
                  </SelectContent>
                </Select>
                {formik.touched.category && formik.errors.category ? (
                  <div className="text-sm text-red-500">{formik.errors.category}</div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>Descripcion</Label>
                <Textarea
                  {...formik.getFieldProps("description")}
                  name="description"
                  rows={3}
                />
                {formik.touched.description && formik.errors.description ? (
                  <div className="text-sm text-red-500">{formik.errors.description}</div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>Hashtags</Label>
                <Input
                  type="text"
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setHashtags(e.target.value.split(/[, ]+/));
                    }
                  }}
                  placeholder="Normal text"
                  defaultValue={defaultValues?.hashtags?.join(" ")}
                />
                {hashtags && hashtags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {hashtags.map((hashtag, i) => (
                      <Badge key={i} variant="secondary">
                        {"#" + hashtag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tipo de asistencia</Label>
                <div className="flex max-w-[400px] gap-6">
                  <RadioGroup
                    defaultValue={defaultValues?.entrance_format}
                    onValueChange={(value) => setEntranceFormat(value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="free" />
                      <Label htmlFor="free">Gratis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pay" id="pay" />
                      <Label htmlFor="pay">Pago</Label>
                    </div>
                  </RadioGroup>

                  {(defaultValues?.entrance_format === "pay" ||
                    entrance_format === "pay") && (
                    <div className="flex">
                      <span className="flex items-center rounded-l-md border border-r-0 border-slate-200 bg-slate-50 px-3">
                        $
                      </span>
                      <Input
                        defaultValue={defaultValues?.fee}
                        onChange={(e) => setEntranceFee(Number(e.target.value))}
                        placeholder="Indique el precio"
                        className="rounded-l-none"
                      />
                      {displayRequiredFee && (
                        <span className="text-sm text-red-500">
                          El precio debe ser un número o mayor a 0
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-8 md:gap-13">
              <div className="space-y-2">
                <Label>Direccion</Label>
                <AutoComplete
                  defaultValue={defaultValues!.direction}
                  clearSearch={() => setDirection(undefined)}
                  onChangeLocation={(value: { location: string; id: string; city_id: string; city: string; terms: string[] }) => {
                    console.log(value);
                    setDirection({
                      direction: value.location,
                      place_id: value.id,
                      city_id: value.city_id,
                      city: value.city,
                      address_terms: value.terms,
                    });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha</Label>
                <div className="flex w-full flex-col gap-4 md:flex-row">
                  <DatePicker
                    isForm
                    className="h-10 w-full rounded-md border border-slate-200 md:max-w-[348px]"
                    seletedDate={eventDate}
                    handleDateChange={setEventDate}
                    defaultValue={format_date(defaultValues!.date ?? "")}
                  />

                  <div className="flex max-w-[172px] md:w-full lg:w-1/2">
                    <span className="flex items-center rounded-l-md border border-r-0 border-slate-200 bg-slate-50 px-3">
                      <AiOutlineClockCircle />
                    </span>
                    <TimePicker
                      use12Hours
                      format={format}
                      defaultValue={dayjs(defaultValues?.time, "HH:mm:ss")}
                      className="timepicker"
                      onOk={(val) => {
                        const minute: any = dayjs(val, "HH:mm").minute();
                        const hour: any = dayjs(val, "HH:mm").hour();
                        setEventTime(hour + ":" + minute + ":00");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Media</Label>
                <div className="mb-6">
                  <div
                    className={cx("relative flex h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4", {
                      "border-slate-300": defaultValues?.media?.[0],
                    })}
                  >
                    {defaultValues?.media?.[0] ? (
                      <div className="relative h-full w-full">
                        <img
                          id="image-block-1"
                          src={defaultValues.media[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <AiOutlineFileImage className="h-12 w-12 text-slate-400" />
                    )}
                    <input
                      className="absolute inset-0 cursor-pointer opacity-0"
                      name="main-media"
                      id="main-media"
                      data-image="image-block-1"
                      data-image-index="1"
                      type="file"
                      onChange={(e) => setImage(e, 1)}
                    />
                  </div>
                  <div className="mt-4">
                    <div className="mb-3 flex items-center gap-3">
                      {defaultValues.media && defaultValues.media.length > 0 ? (
                        <span className="text-base text-slate-900">
                          {defaultValues.media[0]
                            ? "..." +
                              defaultValues.media[0].slice(
                                Math.round(defaultValues.media[0].length / 2),
                                -1
                              )
                            : " No hay archivo seleccionado."}
                        </span>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("main-media")?.click()}
                          className="text-sm"
                        >
                          Seleccionar archivo...
                        </Button>
                      )}
                    </div>
                    <span className="text-sm text-slate-500">
                      Solo JPG, Webp, GIF or PNG. Tamaño maximo de 3mb
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                  {[2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className={cx("relative flex h-[120px] w-[120px] items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-2", {
                        "border-slate-300": defaultValues?.media?.[index - 1],
                      })}
                    >
                      {defaultValues?.media?.[index - 1] ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 z-10 h-6 w-6 rounded-full bg-white/80 p-0 hover:bg-white"
                          >
                            <AiOutlineCloseCircle className="h-4 w-4" />
                          </Button>
                          <div className="relative h-full w-full">
                            <img
                              src={defaultValues.media[index - 1]}
                              alt=""
                              id={`image-block-${index}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </>
                      ) : (
                        <AiOutlineFileImage className="h-8 w-8 text-slate-400" />
                      )}
                      <input
                        id={`${MEDIA_INPUT_ID}-image-${index}`}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        data-image={`image-block-${index}`}
                        data-image-index={index}
                        name={`media-${index}`}
                        onChange={(e) => setImage(e, index)}
                        type="file"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Enlace para adquirir</Label>
                <Input
                  type="text"
                  {...formik.getFieldProps("ticket_link")}
                />
              </div>
            </div>

            <div className="lg:hidden">
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  className="rounded-md"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="h-10 max-w-[400px] rounded-md"
                >
                  Actualizar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateEvent;
