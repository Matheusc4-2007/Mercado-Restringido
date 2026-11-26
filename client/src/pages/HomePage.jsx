import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Rat } from 'lucide-react';
import { backgrounds } from '../data/backgrounds';
import { SearchBar } from '../components/SearchBar';
import { useBusquedaCatalogo } from '../hooks/useBusquedaCatalogo';

export function HomePage() {
    const navigate = useNavigate();
    const { buscar } = useBusquedaCatalogo();
    const [bg, setBg] = useState(0);
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
                    onBuscar={buscar}
                />

                <div className="Buttons-welcome">
                    <button onClick={() => navigate('/catalogo')}>
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
