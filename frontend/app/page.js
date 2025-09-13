import Image from "next/image";
import Header from "../componentes/header";
import Footer from "../componentes/footer";

export default function Home() {
  return (
    <div className="content">
      <Header />

      <main className="list">
        <div className="site-description"></div>

        <h2>Hola!</h2>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores doloremque
          deleniti dignissimos accusamus porro reiciendis, sunt ut maxime facere! Perferendis
          incidunt ab nisi qui mollitia nihil exercitationem aspernatur ea quas.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae odio esse adipisci
          animi repellendus quisquam. Quia vel magnam nisi dolorem similique vitae maxime
          assumenda dolorum earum beatae, rerum atque quasi!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          <br />
          Aliquid animi ea dolor itaque ullam quod perspiciatis dignissimos ipsa,
          molestiae error veritatis minima aliquam id iure totam at, eius temporibus adipisci.
        </p>

        <h2>Últimas entradas del blog</h2>
        <ul>
          <li><a href="">Mi blog de un farmbot</a></li>
          <li><a href="">La mejor canción de Billy Idol</a></li>
          <li><a href="">Como piratear spotify y usar soulseek</a></li>
          <li><a href="">Top 1 peliculas de HotWheels</a></li>
          <li><a href="">Mi post de carpintería</a></li>
          <li><a href="">Aquí va el título de la entrada de algún blog</a></li>
        </ul>

        <div style={{ paddingTop: '25px' }} className="homepage-head">
          <Image src="/yo.jpg" width={220} height={280} alt="Foto de Leo" />
        </div>

        <h2>Categorías (no implementado)</h2>
        <a href="">Algo</a> |
      </main>

      <hr className="halloween-hr" style={{ width: '100%' }} />

      <Footer />
    </div>
  );
}
