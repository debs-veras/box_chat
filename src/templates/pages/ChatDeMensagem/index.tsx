import { useEffect, useRef, useState } from "react";
import { Mensagem } from "../../../types/Mensagem.d";
import { itensMenu } from "../../../types/itensMenu.d";
import { Conversa } from "../../../types/Conversa.d";
import socket from "../../../services/socket";
import { InputEnvioMensagem } from "../../../components/InputEnvioMensagem";
import { ListagemMensagem } from "../../listagem/ListagemMensagem";

interface ChatDeMensagemProps {
  activeSection: itensMenu;
  conversaSelecionada: Conversa | null;
}

export const ChatDeMensagem = ({ activeSection, conversaSelecionada }: ChatDeMensagemProps) => {
  const mensagemEndRef = useRef<HTMLDivElement>(null);
  const [mensagem, setMensagem] = useState<Mensagem[]>([]);

  const enviarMensagem = async (texto: string): Promise<void> => {
    if (!texto.trim() || !conversaSelecionada) return;
    const de = sessionStorage.getItem("usuarioId");
    const para = conversaSelecionada.usuarioId;
    if (!de || !para) return;

    const novaMensagem = {
      de,
      para,
      conteudo: texto,
    };

    socket.emit("chat message", novaMensagem);

    setTimeout(() => {
      mensagemEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (!conversaSelecionada) {
      setMensagem([]);
      return;
    }

    const meuUsuario = sessionStorage.getItem("usuarioId");
    if (!meuUsuario) return;

    socket.emit("carregar-conversa", {
      usuarioA: meuUsuario,
      usuarioB: conversaSelecionada.usuarioId,
    });

    socket.on("conversa-carregada", ({ mensagens }) => {
      setMensagem(mensagens);
      setTimeout(() => {
        mensagemEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    socket.on("chat message", (novaMensagem) => {
      if (conversaSelecionada && (novaMensagem.de === conversaSelecionada.usuarioId ||  novaMensagem.para === conversaSelecionada.usuarioId)) {
        setMensagem((msgs) => [
          ...msgs,
          {
            ...novaMensagem,
            timestamp: novaMensagem.timestamp ?? new Date().toISOString(),
          },
        ]);
        setTimeout(() => {
          mensagemEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    });

    return () => {
      socket.off("conversa-carregada");
      socket.off("chat message");
    };
  }, [conversaSelecionada]);
  return (
    <>
      <div className="flex items-center justify-between p-4 bg-[#F0F2F5] shadow-sm">
        <div className="flex items-center space-x-4">
          <img
            src={"imagens/user.png"}
            alt="Perfil"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col items-start">
            <span className="text-lg">{conversaSelecionada?.usuarioId}</span>
          </div>
        </div>
      </div>

      <ListagemMensagem mensagem={mensagem} mensagemEndRef={mensagemEndRef} />

      <InputEnvioMensagem
        activeSection={activeSection}
        conversaSelecionada={conversaSelecionada}
        enviarMensagem={enviarMensagem}
      />
    </>
  );
};
