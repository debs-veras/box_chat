import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { Menssagem } from '../../types/Mensagem.d';
import { useEffect } from 'react';

interface MenssagemComponentProps {
    menssagem: Menssagem[];
    menssagemEndRef: React.RefObject<HTMLDivElement>;
    userId: string;
}

export const CardMenssagem = ({ menssagem, menssagemEndRef, userId }: MenssagemComponentProps) => {

    useEffect(() => {
        menssagemEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [menssagem]);

    return (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto barraRolagem">
            {menssagem.map((menssagem, index) => (
                <div
                    ref={menssagemEndRef}
                    key={index}
                    className={`flex ${menssagem.remetente === userId ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`px-3 py-1 rounded-lg max-w-[50%] shadow-md text-start ${menssagem.remetente === userId ? 'bg-[#D9FDD3]' : 'bg-white'}`}
                    >
                        <p>{menssagem.texto}</p>
                        <div className='flex items-center justify-center gap-2'>
                            <div className="text-xs text-gray-500 w-full text-end pt-1">{menssagem.horario}</div>
                            {menssagem.data_visualizacao ? (
                                <FontAwesomeIcon icon={faCheckDouble} color="blue" />
                            ) : menssagem.data_recebimento ? (
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
