import { Contato } from '../../types/Mensagem.d';
import { formatarTelefone } from '../../utils/formatar';

interface ContatoComponentProps {
    listaContatos: Array<Contato>;
    ClickCriarConversa: (contatoId?: number) => void;
}

export const CardContato = ({ listaContatos = [], ClickCriarConversa }: ContatoComponentProps) => {

    return (
        <div>
            {listaContatos.length > 0 ? (
                listaContatos.map((contato) => (
                    <div
                        key={contato.id}
                        onClick={() => ClickCriarConversa(contato.id)}
                        className="p-4 cursor-pointer flex items-center space-x-4 hover:bg-blue-50 transition"
                    >
                        <img
                            src={contato?.foto || '/imagens/user.png'}
                            alt="Perfil"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 text-left">
                            <h3 className="font-medium">{contato.nome}</h3>
                            <h4>{formatarTelefone(contato.numero)}</h4>
                        </div>
                    </div>
                ))
            ) : (
                <p>Nenhum contato disponível.</p>
            )}
        </div>
    );
};
