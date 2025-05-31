import Head from "next/head";
import {
  Container,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
  InputGroup,
  Button,
  ButtonGroup,
  Badge,
} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { DatePicker } from "../../src/components/DatePicker";
import { AutoComplete as SearchDirection } from "../../src/index";
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
import EventMediaInputGroup from "@/components/forms/EventMediaInputGroup";
import { useRouter } from "next/router";
import { $axios } from "@/lib/utils";
import { CATEGORIES } from "@/lib/variables";
import RequiredStar from "@/components/text/RequiredStar";
import { useBackend } from "@/hooks";

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

      <Container id="main-content" className=" xl:container">
        <form
          onSubmit={(props) => {
            if (!media) setDisplayRequiredMedia(true);

            if (!direction) setDisplayRequiredLocation(true);

            if (fee && isNaN(fee)) setDisplayRequiredFee(true);

            if (eventTime === "" || eventDate) setDisplayRequiredDateTime(true);
            formik.handleSubmit(props);
          }}
          className="mb-[32px] lg:my-[32px]"
        >
          <Row className="gap-[32px]">
            <Col className="heading-container flex items-center" lg={12}>
              <h1 className="text-3xl lg:text-5xl font-semibold mb-0">
                Crea tu evento
              </h1>

              <ButtonGroup className="ml-auto hidden lg:flex ">
                {/* TODO: Create Preview Event Functionality */}
                {/* <Button>Previzualizar</Button> */}
                <Button type="submit" className="h-[40px]">
                  Publicar evento
                </Button>
              </ButtonGroup>
            </Col>
          </Row>

          <Row className="gap-[32px] lg:gap-[56px] grid grid-cols-1 lg:grid-cols-2 max-lg:pt-0 ">
            <Col className="grid gap-y-[32px] md:gap-y-[52px] w-full">
              <Form.Group>
                <Form.Label>
                  Titulo <RequiredStar />
                </Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("title")}
                  placeholder="Digita tu titulo"
                />

                {formik.touched.title && formik.errors.title ? (
                  <div style={{ color: "red" }}> {formik.errors.title}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>
                  Categoria <RequiredStar />
                </Form.Label>
                <Form.Select
                  {...formik.getFieldProps("category")}
                  aria-label="Selecciona una categoria"
                >
                  <option>Seleccione una categoría</option>

                  {CATEGORIES.map((cat) => {
                    if (cat.value !== "all")
                      return (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      );
                  })}
                </Form.Select>

                {formik.touched.category && formik.errors.category ? (
                  <div style={{ color: "red" }}> {formik.errors.category}</div>
                ) : null}
              </Form.Group>

              {/* TODO: Workout the secondary categories logic */}
              {/* <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Categoria secundaria</Form.Label>
                <Form.Select aria-label="Default select example">
                  <option>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </Form.Group> */}
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>
                  Descripción <RequiredStar />
                </Form.Label>
                <Form.Control
                  as="textarea"
                  {...formik.getFieldProps("description")}
                  name="description"
                  rows={3}
                />
                {formik.touched.description && formik.errors.description ? (
                  <div style={{ color: "red" }}>
                    {formik.errors.description}
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Hashtags</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setHashtags(e.target.value.split(/[, ]+/));
                    }
                  }}
                  placeholder="Normal text"
                />

                {hashtags && (
                  <div className="flex  flex-wrap gap-x-[8px] gap-y-[8px] mt-[16px]">
                    {hashtags.map((hashtag, i) => (
                      <Badge key={i} bg="secondary">
                        {"#" + hashtag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Tipo de asistencia</Form.Label>

                <div className="flex gap-[24px] max-w-[400px]">
                  <div>
                    <ToggleButtonGroup
                      type="radio"
                      defaultValue="free"
                      name="entrance_format"
                    >
                      <ToggleButton
                        id="tbg-radio-1"
                        value="free"
                        onChange={(e) => setEntranceFormat(e.target.value)}
                      >
                        Gratis
                      </ToggleButton>
                      <ToggleButton
                        id="tbg-radio-2"
                        value="pay"
                        onChange={(e) => setEntranceFormat(e.target.value)}
                      >
                        Pago
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                  {entrance_format === "pay" && (
                    <>
                      <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          onChange={(e) =>
                            setEntranceFee(Number(e.target.value))
                          }
                          placeholder="Indique el precio"
                          aria-label="Indique el precio"
                        />

                        {displayRequiredFee && (
                          <span className="requiered-warning">
                            El precio debe ser un número o mayor a 0
                          </span>
                        )}
                      </InputGroup>
                    </>
                  )}
                </div>
              </Form.Group>
            </Col>
            <Col className="flex flex-col gap-y-[32px] md:gap-y-[52px]">
              <Form.Group
                controlId="exampleForm.ControlTextarea1"
                className="w-full"
              >
                <div className="flex">
                  <Form.Label>
                    Dirección <RequiredStar />
                  </Form.Label>
                  {/* TODO: Develop manual setup of the address instead of using
                  Google Maps autocomplete */}
                  {/* <div className="ml-auto">
                    <ToggleButtonGroup
                      type="radio"
                      name="options"
                      defaultValue={1}
                    >
                      <ToggleButton
                        id="tbg-radio-1"
                        className="w-[152px]"
                        value={1}
                      >
                        Auto completar
                      </ToggleButton>
                      <ToggleButton
                        id="tbg-radio-2"
                        className="w-[152px]"
                        value={fv2}
                      >
                        Manual
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div> */}
                </div>
                <InputGroup className="flex-nowrap">
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
                </InputGroup>
              </Form.Group>
              <Form.Group
                controlId="exampleForm.ControlTextarea1"
                className="relative"
              >
                <Form.Label>
                  Fecha <RequiredStar />
                </Form.Label>

                <div className="flex w-full flex-col md:flex-row gap-[16px]">
                  <DatePicker
                    className="border-[1px] border-slate-200 flex items-center  rounded-[8px]  w-full md:max-w-[348px] relative h-[40px]"
                    seletedDate={eventDate}
                    isForm
                    handleDateChange={setEventDate}
                  />

                  <InputGroup className=" max-w-[172px] md:w-full flex-nowrap lg:w-[50%]">
                    <InputGroup.Text id="basic-addon1">
                      <AiOutlineClockCircle />
                    </InputGroup.Text>

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
                  </InputGroup>
                </div>

                {displayRequiredDateTime && (
                  <span className="requiered-warning">
                    Indicar una hora y fecha es requerido.
                  </span>
                )}
              </Form.Group>

              <EventMediaInputGroup
                id="create-event-media"
                isRequired
                displayWarning={displayRequiredMedia}
                setImage={setMediaState}
              />

              {/* TODO: Allow posted set specific social network links for new event */}
              {/* Social networks deben agregarse del profile information en el post, no tener que indicarlo en la
                    creacion del post */}

              <Form.Group className="w-full">
                <Form.Label>Enlace para adquirir o reservar</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Indica el enlace para adquirir o reservar tu cupo"
                  onChange={(e) => setEventLink(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col>
              <ButtonGroup className="ml-auto  lg:hidden justify-center flex">
                {/* TODO: Create Preview Event Functionality */}
                {/* <Button>Previzualizar</Button> */}
                <Button type="submit" className="h-[40px] max-w-[400px]">
                  Publicar evento
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </form>
      </Container>

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
