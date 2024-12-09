import { useEffect, useState } from "react";
import { GruposDeContatos } from "../../../types/grupoDeContatos";
import { HeaderComponent } from "../../../components/HeaderListagem";
import useDebounce from "../../../hooks/useDebounce";
import useToastLoading from "../../../hooks/useToastLoading";
import { getListGrupo } from "../../../services/grupoContato";
import { FaUsers } from "react-icons/fa";
import Loading from "../../../components/Loading";

interface ListagemGrupoContatoProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ListagemGrupoContato = ({ setIsOpen }: ListagemGrupoContatoProps) => {
    const [pesquisaGrupoContato, setPesquisaGrupoContato] = useState<string>('');
    const toast = useToastLoading();
    const [loading, setLoading] = useState<boolean>(false);
    const [gruposContatosFiltrados, setGruposContatosFiltrados] = useState<Array<GruposDeContatos>>([]);
    const [gruposDeContatos, setGruposDeContatos] = useState<Array<GruposDeContatos>>([]);

    const carregaContatos = async (): Promise<void> => {
        setLoading(true);
        const request = () => getListGrupo();
        const response = await request();
        if (response.sucesso) setGruposDeContatos(response.dados);
        else toast({ tipo: response.tipo, mensagem: response.mensagem });
        setLoading(false);
    };

    const filtroDebounce = useDebounce(carregaContatos, 500);

    useEffect(() => {
        filtroDebounce();
    }, [])

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

            <div className="px-4 py-2 flex flex-col gap-2">
                {loading ? (
                    <Loading />
                ) : (
                    gruposContatosFiltrados.length > 0 ? (
                        gruposContatosFiltrados.map((grupo) => (
                            <div
                                key={grupo.id}
                                className="flex justify-between gap-1 items-center p-4 bg-white rounded-lg cursor-pointer"
                            >
                                <div className="truncate">
                                    <h3 className="font-semibold text-left text-lg text-gray-800 truncate">
                                        {grupo.nome}
                                    </h3>
                                    <span className="text-sm text-gray-500 max-w-full">
                                        {grupo.descricao}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FaUsers className="text-blue-500" />
                                    <span className="text-sm text-gray-500">
                                        {grupo.contatoIds?.length ?? 0}
                                    </span>
                                </div>
                            </div>

                        ))) : <p>Nenhum contato disponível.</p>
                )}
            </div>
        </>
    );
};
