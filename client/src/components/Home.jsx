import { useEffect, useRef, useState } from 'react';

export function SearchBar({ valorInicial = '', onBuscar, onFocus, onBlur }) {
    const [texto, setTexto] = useState(valorInicial);

    const handleSubmit = (e) => {
        e.preventDefault();
        onBuscar?.(texto.trim());
    };

    return (
        <form className="SearchBar" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Buscar productos, marcas y más..."
                className="SearchBar-input"
                onFocus={onFocus}
                onBlur={onBlur}
                value={texto}
                minLength={2}
                maxLength={200}
                onChange={(e) => setTexto(e.target.value)}
            />
            <button type="submit" className="SearchBar-button">
                Buscar
            </button>
        </form>
    );
}

export function Home({ bg, setBg, backgrounds, setPage, onBuscar }) {
    const intervalRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const resetInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        if (!isFocused) {
            intervalRef.current = setInterval(() => {
                setBg((prev) =>
                    prev === backgrounds.length - 1 ? 0 : prev + 1,
                );
            }, 8000);
        }
    };

    /*
    const handleNext = () => {
        setBg((prev) => (prev === backgrounds.length - 1 ? 0 : prev + 1));
        resetInterval();
    };

    const handlePrev = () => {
        setBg((prev) => (prev === 0 ? backgrounds.length - 1 : prev - 1));
        resetInterval();
    }; */

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
    });

    return (
        <section
            className="Home"
            style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), ${backgrounds[bg].color}`,
            }}
        >
            <div
                className="Welcome"
                key={bg}
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${backgrounds[bg].url})`,
                    width: '100dvw',
                }}
            >
                <h2>Todos Tus Productos Al Mejor Precio</h2>
                <h3>
                    {backgrounds.map((item) => {
                        if (item.id === bg) {
                            return backgrounds[bg].subtittle;
                        }
                    })}
                </h3>

                <SearchBar
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onBuscar={onBuscar}
                />

                <div className="Buttons-welcome">
                    <button onClick={() => setPage('catalog')}>
                        Ver Catalogo
                    </button>
                </div>
                <div
                    className="Creators"
                    style={{
                        width: '100dvw',
                        height: '20px',
                        textAlign: 'center',
                        background: '#00000088',
                    }}
                >
                    <p>
                        Desarrollado por{' '}
                        <a href="https://github.com/kiwig0dd" target="blank">
                            Jose Godoy
                        </a>
                        ,{' '}
                        <a href="https://github.com/Nelsoon056" target="blank">
                            Nelson Sandoval
                        </a>
                        ,{' '}
                        <a
                            href="https://github.com/Matheusc4-2007"
                            target="blank"
                        >
                            Sergio Cuevas
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
