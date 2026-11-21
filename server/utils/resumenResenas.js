// Promedio y cantidad de reseñas; las consultas que lo usan deben llamar `p` a productos

export const COLUMNAS_RESUMEN_RESENAS = `
           r.promedio AS promedio_calificacion, COALESCE(r.total, 0) AS total_resenas`

export const JOIN_RESUMEN_RESENAS = `
    LEFT JOIN (
        SELECT id_producto, AVG(calificacion) AS promedio, COUNT(*) AS total
        FROM resenas
        GROUP BY id_producto
    ) r ON r.id_producto = p.id`

export const aResumenRespuesta = (fila) => ({
    promedio_calificacion:
        fila.promedio_calificacion === null
            ? null
            : Math.round(Number(fila.promedio_calificacion) * 10) / 10,
    total_resenas: Number(fila.total_resenas),
})
