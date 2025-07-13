export const All_PLACES = "Todo el pais";

export const NOTIFICATION_TYPES = {
  DISABLED: "DISABLED",
  NEW_EVENTS: "NEW_EVENTS",
  SYSTEM_NEWS: "SYSTEM_NEWS",
  UPDATED_EVENT: "UPDATED_EVENT",
  UPCOMING_EVENT: "UPCOMING_EVENT",
  IMMINENT_EVENT: "IMMINENT_EVENT",
  CANCELLED_EVENT: "CANCELLED_EVENT",
  HAPPENING_TODAY: "HAPENNING_TODAY",
};

const CATEGORIES = [
  { value: "all", label: "Todas las categorías" },
  { value: "music", label: "Música" },
  { value: "art", label: "Arte" },
  { value: "nightlife", label: "Vida nocturna" },
  { value: "gastronomy", label: "Gastronomía" },
  { value: "tourism", label: "Turismo" },
  { value: "wellness", label: "Bienestar" },
  { value: "education", label: "Educación y Conferencias" },
  { value: "entertainment", label: "Entretenimiento" },
  { value: "sports", label: "Deportes" },
];

const CATEGORIES_DICT: { [key: string]: string } = {
  music: "Música",
  art: "Arte",
  nightlife: "Vida Nocturna",
  gastronomy: "Gastronomía",
  tourism: "Turismo",
  sports: "Deportes",
  education: "Educación y Conferencias",
  entertainment: "Entretenimiento",
  wellness: "Bienestar",
};

const ROLES = ["SUPERUSER", "ADMIN", "COLLABORATOR"];

const BUSINESS_ILUSTRATIONS = [`businessman`];

export { CATEGORIES, CATEGORIES_DICT, ROLES, BUSINESS_ILUSTRATIONS };
