import { useEffect, useState } from "react";
import { HeaderComponent } from "../../../components/HeaderListagem";
import { Conversa } from "../../../types/conversa.d";
interface ConversaComponentProps {
    conversaSelecionada: Conversa | null;
    conversas: Array<Conversa>;
    setConversaSelecionada: React.Dispatch<React.SetStateAction<Conversa | null>>
    setConversas: React.Dispatch<React.SetStateAction<Array<Conversa>>>
}

export const ListagemConversa = ({ conversaSelecionada, conversas, setConversaSelecionada, setConversas }: ConversaComponentProps) => {
    const [pesquisaConversa, setPesquisaConversa] = useState<string>('');
    const [conversasFiltradas, setConversasFiltradas] = useState<Conversa[]>([]);

    const handleConversationClick = (converaId: number) => {
        setConversas((prevConversas) =>
            prevConversas.map((conversas) => {
                if (conversas.id === converaId) {
                    setConversaSelecionada(conversas);
                    return { ...conversas, mensagensPendentes: 0 }
                } else return conversas
            })
        );

    };

    useEffect(() => {
        if (!pesquisaConversa.trim())
            setConversasFiltradas(conversas);
        else {
            const termo = pesquisaConversa.toLowerCase();
            const conversasFiltradas = conversas.filter((conversa) => {
                const nomeContato = conversa.contato?.nome.toLowerCase();
                const numeroContato = conversa.contato?.numero?.replace(/\D/g, '');
                return nomeContato?.includes(termo) || numeroContato?.includes(termo);
            });
            setConversasFiltradas(conversasFiltradas);
        }
    }, [pesquisaConversa, conversas]);

    return (
        <>
            <HeaderComponent
                titulo="Conversas"
                pesquisa={pesquisaConversa}
                setPesquisa={setPesquisaConversa}
                inputAtivo={true}
            />

            {conversasFiltradas.length > 0 ? (
                conversasFiltradas.map((conversa) => (
                    <div
                        key={conversa.id}
                        onClick={() => handleConversationClick(conversa.id)}
                        className={`p-4 cursor-pointer flex items-center space-x-4  ${conversaSelecionada?.id === conversa.id ? 'bg-blue-100' : 'bg-white'} hover:bg-blue-50 transition`}
                    >
                        <img
                            src={conversa.contato?.foto ?? './imagens/user.png'}
                            alt="Perfil"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 text-left truncate">
                            <h3 className="text-md font-medium truncate">{conversa.contato?.nome}</h3>
                            <p className="text-sm text-gray-500 truncate">{conversa.ultimaMensagem?.texto}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className="text-xs text-gray-500">
                                {conversa.ultimaMensagem?.dataEnvio}
                            </div>
                            {conversa.mensagensPendentes > 0 && (
                                <div className="text-xs bg-red-500 text-white rounded-full px-2">
                                    {conversa.mensagensPendentes}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500 py-4">
                    Nenhuma conversa encontrada com o termo.
                </div>
            )}
        </>
    );
};
