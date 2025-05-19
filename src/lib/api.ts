import { $axios } from "@/lib/utils";
import { CATEGORIES_DICT } from "@/lib/variables";

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export async function getEventData(category: string, postId: string) {
  const response = await $axios.get(
    `${process.env.SERVER_ADDRESS}api/events/${postId}`
  );

  if (response.status === 404) {
    return {
      redirect: {
        destination: "/404/",
        statusCode: 301,
      },
    };
  }

  if (response.status === 500) {
    throw new Error("Internal server error");
  }

  const data = response.data;

  let SchemaMarkup;
  if (data) {
    const { status, data: search_result } = await $axios.get(
      `/api/search-location-by-place-id?full_results=true&place_id=` +
        data.place_id
    );

    let address_components;

    if (status === 200 && search_result && search_result.data) {
      address_components = search_result.data.result.address_components;
    }

    SchemaMarkup = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: data.title,
      description: data.description,
      category: CATEGORIES_DICT[data.category],
      startDate: data.date,
      image: `https://encoro.app/cdn-cgi/image/quality=85,format=webp/${
        data.media[0].split("aws.com/")[1]
      }?format=webp&width=800`,
      location: {
        "@type": "Place",
        name: "Event Location Name",
        address: {
          "@type": "PostalAddress",
          streetAddress: [
            address_components?.find(
              (component: { types: string | string[] }) =>
                component.types.includes("street_number")
            )?.long_name || "",
            address_components?.find(
              (component: { types: string | string[] }) =>
                component.types.includes("route")
            )?.long_name || "",
          ].join(" "),
          addressLocality:
            address_components?.find(
              (component: { types: string | string[] }) =>
                component.types.includes("locality")
            )?.long_name || "",
          addressRegion:
            address_components?.find(
              (component: { types: string | string[] }) =>
                component.types.includes("administrative_area_level_2")
            )?.long_name || "",
          postalCode:
            address_components?.find(
              (component: { types: string | string[] }) =>
                component.types.includes("postal_code")
            )?.long_name || "",
          addressCountry:
            address_components?.find(
              (component: { types: string | string[] }) =>
                component.types.includes("country")
            )?.long_name || "",
        },
      },
      organizer: {
        "@type": "Person",
        name: data.business_profile.business_name || "",
        description: data.business_profile.biography || "",
      },
    };
  }

  return { event: data, schemaMarkup: SchemaMarkup };
} 