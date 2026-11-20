// Debe coincidir con las transiciones permitidas en el backend
export const TRANSICIONES_PEDIDO = {
  pendiente: ['enviado', 'cancelado'],
  enviado: ['entregado'],
  entregado: [],
  cancelado: [],
}
