import { CadastroGruposDeContatos } from "../types/grupoDeContatos";
import { deleteRequest, getRequest, postRequest } from "../utils/axiosRequest";

export const getListGrupo = async () => {
    return await getRequest("/Grupo");
}

export const postGrupo = async (param: CadastroGruposDeContatos) => {
    return await postRequest("/Grupo", param);
}

export const deleteGrupo = async (id: number) => {
    return await deleteRequest(`/Grupo/${id}`);
}