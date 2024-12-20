import { EnviarMensagem, EnviarMensagemGrupo } from "../types/mensagem.d";
import { postRequest } from "../utils/axiosRequest";

export const postEnviarMensagem = async (param: EnviarMensagem) => {
    return await postRequest("/Mensagem/enviar", param);
}

export const postEnviarMensagemGrupo = async (param: EnviarMensagemGrupo) => {
    return await postRequest("/Mensagem/enviar-grupo", param);
}