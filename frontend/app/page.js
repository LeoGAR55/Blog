import Image from "next/image";
import Header from "../componentes/header";
import Footer from "../componentes/footer";

// obtiene las ultimas entradas del blog
async function getUltimosPosts(limit = 5) {
  const res = await fetch(`http://localhost:5000/api/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("error al obtener posts:", res.status);
    return [];
  }
  const posts = await res.json();
  return posts.slice(0, limit); // solo las primeras n entradas definidas en limit
}

export default async function Home() {
  const posts = await getUltimosPosts();
  return (
    <div className="content">
      <Header />

      <main className="list">
        <div className="site-description"></div>
        <h2>Hola!</h2>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores
          doloremque deleniti dignissimos accusamus porro reiciendis, sunt ut
          maxime facere! Perferendis incidunt ab nisi qui mollitia nihil
          exercitationem aspernatur ea quas.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
          odio esse adipisci animi repellendus quisquam. Quia vel magnam nisi
          dolorem similique vitae maxime assumenda dolorum earum beatae, rerum
          atque quasi!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          <br />
          Aliquid animi ea dolor itaque ullam quod perspiciatis dignissimos
          ipsa, molestiae error veritatis minima aliquam id iure totam at, eius
          temporibus adipisci.
        </p>
        <h2>Últimas entradas del blog</h2>

        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <a href={`/blogs/${post.slug}`}>{post.titulo}</a>
            </li>
          ))}
        </ul>

        <div style={{ paddingTop: "25px" }} className="homepage-head">
          <Image src="/yo.jpg" width={220} height={280} alt="Foto de Leo" />
        </div>
        <h2>Categorías (no implementado)</h2>
        <a href="">Algo</a> |
      </main>

      <hr className="halloween-hr" style={{ width: "100%" }} />

      <Footer />
    </div>
  );
}
