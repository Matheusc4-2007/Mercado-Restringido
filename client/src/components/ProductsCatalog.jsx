export function Product({ name, price, seller, img }) {
  return (
    <div className="Product-card">
      <img src={img} alt={name} className="Img-product" />
      <div className="Product-info">
        <h4 className="Product-name">{name}</h4>
        <p className="Product-price">${price}</p>
        <p className="Product-seller">Vendido por: {seller}</p>
      </div>
    </div>
  );
}

export function ProductsCatalog() {
  // Lista de prueba
  const productsList = [
    { id: 1, name: "Lámpara LED Moderna", price: "45.00", seller: "HomeTech", img: "./assets/Logo_Shop.svg" },
    { id: 2, name: "Organizador de Cocina", price: "25.50", seller: "Deco Hogar", img: "./assets/Logo_Shop.svg" },
    { id: 3, name: "Set de Cuchillos Acero", price: "60.00", selector: "KitchenPro", img: "./assets/Logo_Shop.svg" },
  ];

  return (
    <section className="Products-catalog">
      <form className="SearchBar" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Buscar productos, marcas y más..."
            className="SearchBar-input"
          />
          <button type="submit" className="SearchBar-button">
            Buscar
          </button>
      </form>
      <div className="Products-grid">
        {productsList.map((prod) => (
          <Product 
            key={prod.id} 
            name={prod.name} 
            price={prod.price} 
            seller={prod.seller || prod.selector} 
            img={prod.img} 
          />
        ))}
      </div>
    </section>
  );
}