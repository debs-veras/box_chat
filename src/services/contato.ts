import { baseFiltros } from "../types/baseEntity.d";
import { ContatoCadastro } from "../types/contato.d";
import { deleteRequest, postRequest, putRequest } from "../utils/axiosRequest";

export const postContato = async (dados: ContatoCadastro) => {
    return await postRequest(`/Contato`, dados);
}

export const postListContatoFiltro = async (dados: baseFiltros) => {
    return await postRequest(`/Contato/listagem`, dados);
}

export const deleteContato = async (id: number) => {
    return await deleteRequest(`/Contato/${id}`);
}

export const putContato = async (contatoAlterado: ContatoCadastro) => {
    return await putRequest(`/Contato`, contatoAlterado);
}
