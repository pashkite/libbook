export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  coverImage?: string;
  imageUrl?: string;
  callNumber: string;
  acquisitionDate: string;
  library: string;
  status: 'available' | 'checked_out';
  dueDate?: string;
  popularity?: number;
}
