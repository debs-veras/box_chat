import { Contato } from '../../../types/contato.d';
import { useEffect, useState } from 'react';
import useDebounce from '../../../hooks/useDebounce';
import { postListContatoFiltro } from '../../../services/contato';
import useToastLoading from '../../../hooks/useToastLoading';
import Formulario from '../../../components/Input';
import Box, { BoxContainer } from '../../../components/Box';
import { useForm } from 'react-hook-form';
import { CadastroGruposDeContatos, GrupoDeContato } from '../../../types/grupoDeContatos';
import Tabela from '../../../components/Tabela';
import PaginacaoTabela from '../../../components/PaginacaoTabela';
import { baseFiltros } from '../../../types/baseEntity.d';
import EmptyPage from '../../../components/EmptyPage';
import { formatarTelefone } from '../../../utils/formatar';
import Loading from '../../../components/Loading';

type PropsFiltros = {
    pesquisa: string;
};

interface GruposDeContatosComponentProps {
    grupoDeContatoSelecionado?: GrupoDeContato | null;
}

export const GruposDeContatos = ({ grupoDeContatoSelecionado }: GruposDeContatosComponentProps) => {
    const [listaContatos, setListaContato] = useState<Contato[]>([]);
    const toast = useToastLoading();
    const { register: registerFiltros, watch: watchFiltros, handleSubmit: handleSubmitFiltros } = useForm<PropsFiltros>();
    const { register: registerGrupoContatos, reset: resetGrupoContatos } = useForm<CadastroGruposDeContatos>();
    const [loadingListagem, setLoadingListagem] = useState<boolean>(true);
    const [paginaAtual, setPaginaAtual] = useState<number>(0);
    const [totalRegistros, setTotalRegistros] = useState<number>(0);
    const [totalPaginas, setTotalPaginas] = useState<number>(0);
    const registrosPorPagina: number = 3;
    const watchUseEffect = watchFiltros();
    const [loadingGrupo, setLoadingGrupo] = useState<boolean>(false);

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

    const carregarDadosGrupoContato = async () => {
        setLoadingGrupo(true);
        resetGrupoContatos({ ...grupoDeContatoSelecionado });
        setLoadingGrupo(false);
    }

    const filtroDebounceContatos = useDebounce(() => carregaContatos(), 500);
    const filtroDebounceGrupoContatos = useDebounce(() => carregarDadosGrupoContato(), 500);

    useEffect(() => {
        filtroDebounceContatos();
    }, []);

    useEffect(() => {
        const subscription = watchFiltros(() => filtroDebounceContatos());
        return () => subscription.unsubscribe();
    }, [watchUseEffect]);

    useEffect(() => {
        if (!!grupoDeContatoSelecionado) filtroDebounceGrupoContatos()
    }, [grupoDeContatoSelecionado]);

    return (
        <BoxContainer className='m-4'>
            {loadingGrupo ? (
                <Loading />
            ) : (<>
                <Box>
                    <Box.Header>
                        <Box.Header.Content>
                            <Box.Header.Content.Titulo>Detalhes do grupo: {grupoDeContatoSelecionado?.nome}</Box.Header.Content.Titulo>
                        </Box.Header.Content>
                    </Box.Header>
                    {grupoDeContatoSelecionado ? (
                        <Formulario className='grid grid-cols-2'>
                            <Formulario.InputTexto
                                name="nome"
                                label="Nome do Grupo"
                                register={registerGrupoContatos}
                                lowercase
                                disabled
                                opcional
                            />
                            <Formulario.InputTexto
                                name="descricao"
                                label="Descrição do Grupo"
                                register={registerGrupoContatos}
                                lowercase
                                disabled
                                opcional
                            />
                        </Formulario>) :
                        (<div className="text-lg text-gray-500">Nenhum grupo selecionado.</div>)
                    }
                </Box>

                <Box>
                    <div className='flex flex-col gap-2 items-start'>
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
                        <Box>
                            <EmptyPage
                                texto="Nenhum Contato Cadastrado"
                                botao={true}
                            />
                        </Box>
                        :
                        <>

                            <Tabela titulo="">
                                <Tabela.Header>
                                    <Tabela.Header.Coluna>#</Tabela.Header.Coluna>
                                    <Tabela.Header.Coluna>Nome</Tabela.Header.Coluna>
                                    <Tabela.Header.Coluna alignText='center'>Número</Tabela.Header.Coluna>
                                </Tabela.Header>

                                <Tabela.Body>
                                    {listaContatos.map((item) => {
                                        return (
                                            <>
                                                {grupoDeContatoSelecionado?.contatoIds.includes(item.id) &&
                                                    <Tabela.Body.Linha key={item.id}>
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
                                                }
                                            </>
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
            </>
            )}
        </BoxContainer>
    );
};
