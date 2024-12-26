import { useState } from 'react';
import { ListagemContato } from '../../templates/listagem/ListagemContato';
import { Menu } from '../../components/Menu';
import { ListagemConversa } from '../../templates/listagem/ListagemConversa';
import { Configuracoes } from '../../templates/listagem/Configuracoes';
import { DadosConta } from '../../templates/pages/DadosConta';
import { ConversaListagem } from '../../types/conversa.d';
import { itensMenu } from '../../types/itensMenu.d';
import { ModelosMensagem } from '../../templates/pages/ModelosMensagem';
import { ModeloMensagem } from '../../types/modeloMensagem';
import { ChatDeMensagem } from '../../templates/pages/ChatDeMensagem';
import { ListagemGrupoContato } from '../../templates/listagem/ListagemGrupoContato';
import { GruposDeContatos } from '../../templates/pages/GruposDeContatos';
import { GrupoDeContato } from '../../types/grupoDeContatos';

export const Chat = () => {
    const [conversaSelecionada, setConversaSelecionada] = useState<ConversaListagem | null>(null);
    const [grupoContatoSelecionado, setGrupoContatoSelecionado] = useState<GrupoDeContato | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isAtivaGrupoContato, setIsAtivaGrupoContato] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<itensMenu>('conversas');

    const [modelos, setModelos] = useState<ModeloMensagem[]>([
        {
            id: 1,
            titulo: "Saudação Pessoal",
            conteudo: "Olá {nome}, como posso ajudar você hoje?",
            tags: ["{nome}"],
        },
        {
            id: 2,
            titulo: "Confirmação de Pedido",
            conteudo: "Olá {nome}, seu pedido #{numero} foi confirmado com sucesso!",
            tags: ["{nome}", "{numero}"],
        },
    ]);

    return (
        <div className="mx-auto py-[1rem] px-[2rem] text-center bg-gradient-to-b from-[#00A884] to-[#DAD7D3] via-[#DAD7D3] h-screen">
            <div className="flex h-[95vh] max-w-[100rem] w-full m-auto rounded-xl overflow-hidden shadow-lg">
                <div className={`bg-[#F0F2F5] flex flex-col transition-all duration-300 ${(isMenuOpen && activeSection != 'modeloMensagem') ? 'lg:w-[25%] md:w-[50%] w-full' : 'sm:w-[5%] w-[15%]'}`}>
                    <div className='flex max-w-full h-full'>
                        <Menu
                            isMenuOpen={isMenuOpen}
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                            setIsMenuOpen={setIsMenuOpen}
                        />

                        {activeSection != 'modeloMensagem' &&
                            <div className={`flex-1 h-full bg-white overflow-y-auto overflow-x-hidden barraRolagem transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 hidden'}`}  id="id-do-container">
                                {activeSection == 'conversas' &&
                                    <ListagemConversa conversaSelecionada={conversaSelecionada} setConversaSelecionada={setConversaSelecionada} />
                                }

                                {activeSection == 'contatos' &&
                                    <ListagemContato
                                        setConversaSelecionada={setConversaSelecionada}
                                        setActiveSection={setActiveSection}
                                    />
                                }

                                {activeSection === 'gruposContatos' && (
                                    <ListagemGrupoContato
                                        setGrupoSelecionado={setGrupoContatoSelecionado}
                                        grupoSelecionado={grupoContatoSelecionado}
                                        setIsAtivaGrupoContato={setIsAtivaGrupoContato}
                                    />
                                )}

                                {activeSection == 'settings' && <Configuracoes />}
                            </div>
                        }
                    </div>
                </div>

                <div className={`sm:flex sm:flex-col bg-[#EFEAE2] transition-all duration-300 ${isMenuOpen && activeSection != 'modeloMensagem' ? 'lg:w-[75%] hidden' : 'w-full flex flex-col'}`}>

                    {!conversaSelecionada && (activeSection == 'conversas' || activeSection == 'contatos') && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-600">
                            <h3 className="text-2xl font-semibold text-gray-800">
                                Nenhuma conversa selecionada no momento
                            </h3>
                            <p className="mt-4 text-lg text-gray-500">
                                Você não selecionou uma conversa. Selecione uma conversa à esquerda para começar agora e conecte-se!
                            </p>
                        </div>
                    )}

                    {activeSection == 'settings' && <DadosConta />}

                    {conversaSelecionada && (activeSection == 'conversas' || activeSection == 'contatos') &&
                        <ChatDeMensagem activeSection={activeSection} conversaSelecionada={conversaSelecionada}  />
                    }

                    {isAtivaGrupoContato && (activeSection == 'gruposContatos') &&
                        <GruposDeContatos grupoDeContatoSelecionado={grupoContatoSelecionado} />
                    }

                    {activeSection == 'modeloMensagem' && <ModelosMensagem modelos={modelos} setModelos={setModelos} />}
                </div>
            </div>
        </div>

    );
};
