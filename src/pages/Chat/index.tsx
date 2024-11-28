import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faSearch, faEllipsisV, faComments, faUser, faAngleLeft, faAngleRight, faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import "./styles.css";
import { Contato, Conversation, Menssagem } from '../../types/Mensagem.d';

const socket = io('http://localhost:3001');

export const Chat = () => {
    const [messages, setMessages] = useState<Menssagem[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    const [userId] = useState<string>(Math.random().toString(36).substring(2));
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [activeConversation, setActiveConversation] = useState<number | null>(null);
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: 1,
            contato: {
                id: 2,
                nome: 'KillJoy',
                foto: '/images.jpeg'
            },
            ultimaMensagem: {
                autor: 'Killjoy',
                menssagem: 'vamos jogar mais tarde?',
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
                foto: '/imagens/users/raze.webp'
            },
            ultimaMensagem: {
                autor: 'Killjoy',
                menssagem: 'blz?',
                horario: '12:45',
                data_envio: '12:45',
                data_recebimento: '12:45',
                data_visualizacao: ''
            },
            mensagensPendentes: 3

        }
    ]);

    const [statusMap, setStatusMap] = useState({});

    const [showContacts, setShowContacts] = useState(false);

    const [contacts] = useState<Contato[]>([
        { id: 1, nome: 'KillJoy', foto: '/images.jpeg' },
        { id: 2, nome: 'Raze', foto: '/imagens/users/raze.webp' },
        { id: 3, nome: 'Breach', foto: '/imagens/users/breach.jpg' }
    ]);

    // useEffect(() => {
    //     socket.on('chat message', (msg: Menssagem) => {
    //         setMessages((prevMessages) => [...prevMessages, msg]);
    //     });
    //     return () => {
    //         socket.off('chat message');
    //     };
    // }, []);

    // useEffect(() => {
    //     socket.on('chat message', (msg) => {
    //         setMessages((prevMessages) => [...prevMessages, msg]);
    //         setStatusMap((prev) => ({ ...prev, [msg.id]: 'recebida' }));
    //         socket.emit('message viewed', msg.id);
    //     });

    //     socket.on('message status', (statusUpdate) => {
    //         setStatusMap((prev) => ({ ...prev, [statusUpdate.messageId]: statusUpdate.status }));
    //     });



    //     return () => {
    //         socket.off('chat message');
    //         socket.off('message status');
    //     };
    // }, []);

    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const msg = {
                id: Date.now(),
                autor: userId,
                menssagem: newMessage,
                horario: time,
                data_envio: time,
                data_recebimento: '',
                data_visualizacao: '',
            };

            setMessages((prevMessages) => [...prevMessages, msg]);
            // socket.emit('chat message', { msg });

            setConversations((prevConversations) =>
                prevConversations.map((conversation) =>
                    conversation.id === activeConversation
                        ? {
                            ...conversation,
                            ultimaMensagem: {
                                autor: userId,
                                menssagem: newMessage,
                                horario: time,
                                data_envio: time,
                                data_recebimento: '',
                                data_visualizacao: '',
                            },
                            mensagensPendentes: 0
                        }
                        : conversation
                )
            );

            setStatusMap((prev) => ({ ...prev, [msg.id]: 'enviada' }));

            setNewMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleConversationClick = (conversationId: number) => {
        setActiveConversation(conversationId);
        setConversations((prevConversations) =>
            prevConversations.map((conversation) =>
                conversation.id === conversationId
                    ? { ...conversation, mensagensPendentes: 0 }
                    : conversation
            )
        );
    }; ''

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleContacts = () => {
        setShowContacts(true);
    };

    const toggleMenuCollapse = () => {
        setIsMenuCollapsed((prev) => !prev);
    };

    const toggleConversations = () => {
        setShowContacts(false);
    };
    return (
        <div className='background-chat'>
            <div className="flex h-[95vh] max-w-[100rem] w-full m-auto rounded-xl overflow-hidden shadow-lg">
                <div className="w-[25%] bg-[#F0F2F5] flex flex-col">
                    <div className='flex max-w-full h-full'>
                        <div className='h-full w-16 #F0F2F5 px-1 py-4 flex flex-col gap-8 items-center'>
                            <FontAwesomeIcon
                                icon={isMenuCollapsed ? faAngleRight : faAngleLeft}
                                size="lg"
                                color="#54656F"
                                onClick={toggleMenuCollapse}
                                className="cursor-pointer transition-transform duration-300 transform hover:scale-110"
                            />
                            <FontAwesomeIcon
                                icon={faComments}
                                size="lg"
                                color={showContacts ? "#54656F" : "#00A884"}
                                onClick={toggleConversations}
                                className={`cursor-pointer transition-all duration-300 ${!showContacts ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
                            />
                            <FontAwesomeIcon
                                icon={faUser}
                                size="lg"
                                color={showContacts ? "#00A884" : "#54656F"}
                                onClick={toggleContacts}
                                className={`cursor-pointer transition-all duration-300  ${showContacts ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
                            />
                        </div>

                        <div className="flex-1 h-full bg-white overflow-y-auto barraRolagem">
                            <div className="p-4 text-left">
                                <h2 className="text-lg font-semibold"> {showContacts ? 'Contatos' : 'Conversas'} </h2>
                            </div>

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
                                    />
                                </div>
                            </div>

                            {showContacts ? (
                                contacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        className="p-4 cursor-pointer flex items-center space-x-4 hover:bg-blue-50 transition"
                                    >
                                        <img
                                            src={contact.foto}
                                            alt="Perfil"
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1 text-left">
                                            <h3 className="text-md font-medium">{contact.nome}</h3>
                                        </div>
                                    </div>
                                ))
                            ) : (

                                conversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        onClick={() => handleConversationClick(conversation.id)}
                                        className={`p-4 cursor-pointer flex items-center space-x-4  ${activeConversation === conversation.id ? 'bg-blue-100' : 'bg-white'} hover:bg-blue-50 transition`}
                                    >
                                        <img
                                            src={conversation.contato.foto}
                                            alt="Perfil"
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1 text-left truncate">
                                            <h3 className="text-md font-medium truncate">{conversation.contato.nome}</h3>
                                            <p className="text-sm text-gray-500 truncate">{conversation.ultimaMensagem?.menssagem}</p>
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <div className="text-xs text-gray-500">
                                                {conversation.ultimaMensagem?.data_envio}
                                            </div>
                                            {conversation.mensagensPendentes > 0 && (
                                                <div className="text-xs bg-red-500 text-white rounded-full px-2">
                                                    {conversation.mensagensPendentes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-[75%] flex flex-col bg-[#EFEAE2]">
                    {
                        activeConversation == null ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-600">
                                <h3 className="text-2xl font-semibold text-gray-800">
                                    Nenhuma conversa ativa no momento
                                </h3>
                                <p className="mt-4 text-lg text-gray-500">
                                    Você ainda não iniciou nenhuma conversa. Selecione uma conversa à esquerda para começar agora e conecte-se!
                                </p>
                                <div className="mt-6">
                                    <button
                                        className="px-6 py-3 bg-[#00A884] text-white font-semibold rounded-lg hover:bg-[#099999] transition duration-300"
                                        onClick={() => { }}
                                    >
                                        Iniciar Conversa
                                    </button>
                                </div>
                            </div>
                        ) : <>
                            <div className="flex items-center justify-between p-4 bg-[#F0F2F5] shadow-sm">
                                {activeConversation && (
                                    <>
                                        <div className="flex items-center space-x-4">
                                            <img src="/images.jpeg" alt="Perfil" className="w-12 h-12 rounded-full object-cover" />
                                            <h1 className="text-lg">KillJoy</h1>
                                        </div>
                                        <div className="flex gap-6">
                                            <FontAwesomeIcon icon={faSearch} className="cursor-pointer" />
                                            <FontAwesomeIcon icon={faEllipsisV} className="cursor-pointer" />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex-1 p-4 space-y-4 overflow-y-auto barraRolagem">
                                {messages.map((message, index) => (
                                    <div
                                        ref={messagesEndRef}
                                        key={index}
                                        className={`flex ${message.autor === userId ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`px-3 py-1 rounded-lg max-w-[50%] shadow-md text-start ${message.autor === userId ? 'bg-[#D9FDD3]' : 'bg-white'}`}
                                        >
                                            <p>{message.menssagem}</p>
                                            <div className='flex items-center justify-center gap-2'>
                                                <div className="text-xs text-gray-500 w-full text-end pt-1">{message.horario}</div>
                                                {message.data_visualizacao ? (
                                                    <FontAwesomeIcon icon={faCheckDouble} color="blue" />
                                                ) : message.data_recebimento ? (
                                                    <FontAwesomeIcon icon={faCheckDouble} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faCheck} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 p-4 bg-[#F0F2F5] shadow-lg">
                                <FontAwesomeIcon icon={faPaperclip} className="text-gray-400 text-xl cursor-pointer hover:text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Digite uma mensagem"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="flex-1 border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-blue-700 transition"
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                                    <span>Enviar</span>
                                </button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};
