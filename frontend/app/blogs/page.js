import Header from "../../componentes/header";
import Footer from "../../componentes/footer";

async function getPosts() {
  const res = await fetch("http://localhost:5000/api/posts", { //llamada al backend , en api/posts obtenemos todos los posts de la colleccion en la bd
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Blogs() {
  const posts = await getPosts(); //traer todos los posts del backend antes de renderizar la pagina
  // https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes
  return (
    <div className="content">
      <Header />

      <main className="list">
        <div className="site-description"></div>

        <h2>Todas las entradas del blog:</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <a href={`/blogs/${post.slug}`}>{post.titulo}</a>
              <span className="tab">{new Date(post.fecha).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </main>

      <hr className="halloween-hr" style={{ width: "100%" }} />

      <Footer />
    </div>
  );
}
