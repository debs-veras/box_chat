import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faSearch, faEllipsisV, faSmile, faPlus } from '@fortawesome/free-solid-svg-icons';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { ListagemMensagem } from '../../templates/listagem/ListagemMensagem';
import { ListagemContato } from '../../templates/listagem/ListagemContato';
import { getListContatos } from '../../services/contato';
import Loading from '../../components/Loading';
import { formatarTelefone } from '../../utils/formatar';
import { Menu } from '../../components/Menu';
import { ListagemConversa } from '../../templates/listagem/ListagemConversa';
import Configuracoes from '../../components/Configuracoes';
import ModalCadastroContato from '../../templates/modal/ModalCadastroContato';
import { Contato } from '../../types/contato.d';
import { DadosConta } from '../../components/DadosConta';
import { Mensagem } from '../../types/mensagem.d';
import { Conversa } from '../../types/conversa.d';
import { itensMenu } from '../../types/itensMenu.d';
import ModelosMensagem from '../../components/ModelosMensagem';
import { ModeloMensagem } from '../../types/modeloMensagem';

export const Chat = () => {
    const [mensagem, setMensagem] = useState<Mensagem[]>([]);
    const [listaContatos, setListaContato] = useState<Array<Contato>>([]);
    const [novaMensagem, setNovaMensagem] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [userId] = useState<string>(Math.random().toString(36).substring(2));
    const mensagemEndRef = useRef<HTMLDivElement>(null);
    const [conversaAtiva, setConversaAtiva] = useState<number | null>(null);
    const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
    const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [salvando, setSalvando] = useState<boolean>(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [buscarConversa, setBuscarConversa] = useState<string>('');
    const [conversasFiltradas, setConversasFiltradas] = useState<Conversa[]>([]);
    const [showInput, setShowInput] = useState(false);
    const [activeSection, setActiveSection] = useState<itensMenu>('conversas');
    const [conversas, setConversas] = useState<Conversa[]>([
        {
            id: 1,
            contato: {
                id: 1,
                nome: 'KillJoy',
                foto: '/images.jpeg',
                numero: '88992531384'
            },
            ultimaMensagem: {
                remetente: 'Killjoy',
                texto: 'vamos jogar mais tarde?',
                horario: '12:45',
                data_envio: '12:45',
                data_recebimento: '12:45',
                data_visualizacao: ''
            },
            mensagensPendentes: 1
        },
        {
            id: 2,
            contato: {
                id: 2,
                nome: 'Raze',
                foto: '/imagens/users/raze.webp',
                numero: ''
            },
            ultimaMensagem: {
                remetente: 'Killjoy',
                texto: 'blz?',
                horario: '12:45',
                data_envio: '12:45',
                data_recebimento: '12:45',
                data_visualizacao: ''
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

    const [modelosFiltrados, setModelosFiltrados] = useState<ModeloMensagem[]>(modelos);

    const [isModalCadastroContatoOpen, setIsModalCadastroContatoOpen] = useState(false);

    const handleCloseModalCadastroContato = () => {
        setContatoSelecionado(null);
        setIsModalCadastroContatoOpen(false);
    };

    const toggleInput = () => {
        setShowInput((prev) => !prev);
    };

    const ClickCriarConversa = (contatoId?: number) => {
        const existeConversa = conversas.find(convo => convo.contato.id === contatoId);

        if (existeConversa) {
            setConversaAtiva(existeConversa.id);
            setConversaSelecionada(existeConversa);
        } else {
            const novaConversa: Conversa = {
                id: Date.now(),
                contato: listaContatos.find(contato => contato.id === contatoId)!,
                ultimaMensagem: {
                    remetente: '',
                    texto: '',
                    horario: '',
                    data_envio: '',
                    data_recebimento: '',
                    data_visualizacao: ''
                },
                mensagensPendentes: 0
            };
            setConversas(prevConversations => [...prevConversations, novaConversa]);
            setConversaAtiva(novaConversa.id);
            setConversaSelecionada(novaConversa);
        }
        toggleConversas();
    };

    const substituirTags = (texto: string, contato?: Contato): string => {
        setExibirModelos(false);
        return texto
            .replace(/{nome}/g, contato?.nome || "usuário")
            .replace(/{email}/g, contato?.email || "sem e-mail")
            .replace(/{numero}/g, contato?.numero || "desconhecido");
    };

    const enviarMensagem = () => {
        if (novaMensagem.trim() !== '') {
            const tempo = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const msg = {
                id: Date.now(),
                remetente: userId,
                texto: novaMensagem,
                horario: tempo,
                data_envio: tempo,
                data_recebimento: '',
                data_visualizacao: '',
            };

            setMensagem((prevMessages) => [...prevMessages, msg]);

            setConversas((prevConversas) =>
                prevConversas.map((conversa) =>
                    conversa.id === conversaAtiva
                        ? {
                            ...conversa,
                            ultimaMensagem: {
                                remetente: userId,
                                texto: novaMensagem,
                                horario: tempo,
                                data_envio: tempo,
                                data_recebimento: '',
                                data_visualizacao: '',
                            },
                            mensagensPendentes: 0
                        }
                        : conversa
                )
            );

            setNovaMensagem('');
        }
    };

    const handleSalvarContato = (novoContato: Contato) => {
        setListaContato((prevContatos) => {
            const existeContato = prevContatos.some((contato) => contato.id === novoContato.id);
            if (existeContato)
                return prevContatos.map((contato) =>
                    contato.id === novoContato.id ? novoContato : contato
                );
            else
                return [...prevContatos, novoContato];
        });

        handleCloseModalCadastroContato();
        setContatoSelecionado(null);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            enviarMensagem();
        }
    };

    const handleConversationClick = (converaId: number) => {
        setConversaAtiva(converaId);
        setConversas((prevConversas) =>
            prevConversas.map((conversas) => {
                if (conversas.id === converaId) {
                    setConversaSelecionada(conversas);
                    return { ...conversas, mensagensPendentes: 0 }
                } else return conversas
            })
        );
        setShowInput(false);
    };

    const handleContatoEdit = (contato: Contato) => {
        setIsModalCadastroContatoOpen(true);
        setContatoSelecionado(contato);
    };

    const toggleContatos = () => {
        setActiveSection('contatos');
        if (!isMenuOpen)
            setIsMenuOpen(true);
        carregaContatos();
    };

    const toggleConversas = () => {
        setActiveSection('conversas');
        if (!isMenuOpen)
            setIsMenuOpen(true);
    };

    const toggleSettings = () => {
        setActiveSection('settings');
        if (!isMenuOpen)
            setIsMenuOpen(true);
    };

    const toggleModelosMensagem = () => {
        setActiveSection("modeloMensagem");
        if (!isMenuOpen) setIsMenuOpen(true);
    };

    const toggleMenuCollapse = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleEmojiSelect = (emoji: any) => {
        setNovaMensagem(prev => prev + emoji.native);
    };

    const carregaContatos = async (): Promise<void> => {
        setLoading(true);
        const request = () => getListContatos();
        const response = await request();
        if (response.sucesso)
            setListaContato(response.dados);
        setLoading(false);
    };

    const [exibirModelos, setExibirModelos] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNovaMensagem(value);
        if (value.startsWith("/")) {
            const termoFiltro = value.slice(1).trim().toLowerCase();
            const modelosFiltrados = modelos.filter(modelo => modelo.titulo.toLowerCase().includes(termoFiltro));
            const modeloSelecionado = modelos.find(modelo => modelo.titulo.toLowerCase() === termoFiltro.toLowerCase());
            setModelosFiltrados(modelosFiltrados);
            if (modeloSelecionado) {
                const modeloComTagsSubstituídas = substituirTags(modeloSelecionado.conteudo, conversaSelecionada?.contato);
                setNovaMensagem(modeloComTagsSubstituídas);
            }
            setExibirModelos(true);
        } else {
            setExibirModelos(false);
        }
    };

    useEffect(() => {
        if (!buscarConversa.trim())
            setConversasFiltradas(conversas);
        else {
            const termo = buscarConversa.toLowerCase();
            const conversasFiltradas = conversas.filter((conversa) => {
                const nomeContato = conversa.contato.nome.toLowerCase();
                const numeroContato = conversa.contato.numero?.replace(/\D/g, '');
                return nomeContato.includes(termo) || numeroContato.includes(termo);
            });
            setConversasFiltradas(conversasFiltradas);
        }
    }, [buscarConversa, conversas]);

    useEffect(() => {
        setNovaMensagem('');
        setExibirModelos(false);
    }, [activeSection, conversaSelecionada]);

    return (
        <div className="mx-auto py-[1rem] px-[2rem] text-center bg-gradient-to-b from-[#00A884] to-[#DAD7D3] via-[#DAD7D3] h-screen">
            <div className="flex h-[95vh] max-w-[100rem] w-full m-auto rounded-xl overflow-hidden shadow-lg">
                <div className={`bg-[#F0F2F5] flex flex-col transition-all duration-300 ${(isMenuOpen && activeSection != 'modeloMensagem') ? 'lg:w-[25%] md:w-[50%] w-full' : 'sm:w-[5%] w-[15%]'}`}>
                    <div className='flex max-w-full h-full'>
                        <Menu
                            isMenuOpen={isMenuOpen}
                            activeSection={activeSection}
                            toggleMenuCollapse={toggleMenuCollapse}
                            toggleConversas={toggleConversas}
                            toggleContatos={toggleContatos}
                            toggleSettings={toggleSettings}
                            toggleModelosMensagem={toggleModelosMensagem}
                        />
                        {activeSection != 'modeloMensagem' &&
                            <div className={`flex-1 h-full bg-white overflow-y-auto overflow-x-hidden barraRolagem transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                <div className="p-5 text-left flex justify-between items-center">
                                    <h2 className="text-lg font-semibold"> {activeSection == 'contatos' ? 'Contatos' : activeSection == 'conversas' ? 'Conversas' : "Configuração"} </h2>
                                    {
                                        activeSection == 'contatos' &&
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            size="lg"
                                            color='#54656F'
                                            className="cursor-pointer transition-all duration-300"
                                            onClick={() => setIsModalCadastroContatoOpen(true)}
                                        />
                                    }
                                </div>

                                {activeSection != 'settings' &&
                                    <>
                                        <div className="px-4 flex items-center space-x-2 mb-5">
                                            <div className="relative flex-1">
                                                <FontAwesomeIcon
                                                    icon={faSearch}
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Pesquisar"
                                                    className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-md border-none focus:outline-none"
                                                    value={buscarConversa}
                                                    onChange={(e) => setBuscarConversa(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                }

                                {activeSection == 'contatos' &&
                                    <>
                                        {!loading ?
                                            <ListagemContato listaContatos={listaContatos} ClickCriarConversa={ClickCriarConversa} onClick={handleContatoEdit} /> : <Loading />
                                        }
                                    </>
                                }

                                {activeSection == 'conversas' &&
                                    <ListagemConversa
                                        conversaAtiva={conversaAtiva ?? null}
                                        conversasFiltradas={conversasFiltradas}
                                        handleConversationClick={(conversationId) => handleConversationClick(conversationId!)}
                                    />
                                }

                                {activeSection == 'settings' && <Configuracoes />}
                            </div>}

                    </div>
                </div>

                <div className={`sm:flex sm:flex-col bg-[#EFEAE2] transition-all duration-300 ${isMenuOpen && activeSection != 'modeloMensagem' ? 'lg:w-[75%] hidden' : 'w-full flex flex-col'}`}>
                    {!conversaAtiva && (activeSection == 'conversas' || activeSection == 'contatos') && (
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

                    {conversaAtiva && (activeSection == 'conversas' || activeSection == 'contatos') &&
                        <>
                            <div className="flex items-center justify-between p-4 bg-[#F0F2F5] shadow-sm">

                                <div className="flex items-center space-x-4">
                                    <img src={conversaSelecionada?.contato.foto ?? 'imagens/user.png'} alt="Perfil" className="w-12 h-12 rounded-full object-cover" />
                                    <div className='flex flex-col items-start'>
                                        <span className="text-lg">{conversaSelecionada?.contato.nome}</span>
                                        <span className="text-sm text-zinc-400">{formatarTelefone(conversaSelecionada?.contato.numero || '')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-2 relative">
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className={`${showInput ? 'absolute transform -translate-y-1/2 left-4 top-1/2 ' : 'relative'} cursor-pointer`}
                                        onClick={toggleInput}
                                    />
                                    <div
                                        className={`rounded px-2 py-1 transition-all duration-300 overflow-hidden ${showInput ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}
                                    >
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-2 bg-[#DAD7D3] rounded-md border-none focus:outline-none"
                                            placeholder="Digite sua busca"
                                        />
                                    </div>
                                    <FontAwesomeIcon icon={faEllipsisV} className="cursor-pointer" />
                                </div>
                            </div>

                            <ListagemMensagem mensagem={mensagem} mensagemEndRef={mensagemEndRef} userId={userId} />

                            <div className="flex items-center gap-2 p-4 bg-[#F0F2F5] shadow-lg flex-wrap">
                                <div className='flex gap-5 relative'>
                                    <FontAwesomeIcon icon={faPaperclip} className="text-gray-400 text-xl cursor-pointer hover:text-gray-500" />

                                    <FontAwesomeIcon
                                        icon={faSmile}
                                        size="lg"
                                        className="text-gray-700 text-xl cursor-pointer hover:text-gray-600"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    />

                                    {showEmojiPicker && (
                                        <div className="absolute bottom-10 left-0 z-10">
                                            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                                        </div>
                                    )}

                                </div>

                                <input
                                    type="text"
                                    placeholder="Digite uma mensagem"
                                    value={novaMensagem}
                                    onKeyDown={handleKeyPress}
                                    onChange={handleInputChange}
                                    className="flex-1 border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {exibirModelos && modelosFiltrados.length > 0 && (
                                    <div className="mt-2 p-2 border border-gray-300 rounded-lg shadow-md bg-white w-full">
                                        <ul className="space-y-2">
                                            {modelosFiltrados.map((modelo) => (
                                                <li
                                                    key={modelo.id}
                                                    className="cursor-pointer rounded-lg bg-gray-50 p-3 hover:bg-blue-50 transition-colors ease-in-out"
                                                    onClick={() => setNovaMensagem(substituirTags(modelo.conteudo, conversaSelecionada?.contato))}
                                                >
                                                    <div className="font-semibold text-lg text-blue-600">{modelo.titulo}</div>
                                                    <p className="text-sm text-gray-700 mt-1">{modelo.conteudo}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <button
                                    onClick={enviarMensagem}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-blue-700 transition"
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                                    <span>Enviar</span>
                                </button>
                            </div>
                        </>
                    }
                    {activeSection == 'modeloMensagem' && <ModelosMensagem modelos={modelos} setModelos={setModelos} />}
                </div>
            </div>

            <ModalCadastroContato
                isOpen={isModalCadastroContatoOpen}
                handleClose={handleCloseModalCadastroContato}
                salvando={salvando}
                onSave={handleSalvarContato}
                contato={contatoSelecionado}
            />
        </div>

    );
};
