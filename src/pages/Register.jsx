import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Register() {
  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="max-w-xl mx-auto card">
          <h2 className="h2">Inscription</h2>
          <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="Prénom" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-1" />
            <input type="text" placeholder="Nom" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-1" />
            <input type="email" placeholder="Email" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-2" />
            <input type="tel" placeholder="Téléphone" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-1" />
            <input type="password" placeholder="Mot de passe" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-1" />
            <button className="btn md:col-span-2">Créer mon compte</button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  )
}
