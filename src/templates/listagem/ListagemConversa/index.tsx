import { useEffect, useState } from "react";
import { HeaderComponent } from "../../../layout/HeaderListagem";
import { Conversa } from "../../../types/Conversa.d";
import { formatarDataHora } from "../../../utils/formatar";
import socket from "../../../services/socket";

interface ConversaComponentProps {
  conversaSelecionada: Conversa | null;
  setConversaSelecionada: React.Dispatch<React.SetStateAction<Conversa | null>>;
}

export const ListagemConversa = ({conversaSelecionada, setConversaSelecionada, }: ConversaComponentProps) => {
  const [pesquisaConversa, setPesquisaConversa] = useState("");
  const [listaConversas, setListaConversas] = useState<Conversa[]>([]);

  useEffect(() => {
    socket.emit("listar-conversas-ativas");
    socket.on("conversas-ativas", (conversas: Conversa[]) => {
      setListaConversas(conversas);
    });

    return () => {
      socket.off("conversas-ativas");
    };
  }, []);

  const handleConversationClick = (conversa: Conversa) => {
    setConversaSelecionada(conversa);
  };

  const conversasFiltradas = listaConversas.filter((conversa) =>
    conversa.usuarioId.toLowerCase().includes(pesquisaConversa.toLowerCase())
  );

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
            key={conversa.usuarioId}
            onClick={() => handleConversationClick(conversa)}
            className={`p-4 cursor-pointer flex items-center space-x-4 ${
              conversaSelecionada?.usuarioId === conversa.usuarioId
                ? "bg-blue-100"
                : "bg-white"
            } hover:bg-blue-50 transition`}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 text-lg font-semibold text-gray-800">
              {conversa.usuarioId.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="flex-1 text-left truncate">
              <h3 className="text-md font-medium truncate">{conversa.usuarioId}</h3>
              <p className="text-sm text-gray-500 truncate">{conversa.ultimaMensagem}</p>
            </div>
            <div className="text-xs text-gray-500">
              {formatarDataHora(conversa.dataUltimaMensagem)}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-4">
          Nenhuma conversa encontrada.
        </div>
      )}
    </>
  );
};
