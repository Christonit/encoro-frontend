import dayjs from "dayjs";
import { $axios } from "@/lib/utils";
import { CATEGORIES_DICT } from "@/lib/variables";
import { GetServerSideProps } from "next";
import Head from "next/head";
import EventPageContent from "./_EventPageContent";

dayjs.locale("es-do");

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

async function getEventData(category: string, postId: string) {
  try {
    const response = await $axios.get(`/api/events/${postId}`);
    const event = response.data;

    if (!event || !event.category) {
      return { notFound: true };
    }

    // Validate category matches
    if (event.category !== category) {
      return { notFound: true };
    }

    let location = null;
    try {
      if (event.place_id) {
        const { data } = await $axios.get(`/api/locations/${event.place_id}`);
        location = data;
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      // Continue without location data
    }

    const schemaMarkup = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title || '',
      description: event.description || '',
      image: event.media && isJsonString(event.media)
        ? `https://encoro.app/cdn-cgi/image/quality=85,format=webp/${JSON.parse(
            event.media
          )[0]}`
        : null,
      startDate: event.date || '',
      endDate: event.date || '',
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: location ? {
        "@type": "Place",
        name: location.name || '',
        address: {
          "@type": "PostalAddress",
          streetAddress: location.address_components?.street_number
            ? `${location.address_components.street_number} ${location.address_components.route}`
            : location.address_components?.route || '',
          addressLocality: location.address_components?.locality || '',
          addressRegion: location.address_components?.administrative_area_level_1 || '',
          postalCode: location.address_components?.postal_code || '',
          addressCountry: location.address_components?.country || '',
        },
      } : null,
      organizer: event.business_profile ? {
        "@type": "Organization",
        name: event.business_profile.name || '',
        url: event.business_profile.username 
          ? `https://encoro.app/${event.business_profile.username}`
          : null,
      } : null,
      category: CATEGORIES_DICT[event.category] || '',
    };

    return { event, schemaMarkup };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { notFound: true };
    }
    throw error;
  }
}

interface EventPageProps {
  event: any;
  schemaMarkup: any;
}

export const getServerSideProps: GetServerSideProps<EventPageProps> = async (context) => {
  const { category, post } = context.params as { category: string; post: string };
  
  const result = await getEventData(category, post);
  
  if ('notFound' in result) {
    return { notFound: true };
  }

  return {
    props: {
      event: result.event,
      schemaMarkup: result.schemaMarkup,
    },
  };
};

export default function EventPage({ event, schemaMarkup }: EventPageProps) {
  return (
    <>
      <Head>
        <title>{event.title || 'Event'}</title>
        <meta name="description" content={event.description || 'Event details'} />
        <meta property="og:title" content={event.title || 'Event'} />
        <meta property="og:description" content={event.description || 'Event details'} />
        {event.media && isJsonString(event.media) && (
          <meta property="og:image" content={`https://encoro.app/cdn-cgi/image/quality=85,format=webp/${JSON.parse(event.media)[0]}`} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={event.title || 'Event'} />
        <meta name="twitter:description" content={event.description || 'Event details'} />
        {event.media && isJsonString(event.media) && (
          <meta name="twitter:image" content={`https://encoro.app/cdn-cgi/image/quality=85,format=webp/${JSON.parse(event.media)[0]}`} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </Head>
      <EventPageContent event={event} schemaMarkup={schemaMarkup} />
    </>
  );
}
