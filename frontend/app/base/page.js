import Header from "../../componentes/header";
import Footer from "../../componentes/footer";

export default function Acerca() {
  return (
    <div className="content">
      <Header />

      <main className="list">
        <div className="site-description"></div>

        <h2>Esta es la pagina de la base de datos!</h2>


      </main>

      <hr className="halloween-hr" style={{ width: '100%' }} />

      <Footer />
    </div>
  );
}
