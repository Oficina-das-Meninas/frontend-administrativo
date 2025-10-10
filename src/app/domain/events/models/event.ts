export interface Event {
  id: string;
  title: string;
  previewImageUrl: string;
  description: string;
  eventDate: Date;
  location?: string;
  urlToPlatform?: string;
}
