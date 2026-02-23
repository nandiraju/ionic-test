export interface Page {
  id: string;
  image: string; // base64 or blob URL
  order: number;
}

export interface Booklet {
  id: string;
  name: string;
  createdAt: string;
  pages: Page[];
}
