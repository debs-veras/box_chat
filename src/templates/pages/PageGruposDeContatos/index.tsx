import { Contato } from '../../../types/contato.d';
import { useEffect, useState } from 'react';
import useDebounce from '../../../hooks/useDebounce';
import { postListContatoFiltro } from '../../../services/contato';
import useToastLoading from '../../../hooks/useToastLoading';
import Formulario from '../../../components/Input';
import Box, { BoxContainer } from '../../../components/Box';
import { useForm } from 'react-hook-form';
import { GruposDeContatos } from '../../../types/grupoDeContatos';
import Tabela from '../../../components/Tabela';
import PaginacaoTabela from '../../../components/PaginacaoTabela';
import { baseFiltros } from '../../../types/baseEntity.d';
import EmptyPage from '../../../components/EmptyPage';

type PropsFiltros = {
    pesquisa: string;
};

export const PageGruposDeContatos = () => {
    const [listaContatos, setListaContato] = useState<Contato[]>([]);
    const [membrosSelecionados, setMembrosSelecionados] = useState<Contato[]>([]);

    const toast = useToastLoading();
    const filtroDebounce = useDebounce(() => carregaContatos(), 500);
    const { register: registerFiltros, watch: watchFiltros, handleSubmit: handleSubmitFiltros } = useForm<PropsFiltros>();
    const { register: registerGruposContatos } = useForm<GruposDeContatos>();


    const [loadingListagem, setLoadingListagem] = useState<boolean>(true);
    const [paginaAtual, setPaginaAtual] = useState<number>(0)
    const [totalRegistros, setTotalRegistros] = useState<number>(0)
    const [totalPaginas, setTotalPaginas] = useState<number>(0)
    const registrosPorPagina: number = 10
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

    const toggleContatoGrupo = (contato: Contato) => {
        setMembrosSelecionados((prev) =>
            prev.some((membro) => membro.id === contato.id)
                ? prev.filter((membro) => membro.id !== contato.id)
                : [...prev, contato]
        );
    };

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
                        <Box.Header.Content.Titulo>Filtros</Box.Header.Content.Titulo>
                    </Box.Header.Content>
                </Box.Header>
                <Formulario>
                    <Formulario.InputTexto
                        name="nome"
                        label="Nome do Grupo"
                        register={registerFiltros}
                        lowercase
                    />
                </Formulario>
            </Box>
            <Box>

                {!listaContatos.length ?
                    <Box>
                        <EmptyPage
                            texto="Nenhum Segmento Cadastrado"
                            botao={true}
                        />
                    </Box>
                    :
                    <>
                        <Tabela titulo="Contatos" filtro={
                            <Formulario>
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
                        }>
                            <Tabela.Header>
                                <Tabela.Header.Coluna>#</Tabela.Header.Coluna>
                                <Tabela.Header.Coluna>Nome</Tabela.Header.Coluna>
                                <Tabela.Header.Coluna>Número</Tabela.Header.Coluna>
                                <Tabela.Header.Coluna>Ação</Tabela.Header.Coluna>
                            </Tabela.Header>

                            <Tabela.Body>
                                {listaContatos.map((item) => {
                                    return (
                                        <Tabela.Body.Linha key={item.id}>
                                            <Tabela.Body.Linha.Coluna>
                                                {item.id}
                                            </Tabela.Body.Linha.Coluna>

                                            <Tabela.Body.Linha.Coluna>
                                                {item.nome}
                                            </Tabela.Body.Linha.Coluna>

                                            <Tabela.Body.Linha.Coluna>
                                                {item.numero}
                                            </Tabela.Body.Linha.Coluna>

                                            <Tabela.Body.Linha.Coluna alignText="text-center">
                                                <button
                                                    onClick={() => toggleContatoGrupo(item)}
                                                    className={`px-5 py-1 rounded-full font-semibold transition-colors ${membrosSelecionados.some((membro) => membro.id === item.id)
                                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                                        }`}
                                                >
                                                    {membrosSelecionados.some((membro) => membro.id === item.id)
                                                        ? 'Remover'
                                                        : 'Adicionar'}
                                                </button>
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
        </BoxContainer>

    );
};
