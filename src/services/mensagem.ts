import { EnviarMensagem } from "../types/mensagem.d";
import { postRequest } from "../utils/axiosRequest";

export const postEnviarMensagem = async (param: EnviarMensagem) => {
    return await postRequest("/Mensagem/enviar", param);

}