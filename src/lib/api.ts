import {
  useSanityClient,
  groq,
  createImageBuilder,
  SanityClientLike,
} from "astro-sanity";

interface ImageStyle {
  style: string;
  tailwindClasses: string;
}



async function getFirstBlogPost() {
  const query = groq`*[_type == "post"]{
    ...,
    "author": author->,
    "imageUrl": mainImage.asset->url,
    "imageUrls": body[_type == "image"].asset->url,
    "categories": categories[]->,
    "relatedPosts": relatedPosts[]->{_id, title, "imageUrl": mainImage.asset->url, "slug": slug.current},
  }`;
  const firstPost = await (useSanityClient() as SanityClientLike).fetch(query);
  return firstPost;
}

const imageUrlBuilder = createImageBuilder(
  useSanityClient() as SanityClientLike
);

function UrlForImage(source: string) {
  return imageUrlBuilder.image(source);
}

export {getFirstBlogPost, imageUrlBuilder, UrlForImage};
