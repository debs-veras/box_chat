import { ConversaListagem } from "../types/Conversa.d";
import { postRequest } from "../utils/axiosRequest";

export const getListConversa = async (param: ConversaListagem) => {
    return await postRequest("/Conversa/listagem", param);
}

export const getConversa = async (param: ConversaListagem) => {
    return await postRequest("/Conversa", param);
}