import { getRequest } from "../utils/axiosRequest";

export const getListConversa = async (id: number) => {
    return await getRequest(`/Conversa/${id}`);
}

export const getListUltimasConversa = async () => {
    return await getRequest('/Conversa/listagem');
}   