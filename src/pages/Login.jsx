import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from?.pathname || '/patient'
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    // Front-only : on “simule” l’auth.
    login({ email })
    nav(from, { replace: true })
  }

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="max-w-md mx-auto card">
          <h2 className="h2 text-center">Connexion</h2>
          <form onSubmit={onSubmit} className="mt-6 grid gap-3">
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email"
                   className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
            <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Mot de passe"
                   className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
            <button className="btn w-full">Se connecter</button>
          </form>
          <p className="mt-4 text-sm text-zinc-600 text-center">
            Pas de compte ? <Link className="text-brand-600" to="/inscription">Créer un compte</Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  )
}
