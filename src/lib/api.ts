import {useSanityClient, groq} from "astro-sanity";
import imageUrlBuilder from "@sanity/image-url";
async function getFirstBlogPost() {
  const query = groq`*[_type == "post"]{
    ...,
    "author": author->,
    "bodyText": body[0].children[0].text,

     "imageUrls": body[_type == "image"].asset->url
  }`;
  const firstPost = await useSanityClient().fetch(query);
  return firstPost;
}


export {getFirstBlogPost, imageUrlBuilder};
