import { useState } from 'react';
import { ListagemContato } from '../../templates/listagem/ListagemContato';
import { Menu } from '../../components/Menu';
import { ListagemConversa } from '../../templates/listagem/ListagemConversa';
import { Configuracoes } from '../../templates/listagem/Configuracoes';
import { Contato } from '../../types/contato.d';
import { DadosConta } from '../../templates/pages/DadosConta';
import { Conversa } from '../../types/conversa.d';
import { itensMenu } from '../../types/itensMenu.d';
import { ModelosMensagem } from '../../templates/pages/ModelosMensagem';
import { ModeloMensagem } from '../../types/modeloMensagem';
import { ChatDeMensagem } from '../../templates/pages/ChatDeMensagem';
import { ListagemGrupoContato } from '../../templates/listagem/ListagemGrupoContato';
import { grupoDeMensagem } from '../../types/grupoDeMensagem.d';

export const Chat = () => {
    const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const [activeSection, setActiveSection] = useState<itensMenu>('conversas');

    const [conversas, setConversas] = useState<Conversa[]>([
        {
            id: 100,
            contato: {
                id: 100,
                nome: 'KillJoy',
                foto: '/images.jpeg',
                numero: '5588992531384'
            },
            ultimaMensagem: {
                remetente: 'Killjoy',
                texto: 'vamos jogar mais tarde?',
                horario: '12:45',
                dataEnvio: '12:45',
                dataRecebimento: '12:45',
                dataVisualizacao: ''
            },
            mensagensPendentes: 1
        },
        {
            id: 200,
            contato: {
                id: 200,
                nome: 'Raze',
                foto: '/imagens/users/raze.webp',
                numero: '558892799971'
            },
            ultimaMensagem: {
                remetente: 'Killjoy',
                texto: 'blz?',
                horario: '12:45',
                dataEnvio: '12:45',
                dataRecebimento: '12:45',
                dataVisualizacao: ''
            },
            mensagensPendentes: 3

        }
    ])

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

    const [grupoAtivo, setGrupoAtivo] = useState<grupoDeMensagem | null>(null);

    const [gruposDeContatos, setGruposDeContatos] = useState<Array<grupoDeMensagem>>([
        {
            id: 1,
            nome: 'Amigos',
            membros: [
                { id: 1, nome: 'KillJoy', foto: '/images.jpeg', numero: '88992531384' },
                { id: 2, nome: 'Raze', foto: '/imagens/users/raze.webp', numero: '' }
            ]
        },
        {
            id: 2,
            nome: 'Família',
            membros: [
                { id: 3, nome: 'Brimstone', foto: '/imagens/users/brimstone.jpg', numero: '88992531385' }
            ]
        }
    ]);

    const handleGrupoClick = (grupoSelecionado: grupoDeMensagem) => {
        setGrupoAtivo(grupoSelecionado);
        if (grupoSelecionado) {
            const existeConversa = conversas.find(convo => convo.grupo?.id === grupoSelecionado.id);

            if (existeConversa) setConversaSelecionada(existeConversa);
            else {
                const novaConversa: Conversa = {
                    id: Date.now(),
                    grupo: grupoSelecionado,
                    ultimaMensagem: {
                        remetente: '',
                        texto: '',
                        horario: '',
                        dataEnvio: '',
                        dataRecebimento: '',
                        dataVisualizacao: ''
                    },
                    mensagensPendentes: 0
                };
                console.log(novaConversa);

                setConversas(prevConversas => [...prevConversas, novaConversa]);
                setConversaSelecionada(novaConversa);
            }
        }
    };

    const clickCriarConversa = (contato?: Contato) => {
        let conversa = conversas.find(convo => convo.contato?.id == contato?.id);
        if (!conversa) {
            conversa = {
                id: Date.now(),
                contato: contato!,
                ultimaMensagem: {
                    remetente: '',
                    texto: '',
                    horario: '',
                    dataEnvio: '',
                    dataRecebimento: '',
                    dataVisualizacao: ''
                },
                mensagensPendentes: 0
            };
            setConversas(prevConversations => [...prevConversations, conversa!]);
        }
        setConversaSelecionada(conversa);
        setActiveSection('conversas');
    };

    const toggleMenuCollapse = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <div className="mx-auto py-[1rem] px-[2rem] text-center bg-gradient-to-b from-[#00A884] to-[#DAD7D3] via-[#DAD7D3] h-screen">
            <div className="flex h-[95vh] max-w-[100rem] w-full m-auto rounded-xl overflow-hidden shadow-lg">
                <div className={`bg-[#F0F2F5] flex flex-col transition-all duration-300 ${(isMenuOpen && activeSection != 'modeloMensagem') ? 'lg:w-[25%] md:w-[50%] w-full' : 'sm:w-[5%] w-[15%]'}`}>
                    <div className='flex max-w-full h-full'>
                        <Menu
                            isMenuOpen={isMenuOpen}
                            activeSection={activeSection}
                            toggleMenuCollapse={toggleMenuCollapse}
                            setActiveSection={setActiveSection}
                            setIsMenuOpen={setIsMenuOpen}
                        />

                        {activeSection != 'modeloMensagem' &&
                            <div className={`flex-1 h-full bg-white overflow-y-auto overflow-x-hidden barraRolagem transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                {activeSection == 'conversas' &&
                                    <ListagemConversa
                                        conversaSelecionada={conversaSelecionada}
                                        conversas={conversas}
                                        setConversaSelecionada={setConversaSelecionada}
                                        setConversas={setConversas}
                                    />
                                }

                                {activeSection == 'contatos' &&
                                    <ListagemContato ClickCriarConversa={clickCriarConversa} />
                                }

                                {activeSection === 'gruposContatos' && (
                                    <ListagemGrupoContato gruposDeContatos={gruposDeContatos} onSelectGrupo={handleGrupoClick} />
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
                        <ChatDeMensagem activeSection={activeSection} conversaSelecionada={conversaSelecionada} modelos={modelos} setConversas={setConversas} />
                    }

                    {grupoAtivo && (
                        <></>
                    )}

                    {activeSection == 'modeloMensagem' && <ModelosMensagem modelos={modelos} setModelos={setModelos} />}
                </div>
            </div>
        </div>

    );
};
