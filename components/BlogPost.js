import Link from "next/link";
import Image from "next/image";
import styles from "../styles/BlogPost.module.css";
import moment from "moment";

function BlogPost({ title, author, coverPhoto, datePublished, slug }) {
  return (
    <Link href={"/posts/" + slug}>
      <div className={styles.card}>
        <div className={styles.imgContainer}>
          <Image layout="fill" src={coverPhoto.url} alt="" />
        </div>
        <div className={styles.text}>
          <h2>{title}</h2>
          <div className={styles.details}>
            <div className={styles.author}>
              <div className={styles.avatar}>
                <Image
                  layout="fill"
                  src={author.avatar?.url}
                  alt={author.name}
                />
              </div>
              <h3>{author.name}</h3>
            </div>
            <div className={styles.date}>
              <h3>{moment(datePublished).format("MMMM d, YYYY")}</h3>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

{
  /* <div dangerouslySetInnerHTML={{ __html: content.html }}></div> */
}
export default BlogPost;
