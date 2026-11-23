import { useState } from 'react';
import question from '../assets/undefined-product.png';
import { useAuth } from '../hooks/useAuth';
import { useCarrito } from '../hooks/useCarrito';
import { BotonFavorito } from './BotonFavorito';
import { Resenas } from './Resenas';
import { textoValoracion } from '../utils/valoracion';

export function Product({
    id,
    name = 'Product Name',
    price = '00.00',
    seller = 'Default',
    sellerId,
    stock,
    rating = null,
    reviewCount = 0,
    img = question,
    category,
    description,
}) {
    const { estaLogueado } = useAuth();
    const { agregar: agregarAlCarrito } = useCarrito();
    
    const [isExpanded, setIsExpanded] = useState(false);

    // Crear, editar o borrar una reseña en el detalle actualiza la valoración de la tarjeta
    const [valoracion, setValoracion] = useState(null);
    const { promedio, total } = valoracion ?? { promedio: rating, total: reviewCount };

    const agotado = stock === 0;
    const puedeAgregar = estaLogueado && !agotado;

    const agregar = () => {
        agregarAlCarrito({
            idCompra: id,
            nombreCompra: name,
            precioCompra: price,
            vendedorCompra: seller,
            imagenCompra: img,
            stockCompra: stock,
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
                <p className="Rating">{textoValoracion(promedio, total)}</p>
                <p className="Price">{price}$</p>
                <p className="Seller">Vendedor: {seller}</p>
                <p className={agotado ? 'Stock Stock-agotado' : 'Stock'}>
                    {agotado ? 'Agotado' : `Disponibles: ${stock}`}
                </p>
                <BotonFavorito idProducto={id} />
                <button
                    className={puedeAgregar ? 'Agg-cart' : 'Agg-cart-disabled'}
                    disabled={!puedeAgregar}
                    onClick={agregar}
                >
                    {agotado ? 'Agotado' : 'Agregar Al Carrito'}
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
                                <p className="Modal-rating">{textoValoracion(promedio, total)}</p>
                                <p className="Modal-price">{price}$</p>
                                
                                <div className="Modal-description-box">
                                    <h4>Descripción del producto:</h4>
                                    <p>{description || 'Este producto no cuenta con una descripción detallada.'}</p>
                                </div>
                                
                                <p className="Modal-seller">Vendido por: <strong>{seller}</strong></p>
                                <p className={agotado ? 'Stock Stock-agotado' : 'Stock'}>
                                    {agotado ? 'Agotado' : `Disponibles: ${stock}`}
                                </p>

                                <button
                                    className={puedeAgregar ? 'Agg-cart Modal-btn' : 'Agg-cart-disabled Modal-btn'}
                                    disabled={!puedeAgregar}
                                    onClick={() => {
                                        agregar();
                                        setIsExpanded(false);
                                    }}
                                >
                                    {agotado ? 'Agotado' : 'Agregar Al Carrito'}
                                </button>
                                <BotonFavorito idProducto={id} />
                            </div>
                        </div>

                        <Resenas
                            idProducto={id}
                            idVendedor={sellerId}
                            onResumen={setValoracion}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
