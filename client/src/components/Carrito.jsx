import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { useCarrito } from '../hooks/useCarrito';
import { crearPedido, selectPedidosError } from '../app/pedidosSlice';
import { irA } from '../app/uiSlice';
import { MensajeError } from './admin/MensajeError';

export function Carrito() {
    const dispatch = useDispatch();
    const { usuario } = useAuth();
    const { items: carrito, total: totalCarrito, quitar: eliminarCarrito } = useCarrito();
    const error = useSelector(selectPedidosError);
    const [comprando, setComprando] = useState(false);

    // Envía el carrito como pedido. Si sale bien, el carrito se vacía solo
    // (carritoSlice escucha crearPedido.fulfilled) y se va a "Mis pedidos".
    const comprar = async () => {
        setComprando(true);
        const res = await dispatch(
            crearPedido({
                id_comprador: usuario.id,
                items: carrito.map((i) => ({
                    id_producto: i.idCompra,
                    cantidad: i.cantidad,
                })),
            }),
        );
        setComprando(false);
        if (res.meta.requestStatus === 'fulfilled') dispatch(irA('pedidos'));
    };

    return (
        <section className="Carrito-section">
            <p className="Carrito-text">
                Su carrito se ve así... ¿No quiere comprar más?
            </p>

            <MensajeError error={error} />

            <article className="Container-carrito-elems">
                {carrito.length > 0
                    ? carrito.map((elem) => (
                          <div
                              className="Carrito-individual"
                              key={elem.idCompra}
                          >
                              <img
                                  src={elem.imagenCompra}
                                  alt="Imagen del producto"
                              />
                              <span className="info-compra">
                                  <span>
                                      <span className="nombre-cantidad">
                                          <h4 className="nombre-producto-carrito">
                                              {elem.nombreCompra}
                                          </h4>
                                          <p>Cantidad: {elem.cantidad}</p>
                                          <p>Disponibles: {elem.stockCompra}</p>
                                      </span>

                                      <p className="vendedor-producto-carrito">
                                          vendedor: {elem.vendedorCompra}
                                      </p>
                                      <p className="precio-producto-carrito">
                                          precio: {elem.precioCompra}
                                      </p>
                                  </span>
                                  <button
                                      className="borrar-carrito"
                                      onClick={() =>
                                          eliminarCarrito(elem.idCompra)
                                      }
                                  >
                                      Eliminar
                                  </button>
                              </span>
                          </div>
                      ))
                    : 'No tiene elementos en el carrito'}
                {carrito.length > 0 ? (
                    <>
                        <div className="total-container">
                            <p className="total-todo">
                                Total de la compra:{' '}
                                <span className="total-txt">
                                    {totalCarrito.toFixed(2)}
                                </span>
                            </p>
                            <button
                                className="btn-comprar"
                                onClick={comprar}
                                disabled={comprando}
                            >
                                {comprando ? 'Procesando...' : 'Comprar'}
                            </button>
                        </div>
                    </>
                ) : (
                    ''
                )}
            </article>
        </section>
    );
}

