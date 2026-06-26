export interface DayHours {
  open: string | null;
  close: string | null;
}

export type WeekHours = {
  mon: DayHours;
  tue: DayHours;
  wed: DayHours;
  thu: DayHours;
  fri: DayHours;
  sat: DayHours;
  sun: DayHours;
};

export interface Cafe {
  id: string;
  name: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  lat: number;
  lng: number;
  phone: string | null;
  website: string | null;
  hours: WeekHours | null;
  photo_url: string | null;
  allpress_verified: boolean;
  notes: string | null;
}
