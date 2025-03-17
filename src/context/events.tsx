import { useEffect, useState } from "react";
import { createContext, FC, ReactNode, useContext } from "react";
import { useSession } from "next-auth/react";
import { userI, ListOfCititesType, UserNotificationType } from "@/interfaces";
import axios from "axios";
import { useBackend } from "../hooks";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

type EventsContextType = {
  [key: string]: any;
};

type Organizer = {
  id: string;
  name: string;
  email: string;
  image: string;
  phone_number: string;
  contact_email: string;
  username: string;
  location: string;
  business_picture: string;
};

const eventsContextDefaultValues: EventsContextType = {
  user: "Hello World",
  login: () => {},
  logout: () => {},
};

const EventsContext = createContext<EventsContextType>(
  eventsContextDefaultValues
);

export const EventsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState("hello world");
  const [user_notifications, setUserNotifications] = useState<
    UserNotificationType[]
  >([]);
  const [availableCities, setAvailableCities] = useState<ListOfCititesType[]>(
    []
  );
  const [date_filter, setDateFilter] = useState<string | undefined>();
  const [location, setLocation] = useState<{
    country?: string;
    city: string;
    cloud_lookup?: boolean;
    [key: string]: any;
  }>();
  const { get, destroy, post } = useBackend();
  const [showClearFilter, toggleClearFilter] = useState(false);
  const [eventsCategory, setEventsCategory] = useState<String>("all");
  const { data: session } = useSession();
  const userInfo: userI | undefined = session?.user;
  const [followEvents, setFollowedEvents] = useState<any>([]);
  const [followEventsIds, setFollowedEventsIds] = useState<any>([]);
  const [followedOrganizers, setFollowedOrganizers] = useState<Organizer[]>([]);

  const { push, query, pathname } = useRouter();

  const supabase = createClient(
    "https://rgsebyligazamgnwjghu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnc2VieWxpZ2F6YW1nbndqZ2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNjI3NjIsImV4cCI6MjA0NjczODc2Mn0.SwhrGF9TRqn8QnhqYmLtwzaYF3S2WmKGX1dVaz-nzes"
  );
  useEffect(() => {
    if (userInfo && userInfo.id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}api/followed-events`, {
          params: { user: userInfo!.id },
        })
        .then((res) => {
          if (res.status === 200) {
            setFollowedEvents(res.data);
            const ids = res.data.map((item: { id: string }) => item.id);
            setFollowedEventsIds(ids);
          }
        })
        .catch((error) => {
          // Handle errors
          console.log({ error });
        });

      get(`/api/notifications/${userInfo!.id}`)
        .then((res) => {
          if (res.status === 200) {
            setUserNotifications(res.data);
          }
        })
        .catch((error) => {
          // Handle errors
          console.log({ error: error.message });
        });
    }
  }, [userInfo]);

  const workaroundLocationLookup = async () => {
    const { data } = await get("/api/client-location-lookup");

    if (data) {
      console.log("LOCATION LOOKUP", { data });
      const json = JSON.stringify({ ...data, cloud_lookup: true });
      setLocation({ ...data, cloud_lookup: true });

      localStorage.setItem("location", json);
    } else {
      localStorage.setItem(
        "location",
        JSON.stringify({ city: "", city_id: "" })
      );
    }
  };

  const clearLocation = () => {
    const session_location = localStorage.getItem("location");

    if (session_location) {
      setLocation(JSON.parse(session_location));
      toggleClearFilter(false);
    }
  };

  const getUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Handle the user's location
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.lat},${userLocation.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API}`;
          const { data, status } = await axios.get(apiUrl);

          type GeoCodingResult = {
            address_components: {
              long_name: string;
              short_name: string;
              types: string[];
            }[];
            formatted_address: string;
            types: string[];
            [key: string]: any;
          };

          if (status === 200) {
            const result: GeoCodingResult = data.results.find(
              (item: GeoCodingResult) =>
                item.types[0] === "administrative_area_level_1"
            );

            console.log("LOCATION LOOKUP", { result });
            const city =
              result.address_components.length > 0 &&
              result.address_components[0].long_name
                ? result.address_components[0].long_name
                : "";
            const country =
              result.address_components.length > 2 &&
              result.address_components[2].long_name
                ? result.address_components[2].long_name
                : "";

            const json = JSON.stringify({ city, country });

            setLocation({ city, country });
            // if (!localStorage.getItem("location")) {
            localStorage.setItem("location", json);
            // }
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            console.error("User denied geolocation permission.");
            workaroundLocationLookup();
          } else {
            console.error("Error getting user location:", error);
          }
        }
      );
    } else {
      // Geolocation is not supported
      console.error("Geolocation is not supported by this browser.");
      workaroundLocationLookup();
    }
  };

  const getCountryCititesThatHaveEvents = async () => {
    try {
      const { data } = await get("/api/cities", {
        params: {
          country: "DO",
        },
      });

      const aggregate_data: any = {};

      data.forEach((element: any) => {
        if (!aggregate_data[element.city]) {
          aggregate_data[element.city] = {
            city: element.city,
            eventCount: 1,
          };
        } else {
          aggregate_data[element.city].eventCount += Number(element.eventCount);
        }
      });

      if (data) setAvailableCities(Object.values(aggregate_data));
    } catch (e) {
      console.error("Error getting cities with events:", e);
    }
  };

  const followEvent = async (eventId: string, userId: string) => {
    if (followEventsIds.includes(eventId)) {
      const { status } = await destroy(`/api/unfollow-event`, {
        data: {
          user: userId,
          event: eventId,
        },
      });
      if (status === 200) {
        setFollowedEventsIds((ids: string[]) =>
          ids.filter((id: string) => id !== eventId)
        );
      }
    } else {
      const { status } = await post(`/api/follow-event`, {
        user: userId,
        event: eventId,
      });

      if (status === 201) {
        setFollowedEventsIds([...followEventsIds, eventId]);
      }
    }
  };

  const handleCategoryPageNavigation = (category: string) => {
    setEventsCategory(category);
    if (category) {
      if (category === "all") {
        return push("/");
      }
      push(`/${category}/`);
    }
  };

  useEffect(() => {
    if (query.date) {
      console.log("DATE QUERY", query);

      setDateFilter(query.date as string);
    }

    if (query.location) {
      console.log("LOCATION QUERY", query.location as string);
      setLocation({
        ...location,
        city: query.location as string,
      });
    }
  }, [pathname, query.location, query.date]);
  useEffect(() => {
    if (session && session.user) {
      const user: userI = session.user;
      get(`/api/organizer/followed/${user.id}`).then((res) => {
        if (res.status === 200) {
          console.log({ follwed_organizers: res.data });
          setFollowedOrganizers(res.data);
        }
      });
    }
  }, [session]);
  useEffect(() => {
    const location = localStorage.getItem("location");

    console.log("LOCATION", location);
    if (!location) {
      console.log("DONT HAVE LOCATION");
      getUserLocation();
    } else {
      setLocation(JSON.parse(location));
    }

    getCountryCititesThatHaveEvents();
  }, []);

  return (
    <EventsContext.Provider
      value={{
        events,
        setEvents,
        eventsCategory,
        setEventsCategory,
        date_filter,
        setDateFilter,
        followEvents,
        followEventsIds,
        location,
        setLocation,
        showClearFilter,
        toggleClearFilter,
        clearLocation,
        setFollowedEventsIds,
        availableCities,
        followEvent,
        followedOrganizers,
        setFollowedOrganizers,
        user_notifications,
        setUserNotifications,
        supabase,
        handleCategoryPageNavigation,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export function useEvents() {
  return useContext(EventsContext);
}
