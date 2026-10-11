export function DashBoard ({ model, products = [] }) {
  const total = products?.length || 0;
  const sum = products?.reduce((acc, prod) => acc + Number(prod.precio), 0) || 0;
  const average = total > 0 ? (sum / total).toFixed(2) : 0;

  switch (model) {
    case 1:
      return (
        <div className="DashBoard-display">
          <p className="Num-display">{total}</p>
          <p>productos en venta</p>
        </div>
      );
    case 2:
      return (
        <div className="DashBoard-display">
          <p className="Num-display">{sum}$</p>
          <p>Valor total del inventario</p>
        </div>
      );
    case 3:
      return (
        <div className="DashBoard-display">
          <p className="Num-display">{average}$</p>
          <p>Precio promedio de todos los productos</p>
        </div>
      );
    default:
      return null;
  }
}
