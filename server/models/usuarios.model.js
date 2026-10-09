import { v4 as uuidv4 } from "uuid";
import connection from '../db.js';

const errorDB = (mensaje , error) => {
    const err = new Error(`${mensaje}: ${error.message}`);
    err.code = error.code
    return err
};

class Usuarios{
    static async todos() {
        try {
            const [rows] = await connection.query(
                'SELECT * FROM usuarios ORDER BY apellido ASC, nombre ASC'
            );
            return rows;
        }
        catch (error){
            throw errorDB('Error al obtener usuarios' , error)
        }
    }

    static async crear(usuarioData){
        try{
            const nuevoUsuarioDB ={
                id:uuidv4(),
                cedula: usuarioData.cedula,
                nombre: usuarioData.nombre,
                apellido: usuarioData.apellido,
                fecha_nacimiento: usuarioData.fecha_nacimiento,
                es_vendedor: usuarioData.es_vendedor ?? false ,
            };

            await connection.query('INSERT INTO usuarios SET ?' , nuevoUsuarioDB)
            return nuevoUsuarioDB
        }
        catch(error) {
            throw errorDB('Error al crear usuario', error)
        };
    };


    static async actualizar(id, usuarioData) {
        try {
            const camposActualizados = {};

            if (usuarioData.cedula !== undefined)
                camposActualizados.cedula = usuarioData.cedula;
            if (usuarioData.nombre !== undefined)
                camposActualizados.nombre = usuarioData.nombre;
            if (usuarioData.apellido !== undefined)
                camposActualizados.apellido = usuarioData.apellido;
            if (usuarioData.fecha_nacimiento !== undefined)
                camposActualizados.fecha_nacimiento = usuarioData.fecha_nacimiento;
            if (usuarioData.es_vendedor !== undefined)
                camposActualizados.es_vendedor = usuarioData.es_vendedor;

            if (Object.keys(camposActualizados).length === 0) return null;

            await connection.query('UPDATE usuarios SET ? WHERE id = ?', [
                camposActualizados,
                id,
            ]);

            return await this.buscarId(id);
        } 
        catch (error) {
            throw errorDB('Error al actualizar usuario', error);
        }
    }

    static async eliminar(id){
        try{
            const usuario = await this.buscarId(id)
            await connection.query('DELETE FROM usuarios WHERE id = ?' , [id]);
            return usuario // devuel lo eliminado 
        }
        catch(error){
            throw errorDB('Error al eliminar usuario', error)
        }
    }

    static async buscarCedula(cedula){
        try{
            const [rows] = await connection.query(
                'SELECT * FROM usuarios WHERE cedula = ?' ,
                [cedula]
            )
            return rows.length === 0 ? null : rows[0]
        }
        catch(error){
            throw errorDB('Error al buscar usuario por cedula' , error);
        }
    }

    static async buscarId(id) {
        try {
            const [rows] = await connection.query(
                'SELECT * FROM usuarios WHERE id = ?',
                [id]
            );
            return rows.length === 0 ? null : rows[0];
        } 
        catch (error) {
            throw errorDB('Error al buscar usuario por ID', error);
        }
    }
};

export default Usuarios;   