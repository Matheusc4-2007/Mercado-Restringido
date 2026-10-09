import Usuarios from '../models/usuarios.model.js'

class UsuariosController{
    
    static todos(){
        return Usuarios.todos()
    }

    static buscarId(id){
        return Usuarios.buscarId(id)
    }

    static buscarCedula(cedula){
        return Usuarios.buscarCedula(cedula)
    }
        
    static crear(body){
        return Usuarios.crear(body)
    }

    static actualizar(id , body){
        return Usuarios.actualizar(id , body)
    }

    static eliminar(id){
        return Usuarios.eliminar(id)
    }
}

export default UsuariosController