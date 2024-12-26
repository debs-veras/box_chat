import { Contato } from '../../../types/contato.d';
import { useEffect, useState } from 'react';
import useDebounce from '../../../hooks/useDebounce';
import { postListContatoFiltro } from '../../../services/contato';
import useToastLoading from '../../../hooks/useToastLoading';
import Formulario from '../../../components/Input';
import { useForm } from 'react-hook-form';
import { CadastroGruposDeContatos, GrupoDeContato } from '../../../types/grupoDeContatos';
import Tabela from '../../../components/Tabela';
import PaginacaoTabela from '../../../components/PaginacaoTabela';
import { baseFiltros } from '../../../types/baseEntity.d';
import EmptyPage from '../../../components/EmptyPage';
import { formatarTelefone } from '../../../utils/formatar';
import { postGrupo, putGrupo } from '../../../services/grupoContato';
import Botao from '../../../components/Button';
import ModalBase from '../../../components/ModalBase';

type PropsFiltros = {
    pesquisa: string;
};

interface GruposDeContatosComponentProps {
    grupoDeContatoSelecionado?: GrupoDeContato | null;
    setGrupoDeContatoSelecionado: React.Dispatch<React.SetStateAction<GrupoDeContato | null>>;
    isOpen: boolean;
    handleClose: () => void;
    carregaGruposContatos: Function;
}

