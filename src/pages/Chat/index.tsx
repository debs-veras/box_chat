import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faSearch, faEllipsisV, faSmile, faPlus } from '@fortawesome/free-solid-svg-icons';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { ListagemMensagem } from '../../components/ListagemMensagem';
import { ListagemContato } from '../../components/ListagemContato';
import { getListContatos } from '../../services/contato';
import Loading from '../../components/Loading';
import { formatarTelefone } from '../../utils/formatar';
import { Menu } from '../../components/Menu';
import { ListagemConversa } from '../../components/ListagemConversa';
import Configuracoes from '../../components/Configuracoes';
import ModalCadastroContato from '../../components/ModalCadastroContato';
import { Contato } from '../../types/contato.d';
import { DadosConta } from '../../components/DadosConta';
import { Mensagem } from '../../types/mensagem.d';
import { Conversa } from '../../types/conversa.d';
import { itensMenu } from '../../types/itensMenu.d';

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
    const [activeSection, setActiveSection] = useState<itensMenu>('conversas');


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
        setNovaMensagem('');
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
        console.log(novoContato);
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
                    setNovaMensagem('');
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

    return (
        <div className="mx-auto py-[1rem] px-[2rem] text-center bg-gradient-to-b from-[#00A884] to-[#DAD7D3] via-[#DAD7D3] h-screen">
            <div className="flex h-[95vh] max-w-[100rem] w-full m-auto rounded-xl overflow-hidden shadow-lg">
                <div className={`bg-[#F0F2F5] flex flex-col transition-all duration-300 ${isMenuOpen ? 'lg:w-[25%] md:w-[50%] w-full' : 'sm:w-[5%] w-[15%]'}`}>
                    <div className='flex max-w-full h-full'>
                        <Menu
                            isMenuOpen={isMenuOpen}
                            settings={activeSection}
                            toggleMenuCollapse={toggleMenuCollapse}
                            toggleConversas={toggleConversas}
                            toggleContatos={toggleContatos}
                            toggleSettings={toggleSettings}
                        />

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

                            {activeSection != 'settings' && <>
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
                        </div>
                    </div>
                </div>
                <div className={`sm:flex sm:flex-col bg-[#EFEAE2] transition-all duration-300 ${isMenuOpen ? 'lg:w-[75%] hidden' : 'w-full flex flex-col'}`}>
                    {!conversaAtiva && activeSection != 'settings' ?
                        (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-600">
                                <h3 className="text-2xl font-semibold text-gray-800">
                                    Nenhuma conversa selecionada no momento
                                </h3>
                                <p className="mt-4 text-lg text-gray-500">
                                    Você não selecionou uma conversa. Selecione uma conversa à esquerda para começar agora e conecte-se!
                                </p>
                            </div>
                        )
                        :
                        (activeSection == 'settings' ? <DadosConta /> : (
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
                                        onChange={(e) => setNovaMensagem(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className="flex-1 border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={enviarMensagem}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-blue-700 transition"
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                                        <span>Enviar</span>
                                    </button>
                                </div>
                            </>
                        ))}
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
