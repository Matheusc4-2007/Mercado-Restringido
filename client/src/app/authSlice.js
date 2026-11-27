import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { login, crearUsuario } from '../services/usuarios.service';
import { conRechazo, errorDeAccion } from './utils';

const guardarSesion = ({ token, usuario }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    return usuario;
};

const usuarioGuardado = () => {
    try {
        return JSON.parse(localStorage.getItem('usuario'));
    } catch {
        return null;
    }
};

export const iniciarSesion = createAsyncThunk(
    'auth/iniciarSesion',
    conRechazo(async (cedula) => guardarSesion(await login(cedula))),
);

export const registrarse = createAsyncThunk(
    'auth/registrarse',
    conRechazo(async (datos) => {
        await crearUsuario(datos);
        return guardarSesion(await login(datos.cedula));
    }),
);

const initialState = {
    usuario: usuarioGuardado(),
    cargando: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            return { usuario: null, cargando: false, error: null };
        },
        limpiarErrorAuth: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                isAnyOf(iniciarSesion.pending, registrarse.pending),
                (state) => {
                    state.cargando = true;
                    state.error = null;
                },
            )
            .addMatcher(
                isAnyOf(iniciarSesion.fulfilled, registrarse.fulfilled),
                (state, action) => {
                    state.cargando = false;
                    state.usuario = action.payload;
                },
            )
            .addMatcher(
                isAnyOf(iniciarSesion.rejected, registrarse.rejected),
                (state, action) => {
                    state.cargando = false;
                    state.error = errorDeAccion(action);
                },
            );
    },
});

export const { logout, limpiarErrorAuth } = authSlice.actions;
export default authSlice.reducer;

export const selectUsuario = (state) => state.auth.usuario;
export const selectAuthCargando = (state) => state.auth.cargando;
export const selectAuthError = (state) => state.auth.error;