export const ModalCAdastroGruposDeContatos = ({ grupoDeContatoSelecionado, setGrupoDeContatoSelecionado, isOpen, handleClose, carregaGruposContatos }: GruposDeContatosComponentProps) => {
    const [listaContatos, setListaContato] = useState<Contato[]>([]);
    const [selecionados, setSelecionados] = useState<number[]>([]);
    const [todosSelecionados, setTodosSelecionados] = useState(false);
    const toast = useToastLoading();
    const { register: registerFiltros, watch: watchFiltros, handleSubmit: handleSubmitFiltros } = useForm<PropsFiltros>();
    const { register: registerGrupoContatos, handleSubmit: handleSubmitGrupoContatos, reset: resetGrupoContatos } = useForm<CadastroGruposDeContatos>();
    const [loadingListagem, setLoadingListagem] = useState<boolean>(true);
    const [salvando, setSalvando] = useState<boolean>(false);
    const [paginaAtual, setPaginaAtual] = useState<number>(0)
    const [totalRegistros, setTotalRegistros] = useState<number>(0)
    const [totalPaginas, setTotalPaginas] = useState<number>(0)
    const registrosPorPagina: number = 3
    const watchUseEffect = watchFiltros();

    const toggleSelecionarTodos = () => {
        if (todosSelecionados) setSelecionados([]);
        else setSelecionados(listaContatos.map((contato) => contato.id));
        setTodosSelecionados(!todosSelecionados);
    };

    const toggleSelecionarContato = (id: number) => {
        setSelecionados((prevSelecionados) =>
            prevSelecionados.includes(id)
                ? prevSelecionados.filter((item) => item !== id)
                : [...prevSelecionados, id]
        );
    };

    const carregaContatos = async (pageSize: number = registrosPorPagina, currentPage: number = 0): Promise<void> => {
        try {
            let filtros: baseFiltros = {
                pageSize,
                currentPage
            }
            await handleSubmitFiltros((dadosForm) => {
                filtros = {
                    ...filtros,
                    pesquisa: dadosForm.pesquisa,
                }
            })();

            setLoadingListagem(true);
            const response = await postListContatoFiltro(filtros);
            if (response.sucesso) {
                setListaContato(response.dados.dados);
                setPaginaAtual(response.dados.currentPage)
                setTotalRegistros(response.dados.totalRegisters)
                setTotalPaginas(response.dados.totalPages)
            } else toast({ tipo: response.tipo, mensagem: response.mensagem });

            setLoadingListagem(false);
        } catch (error) {
            toast({ tipo: 'error', mensagem: 'Erro ao carregar contatos.' });
        }
    };

    async function cadastrarGrupoContatos(): Promise<void> {
        setSalvando(true);
        let dadosGrupo: CadastroGruposDeContatos;

        await handleSubmitGrupoContatos((dadosForm) => {
            dadosGrupo = {
                ...dadosForm,
                contatoIds: selecionados
            };
        })();

        const request = () => grupoDeContatoSelecionado?.id ? putGrupo(dadosGrupo) : postGrupo(dadosGrupo);
        const response = await request();

        if (response.sucesso) {
            carregaGruposContatos();
            toast({ tipo: 'success', mensagem: 'Grupo salvo com sucesso!' });
        }
        else {
            setGrupoDeContatoSelecionado(null);
            toast({ tipo: response.tipo, mensagem: response.mensagem })
        };

        handleClose();
        setSalvando(false);
    }

    async function carregarDadosGrupoContato() {
        setSelecionados(grupoDeContatoSelecionado?.contatoIds || []);
        resetGrupoContatos({ ...grupoDeContatoSelecionado });
    }

    const filtroDebounce = useDebounce(() => carregaContatos(), 500);

    useEffect(() => {
        setTodosSelecionados(selecionados.length === listaContatos.length);
    }, [selecionados, listaContatos]);

    useEffect(() => {
        filtroDebounce();
    }, []);

    useEffect(() => {
        const subscription = watchFiltros(() => filtroDebounce());
        return () => subscription.unsubscribe();
    }, [watchUseEffect]);

    useEffect(() => {
        if (!!grupoDeContatoSelecionado) carregarDadosGrupoContato();
    }, [grupoDeContatoSelecionado]);

    return (
        <ModalBase
            isOpen={isOpen}
            title="Cadastrar Grupo"
            handleClose={handleClose}
            footer={
                <>
                    <Botao
                        tipo='sucesso'
                        texto="Salvar"
                        disabled={salvando}
                        carregando={salvando}
                        onClick={cadastrarGrupoContatos}
                    />

                    <Botao
                        tipo="padrao"
                        onClick={handleClose} texto="Cancelar"
                        disabled={salvando}
                        carregando={salvando}
                    />
                </>
            }
        >

            <Formulario className='grid grid-cols-2'>
                <Formulario.InputTexto
                    name="nome"
                    label="Nome do Grupo"
                    register={registerGrupoContatos}
                    lowercase
                />
                <Formulario.InputTexto
                    name="descricao"
                    label="Descrição do Grupo"
                    register={registerGrupoContatos}
                    lowercase
                />
            </Formulario>

            <div className='flex flex-col gap-2 mt-5'>
                <span className='text-xl font-semibold'>Contatos</span>
                <Formulario className='w-full'>
                    <Formulario.InputTexto
                        name="pesquisa"
                        label="Pesquisa"
                        subTitulo="(Nome do Contato)"
                        opcional={true}
                        register={registerFiltros}
                        isFiltro
                        lowercase
                    />
                </Formulario>
            </div>

            {!listaContatos.length ?
                <EmptyPage
                    texto="Nenhum Contato Cadastrado"
                    botao={true}
                />

                :
                <>
                    <Tabela titulo="">
                        <Tabela.Header>
                            <Tabela.Header.Coluna alignText="text-center">
                                <input
                                    type="checkbox"
                                    checked={todosSelecionados}
                                    onChange={toggleSelecionarTodos}
                                    className="w-4 h-4"
                                />
                            </Tabela.Header.Coluna>
                            <Tabela.Header.Coluna>#</Tabela.Header.Coluna>
                            <Tabela.Header.Coluna>Nome</Tabela.Header.Coluna>
                            <Tabela.Header.Coluna alignText='center'>Número</Tabela.Header.Coluna>
                        </Tabela.Header>

                        <Tabela.Body>
                            {listaContatos.map((item) => {
                                return (
                                    <Tabela.Body.Linha key={item.id}>
                                        <Tabela.Body.Linha.Coluna alignText="text-center">
                                            <input
                                                type="checkbox"
                                                checked={selecionados.includes(item.id)}
                                                onChange={() => toggleSelecionarContato(item.id)}
                                                className="w-4 h-4"
                                            />
                                        </Tabela.Body.Linha.Coluna>
                                        <Tabela.Body.Linha.Coluna>
                                            {item.id}
                                        </Tabela.Body.Linha.Coluna>

                                        <Tabela.Body.Linha.Coluna>
                                            {item.nome}
                                        </Tabela.Body.Linha.Coluna>

                                        <Tabela.Body.Linha.Coluna alignText='center'>
                                            {formatarTelefone(item.numero)}
                                        </Tabela.Body.Linha.Coluna>
                                    </Tabela.Body.Linha>
                                );
                            })}
                        </Tabela.Body>
                    </Tabela>

                    <PaginacaoTabela
                        carregando={loadingListagem}
                        pagina={paginaAtual}
                        totalRegistros={totalRegistros}
                        registrosPorPagina={registrosPorPagina}
                        totalPaginas={totalPaginas}
                        onClickPaginaAnterior={() => {
                            setPaginaAtual(paginaAtual - 1);
                            carregaContatos(registrosPorPagina, paginaAtual - 1);
                        }}
                        onClickPaginaPosterior={() => {
                            setPaginaAtual(paginaAtual + 1);
                            carregaContatos(registrosPorPagina, paginaAtual + 1);
                        }}
                        onClickPagina={(pagina) => {
                            setPaginaAtual(pagina);
                            carregaContatos(registrosPorPagina, pagina);
                        }}
                    />

                </>
            }
        </ModalBase>
    );
};
