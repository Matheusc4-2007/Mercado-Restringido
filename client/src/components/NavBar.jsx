import Logo from '../assets/Logo_Shop.svg'
import { esAdmin } from '../utils/admin';

export function ButtonNav({text, page, setPage, direction}) {
  const isActive = page == direction;

  return <button 
  className={isActive ? "ButtonNav-active" : "ButtonNav"} 
  onClick={() => setPage(direction)}>
    {text}
  </button>
}

export function NavBar ({page, setPage, usuario , onLogout}) {
  return (
  <nav className="NavBar">
    <div className="NavBar-brand">
      <img src={Logo} className="Logo"/>
      <h1>Name Placeholder</h1>
    </div>
    <div className="NavBar-links">
      <span className='NavSeparator'></span>
      <ButtonNav text="Home" page={page} setPage={setPage} direction="home"/>
      <span className='NavSeparator'></span>
      <ButtonNav text="Catalogo" page={page} setPage={setPage} direction="catalog"/>
      <span className='NavSeparator'></span>
      <ButtonNav text="Carrito" page={page} setPage={setPage} direction="cart"/>
      <span className='NavSeparator'></span>
      {esAdmin(usuario) && (
        <>
          <ButtonNav text="Administrar" page={page} setPage={setPage} direction="admin"/>
          <span className='NavSeparator'></span>
        </>
      )}
      {usuario ? (
        <>
          <span className="NavUser">Hola, {usuario.nombre}</span>
          <span className='NavSeparator'></span>
          <button className="ButtonNav" onClick={onLogout}>Cerrar Sesion</button>
        </>
      ) : (
        <ButtonNav text="Iniciar Sesion" page={page} setPage={setPage} direction="login"/>
      )}
    </div>
  </nav>
  )
}