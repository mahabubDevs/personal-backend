export interface IBlog {
    _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  publishedAt: Date;
  readTime: string;
  tags: string[];
}
