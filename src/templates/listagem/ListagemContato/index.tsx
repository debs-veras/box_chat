import { useEffect, useState } from "react";
import { HeaderComponent } from "../../../layout/HeaderListagem";
import { itensMenu } from "../../../types/itensMenu.d";
import socket from "../../../services/socket";
import { Conversa } from "../../../types/Conversa.d";

interface ContatoComponentProps {
  setConversaSelecionada: React.Dispatch<React.SetStateAction<Conversa | null>>;
  setActiveSection: React.Dispatch<React.SetStateAction<itensMenu>>;
}

export const ListagemContato = ({setActiveSection }: ContatoComponentProps) => {
  const [pesquisaContato, setPesquisaContato] = useState<string>("");
  const [usuariosOnline, setUsuariosOnline] = useState<string[]>([]);

  const clickCriarConversa = (usuarioId: string) => {
    const meuUsuario = sessionStorage.getItem("usuarioId");
 
    if (!meuUsuario) return;
    socket.emit("carregar-conversa", {
      usuarioA: meuUsuario,
      usuarioB: usuarioId,
    });
    
    setActiveSection("conversas");
  };

  useEffect(() => {
    socket.emit("solicitar-usuarios-online");
    socket.on("usuarios-online", (lista: string[]) => {
      setUsuariosOnline(lista);
    });

    return () => {
      socket.off("usuarios-online");
    };
  }, []);

  const usuariosFiltrados = usuariosOnline.filter((usuario) =>
    usuario.toLowerCase().includes(pesquisaContato.toLowerCase())
  );

  return (
    <>
      <HeaderComponent
        titulo="Contatos Online"
        pesquisa={pesquisaContato}
        setPesquisa={setPesquisaContato}
        inputAtivo={true}
      />

      {usuariosFiltrados.length > 0 ? (
        usuariosFiltrados.map((usuario) => (
          <div
            key={usuario}
            className="p-4 flex items-center space-x-4 hover:bg-gray-100 transition"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-lg font-semibold text-green-800">
              {usuario.charAt(0).toUpperCase() || "?"}
            </div>
            <div
              className="flex-1 text-left cursor-pointer"
              onClick={() => clickCriarConversa(usuario)}
            >
              <h3 className="font-medium text-gray-900">{usuario}</h3>
              <span className="text-green-500 text-xs">● online</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 px-4 py-2">Nenhum usuário online.</p>
      )}
    </>
  );
};
