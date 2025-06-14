import { useEffect, useState } from "react";
import { ListagemContato } from "../../templates/listagem/ListagemContato";
import { ListagemConversa } from "../../templates/listagem/ListagemConversa";
import { Menu } from "../../layout/Menu";
import { ModelosMensagem } from "../../templates/pages/ModelosMensagem";
import { ChatDeMensagem } from "../../templates/pages/ChatDeMensagem";
// Types
import { itensMenu } from "../../types/itensMenu.d";
import { ModeloMensagem } from "../../types/modeloMensagem";
import { Conversa } from "../../types/Conversa.d";
import { getUsuarioId } from "../../utils/gerarIdAleatorio";
import socket from "../../services/socket";

export const Chat = () => {
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<itensMenu>("conversas");

  const [modelos, setModelos] = useState<ModeloMensagem[]>([
    {
      id: 1,
      titulo: "Saudação Pessoal",
      conteudo: "Olá {nome}, como posso ajudar você hoje?",
      tags: []
    },
    {
      id: 2,
      titulo: "Confirmação de Pedido",
      conteudo: "Olá {nome}, seu pedido foi confirmado com sucesso!",
      tags: ["{nome}"],
    },
  ]);

  useEffect(() => {
    const id = getUsuarioId();
    socket.emit("registrar-usuario", id);
  }, []);

  return (
    <div className="mx-auto py-[1rem] px-[2rem] text-center bg-gradient-to-b from-[#00A884] to-[#DAD7D3] via-[#DAD7D3] h-screen">
      <div className="flex h-[95vh] max-w-[100rem] w-full m-auto rounded-xl overflow-hidden shadow-lg">
        <div
          className={`bg-[#F0F2F5] flex flex-col transition-all duration-300 ${
            isMenuOpen && activeSection != "modeloMensagem"
              ? "lg:w-[25%] md:w-[50%] w-full"
              : "sm:w-[5%] w-[15%]"
          }`}
        >
          <div className="flex max-w-full h-full">
            <Menu
              isMenuOpen={isMenuOpen}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              setIsMenuOpen={setIsMenuOpen}
            />

            {activeSection != "modeloMensagem" && (
              <div
                className={`flex-1 h-full bg-white overflow-y-auto overflow-x-hidden barraRolagem transition-opacity duration-300 ${
                  isMenuOpen ? "opacity-100" : "opacity-0 hidden"
                }`}
                id="id-do-container"
              >
                {activeSection == "conversas" && (
                  <ListagemConversa
                    conversaSelecionada={conversaSelecionada}
                    setConversaSelecionada={setConversaSelecionada}
                  />
                )}

                {activeSection == "contatos" && (
                  <ListagemContato
                    setConversaSelecionada={setConversaSelecionada}
                    setActiveSection={setActiveSection}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className={`sm:flex sm:flex-col bg-[#EFEAE2] transition-all duration-300 ${
            isMenuOpen && activeSection != "modeloMensagem"
              ? "lg:w-[75%] hidden"
              : "w-full flex flex-col"
          }`}
        >
          {!conversaSelecionada &&
            (activeSection == "conversas" || activeSection == "contatos") && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-600">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Nenhuma conversa selecionada no momento
                </h3>
                <p className="mt-4 text-lg text-gray-500">
                  Você não selecionou uma conversa. Selecione uma conversa à
                  esquerda para começar agora e conecte-se!
                </p>
              </div>
            )}

          {conversaSelecionada &&
            (activeSection == "conversas" || activeSection == "contatos") && (
              <ChatDeMensagem
                activeSection={activeSection}
                conversaSelecionada={conversaSelecionada}
              />
            )}

          {activeSection == "modeloMensagem" && (
            <ModelosMensagem modelos={modelos} setModelos={setModelos} />
          )}
        </div>
      </div>
    </div>
  );
};
