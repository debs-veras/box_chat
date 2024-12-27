import { baseFiltros } from "../types/baseEntity.d";
import { getRequest, postRequest } from "../utils/axiosRequest";

export const getListConversa = async (id: number) => {
    return await getRequest(`/Conversa/${id}`);
}

export const getListUltimasConversa = async (dados: baseFiltros) => {
    return await postRequest('/Conversa/listagem', dados);
}   