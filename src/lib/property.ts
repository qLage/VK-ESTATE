export const PLACEHOLDER_IMAGE = "/placeholder-property.svg";

export const CATEGORY_META: Record<string, { tag: string; unit: string; roomsLabel: string }> = {
  newbuilding: { tag: "Новостройка", unit: "м²", roomsLabel: "Комнаты" },
  secondary: { tag: "Вторичка", unit: "м²", roomsLabel: "Комнаты" },
  apartment_sell: { tag: "Квартира", unit: "м²", roomsLabel: "Комнаты" },
  apartment_rent: { tag: "Квартира", unit: "м²", roomsLabel: "Комнаты" },
  house: { tag: "Дом", unit: "м²", roomsLabel: "Комнаты" },
  land: { tag: "Участок", unit: "соток", roomsLabel: "Площадь" },
  commercial: { tag: "Коммерция", unit: "м²", roomsLabel: "Помещения" },
  commercial_rent: { tag: "Коммерция", unit: "м²", roomsLabel: "Помещения" },
  rent: { tag: "Аренда", unit: "м²", roomsLabel: "Комнаты" },
};

export const FILTER_CATEGORIES = [
  { key: "all", label: "Все", api: undefined },
  { key: "apartment_sell", label: "Квартиры", api: "apartment_sell" },
  { key: "house", label: "Дома", api: "house" },
  { key: "apartment_rent", label: "Аренда", api: "apartment_rent" },
  { key: "commercial", label: "Коммерция", api: "commercial_rent" },
  { key: "land", label: "Участки", api: "land" },
] as const;

const CATEGORY_ALIASES: Record<string, string> = {
  квартира: "apartment_sell",
  квартиры: "apartment_sell",
  новостройка: "newbuilding",
  новостройки: "newbuilding",
  дом: "house",
  дома: "house",
  коттедж: "house",
  коттеджи: "house",
  участок: "land",
  участки: "land",
  коммерческая: "commercial",
  коммерция: "commercial",
  аренда: "apartment_rent",
};

export function normalizeCategory(category: string | null | undefined): string {
  const value = (category || "").trim().toLowerCase();
  return CATEGORY_ALIASES[value] || value;
}

export function toApiCategory(category: string | null | undefined): string | undefined {
  if (!category || category === "all") return undefined;
  const filter = FILTER_CATEGORIES.find((item) => item.key === category);
  if (filter?.api) return filter.api;
  return category;
}

export function getCategoryMeta(category: string | null | undefined) {
  const key = normalizeCategory(category);
  return CATEGORY_META[key] || CATEGORY_META.secondary;
}

export function propertyArea(property: {
  category: string;
  areaTotal?: number | null;
  landArea?: number | null;
}): number | null {
  return normalizeCategory(property.category) === "land"
    ? property.landArea ?? null
    : property.areaTotal ?? null;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

export function formatPricePerMeter(price: number, area: number | null | undefined): string {
  if (!area) return "";
  return new Intl.NumberFormat("ru-RU").format(Math.round(price / area)) + " ₽/м²";
}

export function formatArea(area: number | null | undefined, category: string): string {
  if (!area) return "—";
  const rounded = Number.isInteger(area) ? String(area) : String(Math.round(area * 10) / 10);
  return `${rounded} ${getCategoryMeta(category).unit}`;
}

export function formatRooms(rooms: string | null | undefined, category: string): string {
  if (!rooms || normalizeCategory(category) === "land") return "—";
  if (rooms === "1") return "1 комн.";
  if (rooms === "2") return "2 комн.";
  if (rooms === "3") return "3 комн.";
  if (rooms === "4") return "4 комн.";
  if (rooms === "5") return "5 комн.";
  if (rooms === "6") return "6+ комн.";
  return rooms;
}

export function formatFloor(
  floor: number | null | undefined,
  floorsTotal: number | null | undefined,
  category: string,
): string {
  if (normalizeCategory(category) === "land") return "—";
  if (!floor || !floorsTotal) return "—";
  return `${floor}/${floorsTotal}`;
}

const RENOVATION_LABELS: Record<string, string> = {
  requires: "Требует ремонта",
  euro: "Евроремонт",
  cosmetic: "Косметический",
  designer: "Дизайнерский",
  good: "Хороший",
  excellent: "Отличный",
  none: "Без ремонта",
  rough: "Черновая отделка",
  finishing: "Чистовая отделка",
  capital: "Капитальный",
};

const HOUSE_TYPE_LABELS: Record<string, string> = {
  brick: "Кирпичный",
  monolith: "Монолитный",
  panel: "Панельный",
  block: "Блочный",
  "monolith-brick": "Монолитно-кирпичный",
  wood: "Деревянный",
  wooden: "Деревянный",
  frame: "Каркасный",
};

function formatCrmLabel(value: string | null | undefined, map: Record<string, string>): string | null {
  if (!value) return null;
  const key = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
  return map[key] || value;
}

export function formatRenovation(value: string | null | undefined): string | null {
  return formatCrmLabel(value, RENOVATION_LABELS);
}

export function formatHouseType(value: string | null | undefined): string | null {
  return formatCrmLabel(value, HOUSE_TYPE_LABELS);
}

export function makeTitle(
  area: number | null | undefined,
  rooms: string | null | undefined,
  category: string,
): string {
  const meta = getCategoryMeta(category);
  if (normalizeCategory(category) === "land") {
    return `${meta.tag}, ${formatArea(area, category)}`;
  }
  const roomsStr = formatRooms(rooms, category);
  const areaStr = formatArea(area, category);
  if (roomsStr === "—") return `${meta.tag}, ${areaStr}`;
  return `${roomsStr}, ${areaStr}`;
}
