import { Link } from "react-router"

function Nav() {
  return (
    <div className="bg-gradient-to-b from-bg to-transparent w-screen flex items-center justify-between p-6 fixed top-0">
        <Link to="/" className="flex items-center justify-center gap-2">
            <img src="/icon.png" alt="Onyx" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-ink">Onyx</h1>
        </Link>
        <div className="flex items-center justify-center gap-8 text-sm font-medium">
            <Link to="/docs" className="text-ink hover:text-muted transition-colors duration-300">Documentation</Link>
            <a href="https://github.com/siddpeng/onyx" target="_blank" className="text-ink hover:text-muted transition-colors duration-300">GitHub</a>
            <a href="https://chromewebstore.google.com" target="_blank" className="text-ink hover:text-muted transition-colors duration-300">Download</a>
        </div>
    </div>
  )
}

export default Nav