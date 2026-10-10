export function MensajeError({ error }) {
  if (!error) return null

  return (
    <div role="alert">
      <p>{error.message}</p>
      {error.detalles?.length > 0 && (
        <ul>
          {error.detalles.map((d) => <li key={d}>{d}</li>)}
        </ul>
      )}
    </div>
  )
}