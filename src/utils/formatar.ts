import moment from "moment";

export const formatarTelefone = (telefone: string): string => {
    if (!telefone) return "";
    let r = telefone.replace(/\D/g, "");
    if (!r.startsWith("55")) {
        r = "55" + r;
    }
    if (r.length > 12) {
        r = r.slice(0, 12); 
    } else if (r.length < 12) {
        r = r.padEnd(12, "0");
    }
    r = r.replace(/^(\d{2})(\d{2})(\d{4})(\d{4})$/, "+$1 ($2) $3-$4");

    return r;
};

export const removeMascara = (phone: string): string => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (!digitsOnly.startsWith('55')) 
      return `55${digitsOnly}`;
    return digitsOnly;
  };

export const formatarDataHora = (data: Date | string, tipo: "" | "data" | "hora" = "", segundos: boolean = false): string => {
    if (tipo == "data") return moment(data).format("DD/MM/YYYY");
    if (tipo == "hora")
        return segundos ? moment(data).format("HH:mm:ss") : moment(data).format("HH:mm");
    return segundos ? moment(data).format("DD/MM/YYYY HH:mm:ss") : moment(data).format("DD/MM/YYYY HH:mm");
};

export const formatarNumeroBrl = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR').format(valor);
}