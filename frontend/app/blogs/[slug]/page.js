import Header from "../../../componentes/header";
import Footer from "../../../componentes/footer";

async function getPost(slug) {
  const res = await fetch(`http://localhost:5000/api/posts/${slug}`, { //hacer una solicitud al backend (express)
    cache: "no-store", // no guardar en cache`para que cada solicitud sea nueva y jale la info actualizada
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

// usario hace la peticion de entrar a algo en /blog/algo, entonces next usa blogpost para llamar a getpost con el slug que le pasamos y getpost hace la peticion al backend
export default async function BlogPost({ params }) {
  // ruteo dinamico, va a recibir el slug
  const { slug } = await params; // segun node params debe ser awaiteado antes de usar sus propiedades porque es una promesa https://nextjs.org/docs/messages/sync-dynamic-apis

  const post = await getPost(slug);

  if (!post) {
    return <h1>Post no encontrado</h1>;
  }

  return (
    <div className="content">
      <Header />
      <main className="blog-post">
        <h2>{post.titulo}</h2>
        <p>
          <i>{new Date(post.fecha).toLocaleDateString()}</i>
        </p>
        <p>{post.contenido}</p>
      </main>
      <Footer />
    </div>
  );
}
