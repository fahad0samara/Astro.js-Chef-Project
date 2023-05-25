import {useSanityClient, groq} from "astro-sanity";
import imageUrlBuilder from "@sanity/image-url";
async function getFirstBlogPost() {
  const query = groq`*[_type == "post"]{
    ...,
    "author": author->,
    "imageUrl": mainImage.asset->url
    
  }`;
  const firstPost = await useSanityClient().fetch(query);
  return firstPost;
}

export {getFirstBlogPost, imageUrlBuilder};
