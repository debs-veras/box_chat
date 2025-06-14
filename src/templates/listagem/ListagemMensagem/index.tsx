import { Mensagem } from '../../../types/Mensagem.d';
import { useEffect } from 'react';
import { formatarDataHora } from '../../../utils/formatar';

interface MensagemComponentProps {
    mensagem: Mensagem[];
    mensagemEndRef: React.RefObject<HTMLDivElement>;
}

export const ListagemMensagem = ({ mensagem, mensagemEndRef }: MensagemComponentProps) => {
    const userId = sessionStorage.getItem("usuarioId");
    
    useEffect(() => {
        mensagemEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensagem]);

    return (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto barraRolagem">
            {mensagem.map((mensagem, index) => (
                <div
                    ref={mensagemEndRef}
                    key={index}
                    className={`flex ${mensagem.para !== userId ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`px-3 py-1 rounded-lg max-w-[50%] shadow-md text-start ${mensagem.para !== userId ? 'bg-[#D9FDD3]' : 'bg-white'}`}
                    >
                        <p>{mensagem.conteudo}</p>
                        <div className='flex items-center justify-center gap-2'>
                            <div className="text-xs text-gray-500 w-full text-end pt-1">{formatarDataHora(mensagem.timestamp ?? '')}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
