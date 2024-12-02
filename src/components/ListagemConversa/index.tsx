import { Conversa } from '../../types/Conversa.d';

interface ConversaComponentProps {
    conversaAtiva: number | null;
    conversasFiltradas: Conversa[];
    handleConversationClick: (conversationId?: number) => void;
}

export const ListagemConversa = ({ conversasFiltradas, conversaAtiva, handleConversationClick }: ConversaComponentProps) => {

    return (
        conversasFiltradas.length > 0 ? (
            conversasFiltradas.map((conversa) => (
                <div
                    key={conversa.id}
                    onClick={() => handleConversationClick(conversa.id)}
                    className={`p-4 cursor-pointer flex items-center space-x-4  ${conversaAtiva === conversa.id ? 'bg-blue-100' : 'bg-white'} hover:bg-blue-50 transition`}
                >
                    <img
                        src={conversa.contato.foto ?? './imagens/user.png'}
                        alt="Perfil"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 text-left truncate">
                        <h3 className="text-md font-medium truncate">{conversa.contato.nome}</h3>
                        <p className="text-sm text-gray-500 truncate">{conversa.ultimaMensagem?.texto}</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <div className="text-xs text-gray-500">
                            {conversa.ultimaMensagem?.data_envio}
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
        )
    );
};
