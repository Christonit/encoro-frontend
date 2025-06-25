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
  { value: "tourism", label: "Turismo" },
  { value: "sports", label: "Deportes" },
  { value: "theather", label: "Teatro" },
  { value: "nightlife", label: "Vida nocturna" },
  { value: "concerts", label: "Conciertos" },
  { value: "culture", label: "Cultura" },
  { value: "gastronomy", label: "Gastronomía" },
  { value: "bars", label: "Bares" },
  { value: "conferences", label: "Conferencias" },
  { value: "education", label: "Educación" },
  { value: "wellness", label: "Bienestar" },
];

const CATEGORIES_DICT: { [key: string]: string } = {
  music: "Música",
  art: "Arte",
  nightlife: "Vida Nocturna",
  concerts: "Conciertos",
  culture: "Cultura",
  gastronomy: "Gastronomía",
  bars: "Bares",
  conferences: "Conferencias",
  tourism: "Turismo",
  sports: "Deportes",
  theater: "Teatro",
  education: "Educación",
};

const ROLES = ["SUPERUSER", "ADMIN", "COLLABORATOR"];

const BUSINESS_ILUSTRATIONS = [`businessman`];

export { CATEGORIES, CATEGORIES_DICT, ROLES, BUSINESS_ILUSTRATIONS };
