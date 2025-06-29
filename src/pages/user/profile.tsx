import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { redirect } from "next/navigation";
import { MdLocationPin } from "react-icons/md";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import PublicProfile from "@/components/complex/PublicProfile";
import { userI, NotificationType } from "@/interfaces";
import ToastBanner from "@/components/messages/banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import BusinessHours, { BusinessHoursSlot } from "@/components/BusinessHours";
import BusinessProfileImageUpload from "@/components/BusinessProfileImageUpload";

dayjs.locale("es-do");

export async function getServerSideProps(context: { req: any }) {
  const session = await getSession({ req: context.req });
  // If the user is not authenticated, redirect to the home page
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

const UserSettings = () => {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    redirect("/");
  }

  const router = useRouter();
  const [userInfo, setUserInfo] = useState<userI>();
  const [activeKey, setActiveKey] = useState("");
  const [statusMessage, setStatusMessage] = useState<{
    type?: "success" | "warning" | "error";
    message?: string;
    is_visible: boolean;
  }>({ is_visible: false });
  const [businessHours, setBusinessHours] = useState<BusinessHoursSlot[]>([]);
  const [businessAddress, setBusinessAddress] = useState("");
  const [name, setName] = useState(userInfo?.name || "");
  const [username, setUsername] = useState(userInfo?.username || "");
  const [biography, setBiography] = useState(userInfo?.biography || "");
  const [contactEmail, setContactEmail] = useState(
    userInfo?.contact_email || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phone_number || "");
  const [placeId, setPlaceId] = useState(userInfo?.place_id || "");
  const [isBusiness, setIsBusiness] = useState(userInfo?.is_business || false);
  const [socialNetworks, setSocialNetworks] = useState({
    website: "",
    facebook: "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
    twitter: "",
    youtube: "",
  });
  const [usernameError, setUsernameError] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;

    console.log("hash", hash);
    if (hash) {
      setActiveKey(hash.slice(1));
    }
  }, []);

  useEffect(() => {
    if (session?.user && session.user.name) {
      console.log("session", session.user);
      setUserInfo(session["user"]!);
      setName(session.user.name || "");
      setUsername((session.user as any).username || "");
      setBiography((session.user as any).biography || "");
      setContactEmail((session.user as any).contact_email || "");
      setPhoneNumber((session.user as any).phone_number || "");
    }
  }, [session]);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || "");
      setUsername(userInfo.username || "");
      setBiography(userInfo.biography || "");
      setContactEmail(userInfo.contact_email || "");
      setPhoneNumber(userInfo.phone_number || "");
      setBusinessAddress(userInfo.location || "");
      setIsBusiness(!!userInfo.is_business);
      // Handle business hours (schedule)
      if (userInfo.schedule) {
        try {
          const parsed =
            typeof userInfo.schedule === "string"
              ? JSON.parse(userInfo.schedule)
              : userInfo.schedule;
          setBusinessHours(Array.isArray(parsed) ? parsed : []);
        } catch {
          setBusinessHours([]);
        }
      }
      // Handle social networks
      if (userInfo.social_networks) {
        try {
          const parsed =
            typeof userInfo.social_networks === "string"
              ? JSON.parse(userInfo.social_networks)
              : userInfo.social_networks;
          setSocialNetworks({
            website: parsed.website || "",
            facebook: parsed.facebook || "",
            whatsapp: parsed.whatsapp || "",
            instagram: parsed.instagram || "",
            tiktok: parsed.tiktok || "",
            twitter: parsed.twitter || "",
            youtube: parsed.youtube || "",
          });
        } catch {
          setSocialNetworks({
            website: "",
            facebook: "",
            whatsapp: "",
            instagram: "",
            tiktok: "",
            twitter: "",
            youtube: "",
          });
        }
      }
      // Handle business profile image
      if (userInfo.business_picture) {
        setProfileImageUrl(userInfo.business_picture);
      }
    }
  }, [userInfo]);

  const handleSave = async () => {
    // Prevent clearing username if it previously had a value
    if (userInfo?.username && (!username || username.trim() === "")) {
      setUsernameError(
        "El nombre de usuario no puede quedar vacío si ya existía."
      );
      return;
    } else {
      setUsernameError("");
    }

    // Prepare the file metadata if a new image is selected
    let fileMeta = null;
    if (profileImage) {
      fileMeta = { name: profileImage.name, type: profileImage.type };
    }

    const payload = {
      name,
      username,
      biography,
      contact_email: contactEmail,
      phone_number: phoneNumber,
      location: businessAddress,
      is_business: isBusiness,
      schedule: businessHours.length > 0 ? businessHours : [],
      ...socialNetworks,
      ...(fileMeta && { file: fileMeta }),
    };

    console.log("payload", payload);

    // 1. Send PATCH request with file metadata if present
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}api/user/business-profile/${userInfo?.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.user.business_picture && profileImage) {
        await fetch(data.user.business_picture, {
          method: "PUT",
          headers: { "Content-Type": profileImage.type },
          body: profileImage,
        });
      }
    }

    if (res.ok) {
      // Show success message
      console.log("Success");
    } else {
      console.log("Error");
      // Show error
    }
  };

  const resetToDefaults = () => {
    if (userInfo) {
      setName(userInfo.name || "");
      setUsername(userInfo.username || "");
      setBiography(userInfo.biography || "");
      setContactEmail(userInfo.contact_email || "");
      setPhoneNumber(userInfo.phone_number || "");
      setBusinessAddress(userInfo.location || "");
      setIsBusiness(!!userInfo.is_business);
      if (userInfo.schedule) {
        try {
          const parsed =
            typeof userInfo.schedule === "string"
              ? JSON.parse(userInfo.schedule)
              : userInfo.schedule;
          setBusinessHours(Array.isArray(parsed) ? parsed : []);
        } catch {
          setBusinessHours([]);
        }
      }
      if (userInfo.social_networks) {
        try {
          const parsed =
            typeof userInfo.social_networks === "string"
              ? JSON.parse(userInfo.social_networks)
              : userInfo.social_networks;
          setSocialNetworks({
            website: parsed.website || "",
            facebook: parsed.facebook || "",
            whatsapp: parsed.whatsapp || "",
            instagram: parsed.instagram || "",
            tiktok: parsed.tiktok || "",
            twitter: parsed.twitter || "",
            youtube: parsed.youtube || "",
          });
        } catch {
          setSocialNetworks({
            website: "",
            facebook: "",
            whatsapp: "",
            instagram: "",
            tiktok: "",
            twitter: "",
            youtube: "",
          });
        }
      }
      if (userInfo.business_picture) {
        setProfileImageUrl(userInfo.business_picture);
        setProfileImage(null);
      }
    }

    setIsEditing(false);
  };

  return (
    <div>
      <Head>
        <title>Ajustes de tu cuenta - Encoro</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="mx-auto max-w-[1200px] px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8 justify-between">
          <div className="flex items-center gap-6">
            <div className="w-[88px] h-[88px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : profileImageUrl || ""
                }
                alt=""
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <div className="font-semibold text-lg">{userInfo?.name}</div>
              <div className="text-slate-500">@{userInfo?.username}</div>
              <div className="text-xs text-slate-400">
                Business ID: #{userInfo?.id?.slice(0, 6)}
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            disabled={!userInfo || status === "loading" || isEditing}
            onClick={() => setIsEditing(true)}
            className="h-10 px-8 text-base font-semibold"
          >
            Editar
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="public_profile" className="mb-8">
          <TabsList>
            <TabsTrigger value="public_profile">Perfil Público</TabsTrigger>
            <TabsTrigger value="account">Mi cuenta</TabsTrigger>
          </TabsList>
          <TabsContent value="public_profile">
            {/* Profile Edit Form */}
            {/* Avatar upload */}
            <BusinessProfileImageUpload
              imageUrl={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : profileImageUrl || ""
              }
              onFileChange={(file) => {
                if (isEditing) {
                  setProfileImage(file);
                  if (file) {
                    setProfileImageUrl(URL.createObjectURL(file));
                  }
                }
              }}
              disabled={!isEditing}
            />
            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label>Nombre del negocio</Label>
                <Input
                  defaultValue={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Nombre de usuario</Label>
                <Input
                  defaultValue={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing}
                />
                {usernameError && (
                  <div className="text-red-500 text-xs mt-1">
                    {usernameError}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-6">
              <Label>
                Dirección del negocio{" "}
                <span className="text-xs text-slate-400 font-normal">
                  (opcional)
                </span>
              </Label>
              <Input
                type="text"
                placeholder="Ej: Calle 123, Ciudad, País"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            {/* Schedule */}
            <div className="mb-6">
              <Label>
                Horario{" "}
                <span className="text-xs text-slate-400 font-normal">
                  (opcional)
                </span>
              </Label>
              {businessHours.length === 0 ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setBusinessHours([
                      { dayFrom: "", dayTo: "", hourFrom: "", hourTo: "" },
                    ])
                  }
                  className="mb-2"
                  disabled={!isEditing}
                >
                  Agregar horario
                </Button>
              ) : (
                <BusinessHours
                  value={businessHours}
                  onChange={setBusinessHours}
                  disabled={!isEditing}
                />
              )}
              <div className="text-xs text-slate-400 mt-1">
                Puedes dejar este campo vacío si no deseas mostrar un horario.
              </div>
            </div>
            {/* Bio/description */}
            <div className="mb-6">
              <Label>Biografía / descripción</Label>
              <Textarea
                value={biography}
                rows={4}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Cuéntanos sobre tu negocio..."
                disabled={!isEditing}
              />
            </div>
            {/* Social networks */}
            <div className="mb-6">
              <Label>Redes sociales</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(socialNetworks).map((key) => (
                  <Input
                    key={key}
                    placeholder={
                      key === "website"
                        ? "Sitio web"
                        : key.charAt(0).toUpperCase() + key.slice(1)
                    }
                    value={socialNetworks[key]}
                    onChange={(e) =>
                      setSocialNetworks({
                        ...socialNetworks,
                        [key]: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                  />
                ))}
              </div>
            </div>
            {/* Action buttons */}
            {isEditing && (
              <div className="flex gap-4 justify-end">
                <Button variant="secondary" onClick={resetToDefaults}>
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  onClick={async () => {
                    await handleSave();
                    setIsEditing(false);
                  }}
                >
                  Guardar cambios
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="account">
            {/* Mi cuenta content here */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserSettings;
