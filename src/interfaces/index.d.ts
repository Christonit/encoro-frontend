export interface IMediaToUpload {
  mainMedia: File;
  secondaryMedia?: File[] | [];
}

export interface userI {
  name?: string | null | undefined;
  id?: string | null | undefined;
  email?: string | null | undefined;
  phone_number?: string | null | undefined;
  social_networks?: string | null | undefined | socialNetworksI;
  image?: string | null | undefined;
  business_picture?: string | null | undefined;
  [key: string]: any;
}
export interface eventI {
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  fee?: string;
  time?: string;
  entrance_format?: string;
  ticket_link?: string;
  direction?: string;
  city?: string;
  place_id?: string;
  hashtags?: string[];
  media?: string[];
  secondary_category?: string | null;
  id?: string;
}
export interface eventModelI {
  id: string;
  direction: string;
  city: string;
  place_id: string;
  category: string;
  secondary_category?: string | null;
  title: string;
  date: string;
  time: string;
  description: string;
  entrance_format: string;
  fee: number;
  creator: string;
  social_networks?: string[] | null;
  published_in_ig: boolean;
  hashtags?: string[];
  media?: string[];
  is_active?: boolean;
}

export interface AutoCompleteI {
  direction: string;
  place_id: string;
  address_terms: string[];
  city_id?: string;
  city?: string;
}

export interface socialNetworksI {
  website?: string;
  facebook?: string;
  whatsapp?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

export type NotificationType = "success" | "warning" | "error";

export type statusMessageType = {
  show: boolean;
  type: NotificationType | null;
  message: { title?: string; body?: string };
};

export type GooglePlacesResponseType = {
  id: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  name: string;
  types?: string[];
  terms?: string[];
};

export type ListOfCititesType = {
  city: string;
  city_id: string;
  event_count?: number;
};

export interface followedProfileI {
  name: string;
  id: string;
  username: string;
  business_picture: string;
  location: string;
  events?: eventI[];
}

export type UserNotificationType = {
  id: string;
  seen: boolean;
  type: string;
  receiver: {
    name: string;
  };
  organizer: {
    username: string;
    name: string;
  };
  event?: {
    id: string;
    title: string;
    date: string; // Using string to represent ISO 8601 datetime format
    category: "music"; // Enumerated type if 'category' has fixed set of values
  };
  created_at: string;
};

export type EventSearchResultType = {
  title: string;
  media: string[] | string;
  date: string;
  category: string;
  time: string;
  id: string;
};

export type BusinessProfileType = {
  business_name: string;
  biography?: string;
  contact_email?: string;
  business_picture: string;
  username: string;
  id: string;
  location?: string;
  schedule?: {
    start_day: string;
    end_day: string;
    time: string;
    time_obj: string[];
  }[];
  social_networks: socialNetworksI;
};

export type EventStandardCardI = {
  title: string;
  category: string;
  direction?: string;
  time: string;
  image: string;
  id: string;
  date?: string;
  loggedUser?: string;
  isFollowed?: boolean;
  canFollow?: boolean;
  displayDate?: boolean;
  displayTime?: boolean;
  unfollowAction?: () => void;
  onFollowAction?: () => void;
};
