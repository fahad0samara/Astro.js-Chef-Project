import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import sanity from 'astro-sanity'
import image from '@astrojs/image'

export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    sanity({
      projectId: 'rd0jbcna',
      dataset: 'production',
      useCdn: false,
      apiVersion: '2021-03-25' // use a UTC date string
    }),
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
    })
  ],
 routes: {
    "/blog/:slug": {
      template: "pages/blog.astro",
      getData: async ({ params }) => {
        // Fetch the data for the specific blog post using the slug
        const blogPost = await getBlogPostBySlug(params.slug);
        return {
          blogPost,
        };
      },
    },
  },
})
