import type { GatsbyConfig } from "gatsby";
import path from "path";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Avax Trees`,
    description: `Plant a tree with a minimum of 0.1 AVAX, earn 8% daily returns.
      This is a complete ecosystem.`,
    siteUrl: `https://avaxtrees.finance`,
  },
  plugins: [
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "Google_ID",
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      //@ts-ignore
      __key: "images",
    },
    {
      resolve: "gatsby-plugin-layout",
      options: {
        component: path.resolve("./src/components/AppWrapper.tsx"),
      },
    },
    {
      resolve: "gatsby-plugin-nprogress",
      options: {
        color: "rgb(37, 99, 235)",
        showSpinner: false,
      },
    },
    "gatsby-plugin-netlify",
    "gatsby-plugin-no-sourcemaps",
  ],
};

export default config;
