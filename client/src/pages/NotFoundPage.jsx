import { Link } from 'react-router-dom';

export function NotFoundPage() {
    return (
        <section className="Form-container">
            <div className="Form-login">
                <h2 className="Form-title">No encontramos esta página</h2>
                <p className="NotFound-text">
                    La dirección no existe o fue movida.
                </p>
                <Link to="/" className="Submit-button NotFound-link">
                    Volver al inicio
                </Link>
            </div>
        </section>
    );
}
