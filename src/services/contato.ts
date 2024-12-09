import { ContatoCadastro } from "../types/contato.d";
import { deleteRequest, getRequest, postRequest } from "../utils/axiosRequest";

export const getListContatos = async () => {
    return await getRequest("/Contato");
}

export const postContato = async (dados: ContatoCadastro) => {
    return await postRequest(`/Contato`, dados);
}

export const deleteContato = async (id: number) => {
    return await deleteRequest(`/Contato/${id}`);
}