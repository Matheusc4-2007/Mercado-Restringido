export function SearchBar ({ onFocus, onBlur }) {
  return (
    <form className="SearchBar" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Buscar productos, marcas y más..."
        className="SearchBar-input"
        onFocus={onFocus}
        onBlur={onBlur} 
      />
      <button type="submit" className="SearchBar-button">
        Buscar
      </button>
    </form>
  )
}

import { useEffect, useRef, useState } from 'react';

export function Home({bg, setBg, backgrounds, page, setPage}) {
  const intervalRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (!isFocused) {
      intervalRef.current = setInterval(() => {
        setBg((prev) => (prev === backgrounds.length - 1 ? 0 : prev + 1));
      }, 8000);
    }
  };

  const handleNext = () => {
    setBg((prev) => (prev === backgrounds.length - 1 ? 0 : prev + 1));
    resetInterval();
  }

  const handlePrev = () => {
    setBg((prev) => (prev === 0 ? backgrounds.length - 1 : prev - 1));
    resetInterval();
  }

  useEffect(() => {
    if (isFocused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      resetInterval();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isFocused]);

  return (
    <section className="Home"
    style={{background: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), ${backgrounds[bg].color}`}}>
      <button className="Arrow" onClick={handlePrev}>{"<"}</button>
      <div className="Welcome" key={bg}
      style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${backgrounds[bg].url})`}}>
        <h2>Todos Tus Productos Al Mejor Precio</h2>
        <h3>{backgrounds.map((item) => {
          if (item.id === bg) {
            return backgrounds[bg].subtittle
          }
        })}</h3>
        
        <SearchBar 
          onFocus={() => setIsFocused(true)} 
          onBlur={() => setIsFocused(false)} 
        />

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