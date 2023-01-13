import styles from "../../styles/Slug.module.scss";
import { GraphQLClient, gql } from "graphql-request";
import Image from "next/image";
import { useRouter } from "next/router";
import moment from "moment";
import Head from "next/head";
import { IoCaretBack, IoLogoGithub } from "react-icons/io5";
import { TbLetterV } from "react-icons/tb";

const graphcms = new GraphQLClient(process.env.GRAPH_CONTENT_API_ENDPOINT);

const QUERY = gql`
  query Post($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      publishDate
      author {
        id
        name
        avatar {
          url
        }
      }
      content {
        html
      }
      coverPhoto {
        id
        url
      }
    }
  }
`;
const slugList = gql`
  {
    posts {
      slug
    }
  }
`;

export async function getStaticPaths() {
  const { posts } = await graphcms.request(slugList);
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const slug = params.slug;
  const data = await graphcms.request(QUERY, { slug });
  const post = data.post;
  return {
    props: {
      post,
    },
    revalidate: 30,
  };
}

export default function BlogPost({ post }) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <main className={styles.blog}>
        <div className={styles.toolBar}>
          <IoCaretBack
            size="3em"
            onClick={() => router.back()}
            className={styles.btn}
          />
          <a href="https://github.com/cr1spyvada/QuicBlog">
            <IoLogoGithub size="2.5em" className={styles.btn} />
          </a>
          <a href="https://vaisakhnp.vercel.app">
            <TbLetterV size="2.5em" className={styles.btn} />
          </a>
        </div>
        <div className={styles.coverPhoto}>
          <Image layout="fill" src={post.coverPhoto.url} alt={post.title} />
        </div>
        <div className={styles.title}>
          <div className={styles.authorDetails}>
            <div className={styles.thumbnail}>
              <Image
                layout="fill"
                src={post.author.avatar.url}
                alt={post.author.name}
              />
            </div>
            <div className={styles.authorHeader}>
              <div className={styles.date}>
                By <span style={{ fontWeight: "500" }}>{post.author.name}</span>
              </div>
              <div className={styles.date}>
                {moment(post.datePublished).format("MMMM d, YYYY")}
              </div>
            </div>
          </div>
          <h2>{post.title}</h2>
        </div>

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content.html }}
        ></div>
      </main>
    </>
  );
}
