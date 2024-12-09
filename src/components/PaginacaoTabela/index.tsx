import { RxChevronRight, RxChevronLeft } from 'react-icons/rx'
import Botao from '../Button';

type Props = {
    pagina: number;
    totalPaginas: number;
    totalRegistros: number;
    registrosPorPagina: number;
    onClickPaginaAnterior: Function;
    onClickPaginaPosterior: Function;
    onClickPagina: Function;
    className?: string;
    carregando: boolean;
}

export default function PaginacaoTabela(props: Props): JSX.Element {
    const {
        pagina,
        totalPaginas,
        totalRegistros,
        registrosPorPagina,
        onClickPaginaAnterior,
        onClickPaginaPosterior,
        onClickPagina,
        className,
        carregando
    } = props

    const registroInicialAtual = pagina * registrosPorPagina + 1
    const registroFinalAtual = (pagina + 1) * registrosPorPagina > totalRegistros ? totalRegistros : (pagina + 1) * registrosPorPagina

    const renderBotaoPaginaAnterior = (posicao: number, onClickPagina: Function): JSX.Element => (
        <Botao
            texto={(pagina - posicao + 1).toString()}
            onClick={() => onClickPagina(pagina - posicao)}
            className="bg-white disabled:cursor-wait disabled:bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            disabled={carregando}
        />
    )

    const renderBotaoPaginaPosterior = (posicao, onClickPagina) => (
        <Botao
            texto={pagina + posicao + 1}
            disabled={carregando}
            onClick={() => onClickPagina(pagina + posicao)}
            className="bg-white disabled:cursor-wait disabled:bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
        />
    )

    return (
        <div className={`bg-white select-none -mx-4 px-4 pt-4 flex items-center border-t border-gray-200 justify-between rounded-b-lg ${className}`}>
            <div className="flex-1 flex justify-between sm:hidden">
                {pagina > 0 && (
                    <Botao
                        texto="Anterior"
                        onClick={() => onClickPaginaAnterior()}
                        className="relative disabled:cursor-wait disabled:bg-gray-100 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        disabled={carregando}
                    />
                )}

                {pagina + 1 < totalPaginas && (
                    <Botao
                        texto="Próximo"
                        onClick={() => onClickPaginaPosterior()}
                        className="relative disabled:cursor-wait disabled:bg-gray-100 inline-flex items-center ml-auto px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        disabled={carregando}
                    />
                )}
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{registroFinalAtual ? registroInicialAtual : 0}</span> até <span className="font-medium">{registroFinalAtual}</span> de{' '}
                        <span className="font-medium">{totalRegistros}</span> resultados
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {pagina > 0 && (
                            <Botao
                                texto="Anterior"
                                onClick={() => onClickPaginaAnterior()}
                                className="relative disabled:cursor-wait disabled:bg-gray-100 inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                icone={<RxChevronLeft className="h-5 w-5" aria-hidden="true" />}
                                classNameText="sr-only"
                                disabled={carregando}
                            />
                        )}

                        {pagina > 1 && (
                            <Botao
                                texto="1"
                                onClick={() => onClickPagina(0)}
                                className="bg-white disabled:cursor-wait disabled:bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                disabled={carregando}
                            />
                        )}
                        {pagina > 2 && (
                            <span className="relative inline-flex rounded-md items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                            </span>
                        )}

                        {pagina > 0 && renderBotaoPaginaAnterior(1, onClickPagina)}
                        <span className="z-10 bg-blue-50 rounded-md border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                            {pagina + 1}
                        </span>
                        {pagina + 1 < totalPaginas && renderBotaoPaginaPosterior(1, onClickPagina)}


                        {pagina + 3 < totalPaginas && (
                            <span className="relative inline-flex rounded-md items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                            </span>
                        )}
                        {pagina + 2 < totalPaginas && (
                            <Botao
                                texto={totalPaginas.toString()}
                                onClick={() => onClickPagina((totalPaginas) - 1)}
                                className="bg-white disabled:cursor-wait disabled:bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                disabled={carregando}
                            />
                        )}

                        {pagina + 1 < totalPaginas && (
                            <Botao
                                texto="Proximo"
                                onClick={() => onClickPaginaPosterior()}
                                className="relative inline-flex disabled:cursor-wait disabled:bg-gray-100 items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                classNameText="sr-only"
                                icone={<RxChevronRight className="h-5 w-5" aria-hidden="true" />}
                                disabled={carregando}
                            />
                        )}
                    </nav>
                </div>
            </div>
        </div>
    )
}