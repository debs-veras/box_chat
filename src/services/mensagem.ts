import { Mensagem } from "../types/mensagem.d";
import { postRequest } from "../utils/axiosRequest";

export const postEnviarMensagem = async (param: Mensagem) => {
    return await postRequest("/Mensagem", param);

}