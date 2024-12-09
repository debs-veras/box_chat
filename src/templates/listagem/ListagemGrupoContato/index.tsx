import { useEffect, useState } from "react";
import { GruposDeContatos } from "../../../types/grupoDeContatos";
import { HeaderComponent } from "../../../components/HeaderListagem";

interface ListagemGrupoContatoProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ListagemGrupoContato = ({ setIsOpen }: ListagemGrupoContatoProps) => {
    const [pesquisaGrupoContato, setPesquisaGrupoContato] = useState<string>('');
    const [gruposContatosFiltrados, setGruposContatosFiltrados] = useState<Array<GruposDeContatos>>([]);
    const [gruposDeContatos, setGruposDeContatos] = useState<Array<GruposDeContatos>>([
        {
            id: 1,
            nome: 'Amigos',
            membros: [
                { id: 1, nome: 'KillJoy', foto: '/images.jpeg', numero: '88992531384' },
                { id: 2, nome: 'Raze', foto: '/imagens/users/raze.webp', numero: '' }
            ]
        },
        {
            id: 2,
            nome: 'Família',
            membros: [
                { id: 3, nome: 'Brimstone', foto: '/imagens/users/brimstone.jpg', numero: '88992531385' }
            ]
        }
    ]);

    // const handleGrupoClick = (grupoSelecionado: gruposDeContatos) => {
    //     setGrupoAtivo(grupoSelecionado);
    //     if (grupoSelecionado) {
    //         const existeConversa = conversas.find(convo => convo.grupo?.id === grupoSelecionado.id);

    //         if (existeConversa) setConversaSelecionada(existeConversa);
    //         else {
    //             const novaConversa: Conversa = {
    //                 id: Date.now(),
    //                 grupo: grupoSelecionado,
    //                 ultimaMensagem: {
    //                     remetente: '',
    //                     texto: '',
    //                     horario: '',
    //                     dataEnvio: '',
    //                     dataRecebimento: '',
    //                     dataVisualizacao: ''
    //                 },
    //                 mensagensPendentes: 0
    //             };
    //             console.log(novaConversa);

    //             setConversas(prevConversas => [...prevConversas, novaConversa]);
    //             setConversaSelecionada(novaConversa);
    //         }
    //     }
    // };

    useEffect(() => {
        if (!pesquisaGrupoContato.trim()) setGruposContatosFiltrados(gruposDeContatos);
        else {
            const termo = pesquisaGrupoContato.toLowerCase();
            const gruposFiltrados = gruposDeContatos.filter((grupo) => {
                const nomeGrupo = grupo?.nome.toLowerCase();
                return nomeGrupo?.includes(termo)
            });
            setGruposContatosFiltrados(gruposFiltrados);
        }
    }, [pesquisaGrupoContato, gruposDeContatos]);

    return (
        <>
            <HeaderComponent
                titulo="Grupos"
                setIsModalOpen={setIsOpen}
                inputAtivo={true}
                pesquisa={pesquisaGrupoContato}
                setPesquisa={setPesquisaGrupoContato}
            />

            <div className="px-4">
                <ul className="space-y-2">
                    {gruposContatosFiltrados.map((grupo) => (
                        <li
                            key={grupo.id}
                            className="flex justify-between items-center p-2 bg-[#F5F5F5] rounded-md cursor-pointer"
                        // onClick={() => onSelectGrupo(grupo)}
                        >
                            <div>
                                <h3 className="font-semibold">{grupo.nome}</h3>
                                <span className="text-sm text-gray-500">{grupo.membros.length} membros</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};
