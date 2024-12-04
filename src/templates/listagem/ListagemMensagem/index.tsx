import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { Mensagem } from '../../../types/mensagem.d';
import { useEffect } from 'react';

interface MensagemComponentProps {
    mensagem: Mensagem[];
    mensagemEndRef: React.RefObject<HTMLDivElement>;
    userId: string;
}

export const ListagemMensagem = ({ mensagem, mensagemEndRef, userId }: MensagemComponentProps) => {

    useEffect(() => {
        mensagemEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensagem]);

    return (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto barraRolagem">
            {mensagem.map((mensagem, index) => (
                <div
                    ref={mensagemEndRef}
                    key={index}
                    className={`flex ${mensagem.remetente === userId ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`px-3 py-1 rounded-lg max-w-[50%] shadow-md text-start ${mensagem.remetente === userId ? 'bg-[#D9FDD3]' : 'bg-white'}`}
                    >
                        <p>{mensagem.texto}</p>
                        <div className='flex items-center justify-center gap-2'>
                            <div className="text-xs text-gray-500 w-full text-end pt-1">{mensagem.horario}</div>
                            {mensagem.data_visualizacao ? (
                                <FontAwesomeIcon icon={faCheckDouble} color="blue" />
                            ) : mensagem.data_recebimento ? (
                                <FontAwesomeIcon icon={faCheckDouble} />
                            ) : (
                                <FontAwesomeIcon icon={faCheck} />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
