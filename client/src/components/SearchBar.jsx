import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

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
