export interface Event {
  id: string;
  title: string;
  previewImageUrl: string;
  partnersImageUrl?: string;
  description: string;
  eventDate: Date;
  location?: string;
  urlToPlatform?: string;
}
