import { Contato } from "./contato.d";

export interface grupoDeMensagem {
    id: number;
    nome: string;
    membros: Contato[];
}
