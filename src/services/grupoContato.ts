import { baseFiltros } from "../types/baseEntity.d";
import { CadastroGruposDeContatos } from "../types/grupoDeContatos";
import { deleteRequest, postRequest, putRequest } from "../utils/axiosRequest";

export const getListGrupo = async (dados: baseFiltros) => {
    return await postRequest("/Grupo/listagem", dados);
}

export const postGrupo = async (param: CadastroGruposDeContatos) => {
    return await postRequest("/Grupo", param);
}

export const deleteGrupo = async (id: number) => {
    return await deleteRequest(`/Grupo/${id}`);
}

export const putGrupo = async (grupoAlterado: CadastroGruposDeContatos) => {
    return await putRequest(`/Grupo`, grupoAlterado);
}
