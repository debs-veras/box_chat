import moment from "moment";

export const formatarTelefone = (telefone: string): string => {
    if (!!!telefone) return "";
    var r = telefone.replace(/\D/g, "");
    r = r.replace(/^0/, "");
    if (r.length > 10) {
        r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 5) {
        r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
        r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else {
        r = r.replace(/^(\d*)/, "($1");
    }
    return r;
}

export const formatarDataHora = (data: Date | string, tipo: "" | "data" | "hora" = "", segundos: boolean = false): string => {
    if (tipo == "data") return moment(data).format("DD/MM/YYYY");
    if (tipo == "hora")
        return segundos ? moment(data).format("HH:mm:ss") : moment(data).format("HH:mm");
    return segundos ? moment(data).format("DD/MM/YYYY HH:mm:ss") : moment(data).format("DD/MM/YYYY HH:mm");
};
