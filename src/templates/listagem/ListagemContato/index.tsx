import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Contato } from "../../../types/contato.d";
import { formatarTelefone } from '../../../utils/formatar';
import { faEdit } from "@fortawesome/free-solid-svg-icons";

interface ContatoComponentProps {
    listaContatos: Array<Contato>;
    ClickCriarConversa: (contatoId?: number) => void;
    onClick: (contato: Contato) => void;
}

export const ListagemContato = ({ listaContatos = [], ClickCriarConversa, onClick }: ContatoComponentProps) => {

    return (
        <>
            {listaContatos.length > 0 ? (
                listaContatos.map((contato) => (
                    <div
                        key={contato.id}
                        className="p-4  flex items-center space-x-4 hover:bg-blue-50 transition"
                    >
                        <img
                            src={contato?.foto || '/imagens/user.png'}
                            alt="Perfil"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 text-left cursor-pointer" onClick={() => ClickCriarConversa(contato.id)}>
                            <h3 className="font-medium">{contato.nome}</h3>
                            <h4>{formatarTelefone(contato.numero)}</h4>
                        </div>
                        <FontAwesomeIcon
                            icon={faEdit}
                            size="lg"
                            color='#54656F'
                            className="cursor-pointer transition-all duration-300"
                            onClick={() => onClick(contato) }
                        />
                    </div>
                ))
            ) : (
                <p>Nenhum contato disponível.</p>
            )}
        </>
    );
};
