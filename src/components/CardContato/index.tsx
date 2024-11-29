import { Contato } from '../../types/Mensagem.d';

interface ContatoComponentProps {
    contatos: Contato[];
    ClickCriarConversa: (contatoId?: number) => void;
}

export const CardContato = ({ contatos, ClickCriarConversa }: ContatoComponentProps) => {

    return (
        contatos.map((contato) => (
            <div
                key={contato.id}
                onClick={() => ClickCriarConversa(contato.id)}
                className="p-4 cursor-pointer flex items-center space-x-4 hover:bg-blue-50 transition"
            >
                <img
                    src={contato.foto}
                    alt="Perfil"
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 text-left">
                    <h3 className="text-md font-medium">{contato.nome}</h3>
                </div>
            </div>
        ))
    );
};
