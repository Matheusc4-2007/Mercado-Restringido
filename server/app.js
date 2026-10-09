import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import usuariosRouter from './routes/usuarios.route.js'
import productosRouter from './routes/productos.route.js'

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/usuario' , usuariosRouter)
app.use('/api/producto', productosRouter)

app.use((req,res)=>{
    res.status(404).json({
        error: 'Ruta no encontrada',
        detalle: `${req.method} ${req.originalUrl}`
    })
})

app.use((err, req, res , next)=>{
    
    if (err.type === 'entity.parse.failed'){
        return res.status(400).json({
            error : 'Json invalido',
            detalle : 'el cuerpo de la peticion no es válido'
        })
    }

    console.error(err)

    res.status(err.status || 500).json({
        error : err.error || 'Error interno del server',
        detalle: err.detalle || err.message
    })
})

app.listen(PORT , () =>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})