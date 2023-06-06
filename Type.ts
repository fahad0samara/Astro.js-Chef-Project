export type PostProps = {
  
  title: string;
  author: {
    image: string;
    name: string;
    bio: {
      children: {
        text: string;
      }[];
    }[];
  };
  publishedAt: string;
  mainImage: string;
  bio?: {
    text: string;
  };
  tags?: string[];
  body?: {
    _type: string;
    style: string;
    listItem?: string | undefined;
    children: {
      text: string;
    }[];
  }[];
  nutrition?: {
    calories: number;
    carbohydrates: number;
    fat: number;
    protein: number;
  };
};
