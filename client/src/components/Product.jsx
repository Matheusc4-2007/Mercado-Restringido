import question from '../assets/undefined-product.png';

export function Product ({name="Product Name", price="00.00", seller="Default", img=question}){
  return (
    <div className="Product-card">
      <img src={img} alt="Imagen del Producto" className="Img"
        onError={(e) => {
          e.currentTarget.onerror = null   // evita un bucle
          e.currentTarget.src = question
        }}
      />
      <h4 className="Name">{name}</h4>
      <p className="Price">{price}$</p>
      <p className="Seller">Vendedor: {seller}</p>
      <button className='Agg-cart'>
        Agregar Al Carrito
      </button>
    </div>
  )
}

/* const nuevoProductoDB = {
                id: uuidv4(),
                nombre: productoData.nombre,
                precio: productoData.precio,
                id_vendedor: productoData.id_vendedor,
                imagen: productoData.imagen,
            } */