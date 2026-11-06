import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Info, Rat } from 'lucide-react';
import { backgrounds } from '../data/backgrounds';
import { useDebounce } from '../hooks/useDebounce';
import { irA, buscarEnCatalogo } from '../app/uiSlice';

export function SearchBar({
    valorInicial = '',
    onBuscar,
    onFocus,
    onBlur,
    delay = 800,
}) {
    const [texto, setTexto] = useState(valorInicial);
    const textoEspera = useDebounce(texto, delay);

    const [valorPrevio, setValorPrevio] = useState(valorInicial);
    if (valorInicial !== valorPrevio) {
        setValorPrevio(valorInicial);
        setTexto(valorInicial);
    }

    // Busca solo cuando el usuario dejó de escribir (texto ya "asentado")
    useEffect(() => {
        if (texto !== textoEspera) return;
        if (textoEspera === valorInicial) return;
        if (textoEspera.trim().length > 0 && textoEspera.trim().length < 2) return;

        onBuscar?.(textoEspera.trim());
    }, [texto, textoEspera, valorInicial, onBuscar]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onBuscar?.(texto.trim());
    };

    return (
        <form className="SearchBar" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder={"buscar productos, marcas y más..." }
                className="SearchBar-input"
                onFocus={onFocus}
                onBlur={onBlur}
                value={texto}
                minLength={2}
                maxLength={200}
                onChange={(e) => setTexto(e.target.value)}
            />
        </form>
    );
}

export function Home() {
    const dispatch = useDispatch();
    const [bg, setBg] = useState(0);
    const intervalRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const onBuscar = useCallback(
        (texto) => dispatch(buscarEnCatalogo(texto)),
        [dispatch],
    );

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
                    <button onClick={() => dispatch(irA('catalog'))}>
                        Ver Catalogo
                    </button>
                </div>
            </div>
            <footer className="Footer-home">
                <Info />
                <div>
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
                <Rat />
            </footer>
        </section>
    );
}
