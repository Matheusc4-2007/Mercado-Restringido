import { useState } from 'react';
import question from '../assets/undefined-product.png';
import { useAuth } from '../hooks/useAuth';
import { useCarrito } from '../hooks/useCarrito';

export function Product({
    id,
    name = 'Product Name',
    price = '00.00',
    seller = 'Default',
    img = question,
    category,
    description,
}) {
    const { estaLogueado } = useAuth();
    const { agregar: agregarAlCarrito } = useCarrito();
    
    const [isExpanded, setIsExpanded] = useState(false);

    const agregar = () => {
        agregarAlCarrito({
            idCompra: id,
            nombreCompra: name,
            precioCompra: price,
            vendedorCompra: seller,
            imagenCompra: img,
        });
    };

    return (
        <>
            <div className="Product-card">
                <img
                    src={img}
                    alt="Imagen del Producto"
                    className="Img"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = question;
                    }}
                />
                <button 
                    className="Name-product" 
                    onClick={() => setIsExpanded(true)}
                >
                    {name}
                </button>
                {category && <p className="Category">{category}</p>}
                <p className="Price">{price}$</p>
                <p className={description ? 'Description' : 'Description empty'}>
                    {description || 'Sin descripción'}
                </p>
                <p className="Seller">Vendedor: {seller}</p>
                <button
                    className={estaLogueado ? 'Agg-cart' : 'Agg-cart-disabled'}
                    disabled={!estaLogueado}
                    onClick={agregar}
                >
                    Agregar Al Carrito
                </button>
            </div>

            {isExpanded && (
                <div className="Product-modal-overlay" onClick={() => setIsExpanded(false)}>
                    <div className="Product-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="Modal-close-btn" onClick={() => setIsExpanded(false)}>
                            ✕
                        </button>
                        
                        <div className="Modal-grid">
                            <img
                                src={img}
                                alt="Imagen Detallada"
                                className="Modal-img"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = question;
                                }}
                            />
                            <div className="Modal-details">
                                <h2>{name}</h2>
                                {category && <span className="Modal-category">{category}</span>}
                                <p className="Modal-price">{price}$</p>
                                
                                <div className="Modal-description-box">
                                    <h4>Descripción del producto:</h4>
                                    <p>{description || 'Este producto no cuenta con una descripción detallada.'}</p>
                                </div>
                                
                                <p className="Modal-seller">Vendido por: <strong>{seller}</strong></p>

                                <button
                                    className={estaLogueado ? 'Agg-cart Modal-btn' : 'Agg-cart-disabled Modal-btn'}
                                    disabled={!estaLogueado}
                                    onClick={() => {
                                        agregar();
                                        setIsExpanded(false);
                                    }}
                                >
                                    Agregar Al Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
