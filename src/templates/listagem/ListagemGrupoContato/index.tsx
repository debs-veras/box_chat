import { useState } from "react";
import { Contato } from "../../../types/contato.d";
import { grupoDeMensagem } from "../../../types/grupoDeMensagem.d";
import ModalCriarGrupo from "../../modal/ModalCadastroGrupo";
import { HeaderComponent } from "../../../components/HeaderListagem";

interface GrupoContato {
    id: number;
    nome: string;
    membros: Array<Contato>;
}

interface ListagemGrupoContatoProps {
    gruposDeContatos: GrupoContato[];
    onSelectGrupo: (grupoSelecionado: grupoDeMensagem) => void;
}

export const ListagemGrupoContato = ({ gruposDeContatos, onSelectGrupo }: ListagemGrupoContatoProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nomeGrupo, setNomeGrupo] = useState('');

    const [contatos, setContatos] = useState<Contato[]>([
        { id: 1, nome: 'KillJoy', foto: '', numero: '' },
        { id: 2, nome: 'Raze', foto: '', numero: '' },
        // Outros contatos
    ]);


    return (
        <>
            <HeaderComponent
                titulo="Grupos"
                setIsModalOpen={setIsModalOpen}
            />
            <div className="px-4">
                <ul className="space-y-2">
                    {gruposDeContatos.map((grupo) => (
                        <li
                            key={grupo.id}
                            className="flex justify-between items-center p-2 bg-[#F5F5F5] rounded-md cursor-pointer"
                            onClick={() => onSelectGrupo(grupo)}
                        >
                            <div>
                                <h3 className="font-semibold">{grupo.nome}</h3>
                                <span className="text-sm text-gray-500">{grupo.membros.length} membros</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <ModalCriarGrupo
                isOpen={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                contatos={contatos}
                nomeGrupo={nomeGrupo}
                setNomeGrupo={setNomeGrupo}
            />
        </>
    );
};
