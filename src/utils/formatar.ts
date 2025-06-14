import moment from "moment";

export const formatarDataHora = (data: Date | string, tipo: "" | "data" | "hora" = "", segundos: boolean = false): string => {
    if (tipo == "data") return moment(data).format("DD/MM/YYYY");
    if (tipo == "hora")
        return segundos ? moment(data).format("HH:mm:ss") : moment(data).format("HH:mm");
    return segundos ? moment(data).format("DD/MM/YYYY HH:mm:ss") : moment(data).format("DD/MM/YYYY HH:mm");
};