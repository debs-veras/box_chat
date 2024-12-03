import { authLogin } from "../types/auth.d";
import { getRequest, putRequest } from "../utils/axiosRequest";

export const getUsuarioLogado = async () => {
  return await getRequest(`/auth/logado`);
};

export const login = async (usuarioLogin: authLogin) => {
  return await putRequest("/auth/login", usuarioLogin);
};

export const autenticacao = async () => {
  return await getRequest("/sessao/validar");
};
