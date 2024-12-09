import { Contato } from "./contato.d";

export interface GruposDeContatos {
    id: number;
    nome: string;
    membros: Contato[];
}
