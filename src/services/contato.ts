import { getRequest } from "../utils/axiosRequest";

export const getListContatos = async ( ) => {
    return await getRequest("/Contato");
}