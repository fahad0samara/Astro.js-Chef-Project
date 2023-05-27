import {
  useSanityClient,
  groq,
  createImageBuilder,
  portableTextToHtml,
} from "astro-sanity";

async function getFirstBlogPost() {
  const query = groq`*[_type == "post"]{
    ...,
    "author": author->,
    "imageUrl": mainImage.asset->url,
         "imageUrls": body[_type == "image"].asset->url,
             "categories": categories[]->,
            "relatedPosts": relatedPosts[]->{_id, title, "imageUrl": mainImage.asset->url, "slug": slug.current},
         
    
  }`;
  const firstPost = await useSanityClient().fetch(query);
  return firstPost;
}
const imageUrlBuilder = createImageBuilder(useSanityClient());
function UrlForImage(source) {
  return imageUrlBuilder.image(source);
}
const customComponents = {
  types: {
    image: ({value}) =>
      `<img src="${UrlForImage(value).url()}" style="max-width:100%;" />`,
  },
  block: {
    h1: ({children}) =>
      `<h1 class="text-4xl font-bold my-4 text-yellow-500">${children}</h1>`,
    h2: ({children}) =>
      `<h2 class="text-3xl font-bold my-4 text-yellow-500">${children}</h2>`,
    h3: ({children}) =>
      `<h3 class="text-2xl font-bold my-4 text-yellow-500">${children}</h3>`,
    h4: ({children}) =>
      `<h4 class="text-xl font-bold my-4 text-yellow-500">${children}</h4>`,
    h5: ({children}) =>
      `<h5 class="text-lg font-bold my-4 text-yellow-500">${children}</h5>`,
    h6: ({children}) =>
      `<h6 class="text-base font-bold my-4 text-yellow-500">${children}</h6>`,
    p: ({children}) => `<p class="my-4 text-gray-700">${children}</p>`,
    a: ({children, href}) =>
      `<a href="${href}" class="text-blue-500 hover:underline">${children}</a>`,
    pre: ({children}) =>
      `<pre class="my-4 bg-gray-100 p-4 rounded">${children}</pre>`,
    code: ({language, code}) =>
      `<code class="bg-gray-100 p-2 rounded">${code}</code>`,
    inlineCode: ({code}) =>
      `<code class="bg-gray-100 p-1 rounded">${code}</code>`,
    blockquote: ({children}) =>
      `<blockquote class="border-l-4 pl-4 my-4 italic text-gray-600">${children}</blockquote>`,
    hr: () => `<hr class="my-4 border-gray-300" />`,
  },
};

function sanityPortableText(portabletext) {
  return portableTextToHtml(portabletext, customComponents);
}

export {getFirstBlogPost, imageUrlBuilder, UrlForImage, sanityPortableText};
