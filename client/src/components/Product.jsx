import { useDispatch, useSelector } from 'react-redux';
import question from '../assets/undefined-product.png';
import { selectUsuario } from '../app/authSlice';
import { agregarAlCarrito } from '../app/carritoSlice';

export function Product({
    id,
    name = 'Product Name',
    price = '00.00',
    seller = 'Default',
    img = question,
}) {
    const dispatch = useDispatch();
    const usuarioExiste = useSelector(selectUsuario);

    const agregar = () =>
        dispatch(
            agregarAlCarrito({
                idCompra: id,
                nombreCompra: name,
                precioCompra: price,
                vendedorCompra: seller,
                imagenCompra: img,
            }),
        );

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
            <p className="Price">{price}$</p>
            <p className="Seller">Vendedor: {seller}</p>
            <button
                className={usuarioExiste ? 'Agg-cart' : 'Agg-cart-disabled'}
                disabled={!usuarioExiste}
                onClick={agregar}
            >
                Agregar Al Carrito
            </button>
        </div>
    );
}
