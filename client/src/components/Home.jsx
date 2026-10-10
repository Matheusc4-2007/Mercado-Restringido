export function SearchBar () {
  return (
    <form className="SearchBar" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Buscar productos, marcas y más..."
            className="SearchBar-input"
          />
          <button type="submit" className="SearchBar-button">
            Buscar
          </button>
        </form>
  )
}

export function Home({bg, setBg, backgrounds, page, setPage}) {
  
  const handleNext = () => {
    setBg((prev) => (prev === backgrounds.length - 1 ? 0 : prev + 1));
  }

  const handlePrev = () => {
    setBg((prev) => (prev === 0 ? backgrounds.length - 1 : prev - 1));
  }

  return (
    <section className="Home">
      <button className="Arrow" onClick={handlePrev}>{"<"}</button>
      <div className="Welcome" key={bg}
      style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${backgrounds[bg].url})`}}>
        <h2>Todos Tus Productos Al Mejor Precio</h2>
        <h3>{backgrounds.map((item) => {
          if (item.id === bg) {
            return backgrounds[bg].subtittle
          }
        })}</h3>
        <SearchBar/>
        <div className="Buttons-welcome">
          <button onClick={() => setPage("catalog")}>Ver Catalogo</button>
          <button onClick={() => setPage("login")}>Iniciar Sesion</button>
        </div>
        <p className="Creators">
          Desarrollado por <a href="https://github.com/kiwig0dd" target="blank">Jose Godoy</a>, <a href="https://github.com/Nelsoon056" target="blank">Nelson Sandoval</a>, <a href="https://github.com/Matheusc4-2007" target="blank">Sergio Cuevas</a>
        </p>
      </div>
      <button className="Arrow" onClick={handleNext}>{">"}</button>
    </section>
  );
}
