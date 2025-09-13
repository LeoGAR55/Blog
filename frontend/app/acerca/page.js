import Image from "next/image";
import Header from "../../componentes/header";
import Footer from "../../componentes/footer";

export default function Acerca() {
  return (
    <div className="content">
      <Header />

      <main className="list">
        <div className="site-description"></div>

        <h2>Esta es la pagina de acerca de mi!</h2>

        <div style={{ paddingTop: '25px' }} className="homepage-head">
          <Image src="/balrog.jpg" width={550} height={690}  alt="alt para que no chille"/>
        </div>

      </main>

      <hr className="halloween-hr" style={{ width: '100%' }} />

      <Footer />
    </div>
  );
}
