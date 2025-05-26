import {
  FaFacebookF,
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillPhone,
  AiFillMail,
} from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { IoIosGlobe } from "react-icons/io";
import { AutoComplete } from "@/components/location/AutoComplete";
import {
  AutoCompleteI,
  NotificationType,
  userI,
  socialNetworksI,
} from "@//interfaces";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/es";
import timezone from "dayjs/plugin/timezone";
import ConfirmationModal from "@/components/messages/ConfirmationModal";
import { useBackend } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

dayjs.extend(utc);
dayjs.extend(timezone);

const PublicProfile = ({
  publicProfile,
  isRegistering,
  triggerNotification,
}: {
  publicProfile: userI;
  isRegistering?: boolean;
  triggerNotification: (props: {
    type: NotificationType;
    is_visible: boolean;
  }) => void;
}) => {
  const { patch, post, get } = useBackend();
  const [business_picture, set_business_picture] = useState<File>();
  const [direction, setDirection] = useState<AutoCompleteI>();
  const [usernameError, setUsernameError] = useState(false);
  const [business_hours, set_business_hours] = useState<any[]>([
    { start_day: "", end_day: "", time: "", time_obj: "" },
  ]);
  const [profileInfo, setProfileInfo] = useState({
    username: "",
    biography: "",
    phone_number: "",
    location: "",
    contact_email: "",
  });

  const [social_networks, setSocialNetworks] = useState<socialNetworksI>({
    website: "",
    facebook: "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
    twitter: "",
    youtube: "",
  });

  const [showConfirmActionModal, toggleConfirmActionModal] = useState<{
    is_visible: boolean;
    payload?: any;
  }>({ is_visible: false });

  const time_of_day_format = "h:mm a";

  const pushNewSchedule = () => {
    set_business_hours((old) => [
      ...old,
      { start_day: "", end_day: "", time: "", time_obj: "" },
    ]);
  };

  const removeSchedule = (key: number) => {
    set_business_hours((old) => old.splice(key, 1));
  };

  const scheduleHandler = (
    index: number,
    { action_type, days, time, key }: any
  ) => {
    let obj: any = {
      start_day: "",
      end_day: "",
      time: "",
      time_obj: "",
    };

    if (business_hours.length === 1) {
      obj = business_hours[0];
    } else {
      obj = business_hours[index];
    }

    console.log({ obj });
    console.log({ action_type, days, time, key, obj });
    if (action_type === "add_start_day") {
      obj.start_day = days.start;
    }
    if (action_type === "add_end_day") {
      obj.end_day = days.end;
    }

    if (action_type === "set_time") {
      obj.time = time.hours;
      obj.time_obj = time.obj;
      console.log("set_time", key, [obj]);
    }
    const old_values = business_hours.filter((_, i) => i !== index);

    console.log({ old_values });

    set_business_hours([...old_values, obj]);

    if (key) {
      // set_business_hours((old) => old.filter(( _, i) => obj !== index) );
    }

    // Use the spread operator to copy the existing array, update the object at the specified key, and set the state
    // set_business_hours([...business_hours.slice(0, key), obj, ...business_hours.slice(key + 1)]);
  };
  const formik = useFormik({
    initialValues: {
      name: publicProfile.name,
      username: publicProfile.username,
      biography: publicProfile.biography,
      location: publicProfile.location,
      phone_number: publicProfile.phone_number,
      contact_email: publicProfile.contact_email,
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .min(5, "Must be 5 characters or more")
        .required("Required"),
      contact_email: Yup.string().email("Email invalido"),
      biography: Yup.string()
        .min(15, "Description required. Must be 15 characters or more")
        .required("Required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      if (!publicProfile && !isRegistering) return;

      const filteredArr = business_hours.filter((obj) => {
        return Object.values(obj).every(
          (prop) => prop !== null && prop !== undefined
        );
      });

      let payload: any = values;

      if (publicProfile.username !== payload.username) {
        const usernameCheck = await validateUsername(payload.username);
        if (!usernameCheck || usernameCheck.isValid === false) {
          return setUsernameError(true);
        }
      }

      payload = {
        ...payload,
        ...social_networks,
      };
      if (isRegistering) {
        payload = { ...payload, is_business: true };
      }

      toggleConfirmActionModal({
        is_visible: true,
        payload: {
          ...payload,
          location: direction?.direction ? direction?.direction : "",
          place_id: direction?.place_id ? direction?.place_id : "",
          schedule: filteredArr,
        },
      });
    },
  });

  const updateProfile = async () => {
    const { payload } = showConfirmActionModal;

    const response = await patch(
      `/api/user/business-profile/${publicProfile.id}`,
      {
        ...payload,
      }
    );

    toggleConfirmActionModal({ is_visible: false });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (business_picture) {
      const file = business_picture;

      const { name, type } = file;

      const response = await post("/api/user/business-profile/upload-picture", {
        file: { name, type },
        id: publicProfile?.id,
      });

      const signedUrls = response.data;

      await axios.put(signedUrls, file, {
        headers: {
          "Content-type": file.type,
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    if (response.status === 201) {
      triggerNotification({ is_visible: true, type: "success" });
    }

    if (response.status === 500) {
      triggerNotification({ is_visible: true, type: "error" });
    }
  };

  const validateUsername = async (value: string) => {
    const response = await get(
      `/api/user/business-profile/validate-username?username=${value}`
    );

    if (response.status === 200) {
      return response.data;
    }
  };
  useEffect(() => {
    if (
      publicProfile &&
      publicProfile.social_networks &&
      typeof publicProfile.social_networks === "object"
    ) {
      const { social_networks } = publicProfile;

      console.log("INIT FETCH PROFILE", { social_networks });
      setSocialNetworks(social_networks);
    }
  }, [publicProfile]);

  useEffect(() => {
    if (publicProfile.schedule && publicProfile.schedule.length > 0) {
      publicProfile.schedule.forEach((item: any) => {
        const time = item?.time.split(" - ");

        const start_time = String(`2000-01-01 ${time[0]}`);
        const end_time = String(`2000-01-01 ${time[1]}`);
        const defaultStartTime = dayjs(start_time, "YYYY-MM-DD h:mm A").locale(
          "es"
        );
        const defaultEndTime = dayjs(end_time, "YYYY-MM-DD h:mm A").locale(
          "es"
        );

        console.log("PRE", dayjs(defaultStartTime, time_of_day_format));
        item.default = [
          dayjs(defaultStartTime, time_of_day_format),
          dayjs(defaultEndTime, time_of_day_format),
        ];
      });
      set_business_hours(publicProfile.schedule);
    }
  }, []);
  return (
    <>
      {showConfirmActionModal.is_visible ? (
        <ConfirmationModal
          ilustration={<img src="/images/update-profile-icon.svg" />}
          title="Actualizar perfil"
          message={
            <>
              <p>
                Estas apunto de actualizar tu perfil, valida que la informacion
                sea correcta.
              </p>
              <p>
                {" "}
                Si es la primera vez que actualizas tu perfil, esto te creara un
                perfil de negocio para publicar eventos.
              </p>
            </>
          }
          closeModal={() => toggleConfirmActionModal({ is_visible: false })}
          show={showConfirmActionModal.is_visible}
          continueAction={() => updateProfile()}
        />
      ) : null}

      <h3 className="mb-8 text-3xl font-semibold">
        {!!isRegistering ? "Create business profile" : "Ajustes de usuario"}
      </h3>

      <form onSubmit={formik.handleSubmit} className="mb-32">
        <div className="space-y-8">
          <div className="space-y-2">
            <Label>Foto de perfil</Label>
            <div className="flex items-center gap-4">
              {publicProfile.business_picture && (
                <span className="block">
                  <img
                    src={publicProfile.business_picture}
                    alt=""
                    className="h-[132px] w-[132px] rounded-3xl object-cover"
                  />
                </span>
              )}
              <Input
                name="main-media"
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const target = e.target as HTMLInputElement;
                  if (target && target.files?.length) {
                    set_business_picture(target.files[0]);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nombre del negocio</Label>
            <Input
              type="text"
              placeholder="Nombre de usuario"
              {...formik.getFieldProps("name")}
            />
          </div>

          <div className="space-y-2">
            <Label>Nombre de usuario</Label>
            <Input
              type="text"
              placeholder="Nombre de usuario"
              {...formik.getFieldProps("username")}
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                const username = e.target.value;
                setUsernameError(false);
                formik.setFieldValue("username", username);

                if (publicProfile.username !== username) {
                  const res = await validateUsername(username);
                  setUsernameError(!res.isValid);
                }
              }}
            />
            {usernameError && (
              <span className="mt-1 block text-sm text-red-500">
                *Nombre de usuario no valido.
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Teléfono</Label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                <AiFillPhone />
              </span>
              <Input
                type="text"
                placeholder="Numero de telefono"
                className="rounded-l-none"
                {...formik.getFieldProps("phone_number")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Correos electrónico</Label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                <AiFillMail />
              </span>
              <Input
                type="text"
                placeholder="Email de contacto"
                className="rounded-l-none"
                {...formik.getFieldProps("contact_email")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Direccion</Label>
            <AutoComplete
              clearSearch={() => setDirection(undefined)}
              defaultValue={publicProfile.location}
              onChangeLocation={(value: any) => {
                setDirection({
                  direction: value.location,
                  place_id: value.id,
                  address_terms: value.terms,
                });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Biografia</Label>
            <Textarea
              rows={3}
              {...formik.getFieldProps("biography")}
            />
          </div>

          <div className="space-y-4">
            <Label>Horario</Label>
            {business_hours.length > 0
              ? business_hours.map((item, index) => {
                  const options = [
                    { value: "lunes", label: "Lunes" },
                    { value: "martes", label: "Martes" },
                    { value: "miercoles", label: "Miercoles" },
                    { value: "jueves", label: "Jueves" },
                    { value: "viernes", label: "Viernes" },
                    { value: "sabado", label: "Sabado" },
                    { value: "domingo", label: "Domingo" },
                  ];
                  return (
                    <div
                      className="flex flex-wrap gap-4 lg:gap-6"
                      key={index}
                    >
                      <div className="flex w-full gap-2">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                          <IoIosGlobe />
                        </span>
                        <Select
                          value={item.start_day}
                          onValueChange={(value: string) => {
                            scheduleHandler(index, {
                              action_type: "add_start_day",
                              days: { start: value },
                            });
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Desde" />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((option, i) => (
                              <SelectItem key={i} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={item.end_day}
                          onValueChange={(value: string) => {
                            scheduleHandler(index, {
                              action_type: "add_end_day",
                              days: { end: value },
                            });
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Hasta" />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((option, i) => (
                              <SelectItem key={i} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="relative max-w-[220px]">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                          <IoIosGlobe />
                        </span>
                        <TimePicker.RangePicker
                          format={time_of_day_format}
                          placeholder={["Desde", "Hasta"]}
                          className="form-time-picker"
                          onOk={(val) => {
                            if (!val) return;
                            const time_1: any = dayjs(val[0])
                              .tz("America/New_York")
                              .format("h:mm A");
                            const time_2: any = dayjs(val[1])
                              .tz("America/New_York")
                              .format("h:mm A");

                            scheduleHandler(index, {
                              action_type: "set_time",
                              time: {
                                hours: time_1 + " - " + time_2,
                                obj: val,
                              },
                              key: index,
                            });
                          }}
                        />
                        {item.time && item.time != "" && (
                          <span className="absolute right-0 top-0 flex items-center gap-2">
                            {item.time}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                const target = e.target as Element;
                                if (
                                  target.parentNode &&
                                  target.parentNode.parentNode
                                )
                                  (
                                    target.parentNode.parentNode as Element
                                  ).remove();
                                e.stopPropagation();
                              }}
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </Button>
                          </span>
                        )}
                      </div>

                      {business_hours.length === index + 1 ? (
                        <Button
                          onClick={pushNewSchedule}
                          variant="outline"
                          size="icon"
                          className="rounded-md"
                        >
                          <AiOutlinePlus className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => removeSchedule(index)}
                          variant="outline"
                          size="icon"
                          className="rounded-md"
                        >
                          <AiOutlineMinus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })
              : null}
          </div>

          <div className="space-y-4">
            <Label>Redes sociales</Label>

            <div className="space-y-4">
              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                  <FaInstagram />
                </span>
                <Input
                  type="text"
                  placeholder="Instagram"
                  className="rounded-l-none"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSocialNetworks({
                      ...social_networks,
                      instagram: e.target.value,
                    })
                  }
                  defaultValue={social_networks.instagram}
                />
              </div>

              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                  <FaTiktok />
                </span>
                <Input
                  type="text"
                  placeholder="TikTok"
                  className="rounded-l-none"
                  defaultValue={social_networks.tiktok}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSocialNetworks({
                      ...social_networks,
                      tiktok: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                  <FaFacebookF />
                </span>
                <Input
                  type="text"
                  placeholder="Facebook"
                  className="rounded-l-none"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSocialNetworks({
                      ...social_networks,
                      facebook: e.target.value,
                    })
                  }
                  defaultValue={social_networks.facebook}
                />
              </div>

              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                  <FaWhatsapp />
                </span>
                <Input
                  type="text"
                  placeholder="Whatsapp"
                  className="rounded-l-none"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSocialNetworks({
                      ...social_networks,
                      whatsapp: e.target.value,
                    })
                  }
                  defaultValue={social_networks.whatsapp}
                />
              </div>

              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                  <IoIosGlobe />
                </span>
                <Input
                  type="text"
                  placeholder="Website"
                  className="rounded-l-none"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSocialNetworks({
                      ...social_networks,
                      website: e.target.value,
                    })
                  }
                  defaultValue={social_networks.website}
                />
              </div>

              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                  <FaTwitter />
                </span>
                <Input
                  type="text"
                  placeholder="Twitter"
                  className="rounded-l-none"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSocialNetworks({
                      ...social_networks,
                      twitter: e.target.value,
                    })
                  }
                  defaultValue={social_networks.twitter}
                />
              </div>

              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                  <FaYoutube />
                </span>
                <Input
                  type="text"
                  placeholder="Canal de Youtube"
                  className="rounded-l-none"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSocialNetworks({
                      ...social_networks,
                      youtube: e.target.value,
                    })
                  }
                  defaultValue={social_networks.youtube}
                />
              </div>
            </div>
          </div>

          <div className="mt-9 flex gap-6">
            <Button variant="outline">Descartar</Button>
            <Button type="submit">Guardar cambios</Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PublicProfile;
