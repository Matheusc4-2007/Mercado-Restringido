import { useState, useEffect } from 'react';

export function Carrito() {
    const [carrito, setCarrito] = useState(() => {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    });
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }, [carrito]);

    function eliminarCarrito(id) {
        setCarrito((prev) => prev.filter((elem) => elem.idCompra !== id));
    }

    const totalCarrito = carrito.reduce(
        (acc, elem) => acc + Number(elem.precioCompra) * elem.cantidad,
        0,
    );

    return (
        <section className="Carrito-section">
            <p className="Carrito-text">
                Su carrito se ve así... ¿No quiere comprar más?
            </p>

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
                            <button className="btn-comprar">Comprar</button>
                        </div>
                    </>
                ) : (
                    ''
                )}
            </article>
        </section>
    );
}
