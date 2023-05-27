import {
  useSanityClient,
  groq,
  createImageBuilder,
  portableTextToHtml,
  SanityClientLike,
} from "astro-sanity";

interface ImageStyle {
  style: string;
  tailwindClasses: string;
}

interface CustomComponents {
  types: {
    image: (props: {value: string}) => string;
  };
  block: {
    h1: (props: {children: string}) => string;
    h2: (props: {children: string}) => string;
    h3: (props: {children: string}) => string;
    h4: (props: {children: string}) => string;
    h5: (props: {children: string}) => string;
    h6: (props: {children: string}) => string;
    p: (props: {children: string}) => string;
    a: (props: {children: string; href: string}) => string;
    pre: (props: {children: string}) => string;
    code: (props: {language: string; code: string}) => string;
    inlineCode: (props: {code: string}) => string;
    blockquote: (props: {children: string}) => string;
    hr: () => string;
  };
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

const customComponents: CustomComponents = {
  types: {
    image: ({value}) => {
      const imageStyles: ImageStyle[] = [
        {
          style: `
            max-width: 100%;
            margin-bottom: 1rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          `,
          tailwindClasses: `
            mb-4
            border-2
            border-gray-300
            rounded-lg
            shadow-md
          `,
        },
        {
          style: `
            max-width: 100%;
            margin-bottom: 1rem;
            border: 2px dashed #999;
            border-radius: 4px;
            box-shadow: none;
          `,
          tailwindClasses: `
            mb-2
            border-2
            border-dashed
            border-gray-400
            rounded
          `,
        },
        {
          style: `
            max-width: 100%;
            margin-bottom: 1rem;
            border: none;
            border-radius: 0;
            box-shadow: none;
          `,
          tailwindClasses: `
            mb-8
          `,
        },
      ];

      const currentStyle =
        imageStyles[Math.floor(Math.random() * imageStyles.length)];

      const className = `custom-image-${Math.floor(Math.random() * 1000)}`;
      const styleTag = `<style>.${className} { ${currentStyle.style} }</style>`;

      return `${styleTag}<img src="${UrlForImage(
        value
      ).url()}" class="${className} ${currentStyle.tailwindClasses}" />`;
    },
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

function sanityPortableText(portabletext: any) {
  return portableTextToHtml(portabletext, customComponents);
}

export {getFirstBlogPost, imageUrlBuilder, UrlForImage, sanityPortableText};
