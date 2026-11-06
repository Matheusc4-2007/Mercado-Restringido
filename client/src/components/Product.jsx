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

    const agregar = () =>
        agregarAlCarrito({
            idCompra: id,
            nombreCompra: name,
            precioCompra: price,
            vendedorCompra: seller,
            imagenCompra: img,
        });

    return (
        <div className="Product-card">
            <img
                src={img}
                alt="Imagen del Producto"
                className="Img"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                    e.currentTarget.onerror = null; // evita un bucle
                    e.currentTarget.src = question;
                }}
            />
            <h4 className="Name">{name}</h4>
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
    );
}
