import elisaLogo from './assets/logowebelisa.svg'
import './App.css'

function App() {

  return (
    <>
      <header>
        <img className='elisalogo' src={elisaLogo} alt="Elisa Logo" />
        <h1 className='elisatitle'>ELISA</h1>
        <nav>
          <ul>
            <li>Inicio</li>
            <li>Galeria</li>
            <li>Agendar Cita</li>
            <li>Iniciar Sesión</li>
            <li>Registrarse</li>
          </ul>
        </nav>
      </header>
    </>
  )
}

export default App
