import Header from "../../../componentes/header";
import Footer from "../../../componentes/footer";

async function getPost(slug) {
  const res = await fetch(`http://localhost:5000/api/posts/${slug}`, {
    cache: "no-store", // no guardar en cache
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function BlogPost({ params }) {
  const { slug } = params;

  const post = await getPost(slug);

  if (!post) {
    return <h1>Post no encontrado</h1>;
  }

  return (
    <div className="content">
      <Header />
      <main className="blog-post">
        <h2>{post.titulo}</h2>
        <p><i>{new Date(post.fecha).toLocaleDateString()}</i></p>
        <p>{post.contenido}</p>
      </main>
      <Footer />
    </div>
  );
}
