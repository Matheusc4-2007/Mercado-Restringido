// Utilidades compartidas por los slices

// Redux Toolkit exige estado serializable, así que el ApiError
// (una clase con prototipo) se guarda como objeto plano.
export const serializarError = (err) => ({
  message: err?.message ?? 'Error inesperado',
  detalles: err?.detalles ?? [],
  status: err?.status ?? 0,
})

// Envuelve el cuerpo de un createAsyncThunk: si algo falla, rechaza el thunk
// con el error ya serializado (llega al reducer en action.payload).
export const conRechazo = (fn) => async (arg, thunkApi) => {
  try {
    return await fn(arg, thunkApi)
  } catch (err) {
    return thunkApi.rejectWithValue(serializarError(err))
  }
}

// Lo que se guarda en state.error cuando un thunk es rechazado
export const errorDeAccion = (action) =>
  action.payload ?? serializarError(action.error)
