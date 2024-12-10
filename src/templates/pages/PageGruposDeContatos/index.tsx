import { Contato } from '../../../types/contato.d';
import { useEffect, useState } from 'react';
import useDebounce from '../../../hooks/useDebounce';
import { postListContatoFiltro } from '../../../services/contato';
import useToastLoading from '../../../hooks/useToastLoading';
import Formulario from '../../../components/Input';
import Box, { BoxContainer } from '../../../components/Box';
import { useForm } from 'react-hook-form';
import { CadastroGruposDeContatos } from '../../../types/grupoDeContatos';
import Tabela from '../../../components/Tabela';
import PaginacaoTabela from '../../../components/PaginacaoTabela';
import { baseFiltros } from '../../../types/baseEntity.d';
import EmptyPage from '../../../components/EmptyPage';
import { formatarTelefone } from '../../../utils/formatar';
import { postGrupo } from '../../../services/grupoContato';
import Botao from '../../../components/Button';

type PropsFiltros = {
    pesquisa: string;
};

export const PageGruposDeContatos = () => {
    const [listaContatos, setListaContato] = useState<Contato[]>([]);
    const [selecionados, setSelecionados] = useState<number[]>([]);
    const [todosSelecionados, setTodosSelecionados] = useState(false);

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

    const toast = useToastLoading();
    const filtroDebounce = useDebounce(() => carregaContatos(), 500);
    const { register: registerFiltros, watch: watchFiltros, handleSubmit: handleSubmitFiltros } = useForm<PropsFiltros>();
    const { register: registerGruposContatos, handleSubmit: handleSubmitGruposContatos } = useForm<CadastroGruposDeContatos>();

    const [loadingListagem, setLoadingListagem] = useState<boolean>(true);
    const [paginaAtual, setPaginaAtual] = useState<number>(0)
    const [totalRegistros, setTotalRegistros] = useState<number>(0)
    const [totalPaginas, setTotalPaginas] = useState<number>(0)
    const registrosPorPagina: number = 3
    const watchUseEffect = watchFiltros();

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
        if (selecionados.length === 0) {
            toast({ tipo: 'error', mensagem: 'Selecione ao menos um contato.' });
            return;
        }

        let dadosGrupo: CadastroGruposDeContatos = {
            nome: '',
            descricao: '',
            contatoIds: selecionados,
        };

        await handleSubmitGruposContatos((dadosForm) => {
            dadosGrupo = {
                ...dadosForm,
                contatoIds: selecionados
            };
        })();

        try {
            const response = await postGrupo(dadosGrupo);
            if (response.sucesso) toast({ tipo: 'success', mensagem: 'Grupo cadastrado com sucesso!' });
            else toast({ tipo: response.tipo, mensagem: response.mensagem });

        } catch (error) {
            toast({ tipo: 'error', mensagem: 'Erro ao cadastrar grupo.' });
        }
    }

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

    return (
        <BoxContainer className='m-4'>
            <Box>
                <Box.Header>
                    <Box.Header.Content>
                        <Box.Header.Content.Titulo>Cadastrado Grupo Contatos</Box.Header.Content.Titulo>
                    </Box.Header.Content>
                </Box.Header>
                <Formulario className='grid grid-cols-2'>
                    <Formulario.InputTexto
                        name="nome"
                        label="Nome do Grupo"
                        register={registerGruposContatos}
                        lowercase
                    />
                    <Formulario.InputTexto
                        name="descricao"
                        label="Descrição do Grupo"
                        register={registerGruposContatos}
                        lowercase
                    />
                </Formulario>
            </Box>

            <Box>
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

                {!listaContatos.length ?
                    <Box>
                        <EmptyPage
                            texto="Nenhum Segmento Cadastrado"
                            botao={true}
                        />
                    </Box>
                    :
                    <>
                        <Tabela titulo="Contatos">
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
            </Box>

            <Box>

                <Botao
                    tipo='sucesso'
                    texto="Cadastrar"
                    onClick={cadastrarGrupoContatos}
                />
            </Box>
        </BoxContainer>

    );
};
