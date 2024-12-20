import EChartsReact from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import { BsFileBarGraph } from 'react-icons/bs';
import classNames from '../../utils/classNames';
import { formatarNumeroBrl } from '../../utils/formatar';
import Box, { BoxContainer } from '../Box';
import EmptyPage from '../EmptyPage';
import ScrollArea from '../ScrollArea';


type Props = {
    id?: string;
    children: React.ReactNode;
    className?: string;
}

type PropsContent = {
    id?: string,
    data: Array<any>,
    cor?: string | string[],
    media?: number | Array<any> | null,
    vertical?: boolean,
    style?: { [key: string]: string }
    top?: number | string,
    right?: number | string,
    left?: number | string,
    bottom?: number | string,
    markLine?: boolean;
    sufixo?: string | Array<string>;
    prefixo?: string | Array<string>;
    sobrepor?: boolean;
    label?: boolean;
    focusView?: boolean;
    descricaoMedia?: string;
    tooltipCursor?: boolean;
    barWidth?: "grande" | "normal" | "pequeno" | "longo",
    legendRotate?: number,
    width?: number
}

type PropsTotal = {
    titulo: string,
    valor?: number | string,
}

type PropsTotalizadores = {
    children: React.ReactNode
}

type PropsItemTotalizadores = {
    titulo: string;
    value?: number | string;
}

export default function GraficoBarra(props: Props) {
    const { id, children, className } = props;
    const [width, setWidth] = useState<number>();

    useEffect(() => {
        const handleSize = () => {
            let widthAux = id ? (document.getElementById(id)?.clientWidth || 0) * 0.9 : 0
            setWidth(widthAux)
        }

        if (width === undefined && id) handleSize()

        window.addEventListener('resize', handleSize);
        return () => window.removeEventListener('resize', handleSize);
    }, [window.innerWidth])

    return (
        <div id={id}>
            <BoxContainer className={classNames(className)}>
                <Box>
                    {React.Children.map(children, (child) => {
                        return React.cloneElement(child as JSX.Element, {
                            width: width
                        });
                    })}
                </Box>
            </BoxContainer>
        </div>
    )
}

const coresGrafico = [
    "green", "#edc634", "#f87171", "#60a5fa", "#ffdb58", "#ffaa7f", "#8c8cff", "#ffcc66", "#cbd5e1", "#68dcfc", "#ff7fff", "#ffaa8c", "#7fff7f", "#ff7f7f", "#ff7faa", "#aae07f", "#ffcc99", "#7faaff", "#ffcc7f", "#ffcf7f", "#7f8aff", "#aae0cf", "#ff7fa4", "#7fbfff", "#a4ff7f", "#ff7fff", "#ff7faa", "#6a7fff", "#c8c8b7", "#b7c8ff", "#ffccff"
]

const Header = ({ children, className }: Props) => {
    return (
        <Box.Header className={className}>
            <Box.Header.Content>
                {children}
            </Box.Header.Content>
        </Box.Header>
    )
}
Header.Titulo = ({ children, icone, iconeDestaque }: Props & { icone?: JSX.Element, iconeDestaque?: boolean }) => {
    return (
        <Box.Header.Content.Titulo>
            <div className='flex gap-2 content-center text-primary-800 '>
                <div className={classNames(iconeDestaque && "p-2 bg-primary-900 rounded-md")}>
                    {/* <IconeAtual className={classNames("w-6 h-6", iconeDestaque ? "text-white" : "text-primary-900")} icone={icone || null} /> */}
                </div>
                {children}
            </div>
        </Box.Header.Content.Titulo>
    )
}

Header.Subtitulo = ({ children }: Props) => {
    return (
        <Box.Header.Content.Subtitulo>{children}</Box.Header.Content.Subtitulo>
    )
}

const Content = ({
    data,
    cor,
    media,
    vertical = false,
    top,
    right,
    left,
    bottom,
    markLine = false,
    sufixo = "",
    prefixo = "",
    sobrepor = false,
    label = true,
    focusView = false,
    descricaoMedia,
    tooltipCursor = true,
    barWidth = "normal",
    legendRotate = 0,
    width
}: PropsContent) => {
    let qtdBarras = data?.length + 2;
    let ajusteMedio = Math.ceil(qtdBarras / 20);
    let widthCalculado = (ajusteMedio * ((barWidth == "pequeno" ? 30 : barWidth == "normal" ? 50 : barWidth == "grande" ? 92 : 130) / ajusteMedio)) * qtdBarras;

    if (!width) {
        let minWidth = window.innerWidth * 0.8;
        width = widthCalculado >= minWidth ? widthCalculado : minWidth;
    } else
        width = width < widthCalculado ? widthCalculado : width;

    let height = (40 * qtdBarras);
    let minHeight = window.innerHeight * 0.4;
    height = height >= minHeight ? height : minHeight;

    let quantidadeRegistros = data[0]?.length - 1;

    const configmMarkLine = {
        data: [{ type: 'average' }],
        lineStyle: {
            type: "dashed",
            width: 2,
            cap: "round",
        },
        symbol: ["none", "none"],
        symbolSize: [0, 0],
        label: {
            formatter: (params) => formatarNumeroBrl(params.value),
            fontWeight: 'bolder',
            borderColor: "#60a5fa"
        },
        animate: true,
    }

    let configPadrao: any = (index) => ({
        type: 'bar',
        stack: sobrepor ? 'barGroup' : 'barGroup' + index,
        color: Array.isArray(cor) ? cor[index - 1] : !!cor ? cor : coresGrafico[index - 1],
        barWidth: (barWidth == "pequeno" ? 30 : barWidth == "normal" ? 50 : barWidth == "grande" ? 92 : 130),
        margin: 20,
        label: sobrepor || !label ? { show: true, fontStyle: "bold" } : {
            type: "category",
            show: true,
            position: vertical ? 'right' : 'top',
            distance: 6,
            valueAnimation: true,
            backgroundColor: Array.isArray(cor) ? cor[index - 1] : !!cor ? cor : coresGrafico[index - 1],
            borderColor: '#ffffff',
            borderWidth: 1,
            borderRadius: 4,
            padding: 6,
            fontSize: 12, color: "white",
            shadowBlur: 4,
            shadowColor: '#d6d6d6',
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            fontStyle: "bold",
            rich: {
                per: {
                    color: '#fff',
                    backgroundColor: '#4C5058',
                }
            }
        },
    })

    let configuracoesGrafico = Array.from({ length: quantidadeRegistros }).map((_, i) => {
        let config = configPadrao(i + 1);

        if (!vertical) {
            config.label.formatter = function (params) {
                return (Array.isArray(prefixo) ? prefixo[params.dataIndex] : prefixo) + formatarNumeroBrl(params.value[params.encode.y[0]]) + (Array.isArray(sufixo) ? sufixo[params.dataIndex] : sufixo)
            }
        }
        else {
            config.label.formatter = function (params) {
                return (Array.isArray(prefixo) ? prefixo[params.dataIndex] : prefixo) + formatarNumeroBrl(params.value[params.encode.x[0]]) + (Array.isArray(sufixo) ? sufixo[params.dataIndex] : sufixo)
            }
        }

        if (!markLine) configmMarkLine.data = [];

        config.markLine = configmMarkLine

        return config;
    })

    if (!!media && typeof media == 'number') {
        let dataTemp = data?.map(item => item[0]);
        configuracoesGrafico?.push({
            type: 'line',
            showSymbol: false,
            // emphasis: {
            //     focus: 'series'
            // },
            color: "red",
            name: "Média",
            data: Array.from({ length: dataTemp.length - 1 }).map((_, index) => [dataTemp[index + 1], media])
        });
    } else if (!!media) {
        configuracoesGrafico?.push({
            type: 'line',
            showSymbol: false,
            // emphasis: {
            //     focus: 'series'
            // },
            color: "red",
            name: descricaoMedia || "Total",
            data: media,
        });
    }

    return (
        <>
            {quantidadeRegistros > 0 ? (
                <div className="overflow-hidden grid">
                    <ScrollArea paddingX="px-1 lg:px-0 pb-4">
                        <div className='mx-auto' style={vertical ? { height } : { width }}>
                            <EChartsReact style={vertical ? { height } : { width, height: "42vh" }} option={{
                                grid: {
                                    left: left || 80,
                                    right: right || 50,
                                    bottom: bottom || 60,
                                    top: top || 40
                                },
                                legend: {
                                    orient: 'horizontal',
                                    right: 'center',
                                    bottom: 8,

                                },
                                xAxis: vertical ? {} : {
                                    type: 'category',
                                    axisLabel: {
                                        interval: 0,
                                        rotate: legendRotate
                                    },
                                },
                                yAxis: vertical ? { type: 'category', inverse: true } : {},
                                dataset: {
                                    source: data,
                                },

                                series: configuracoesGrafico,
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: tooltipCursor ? {
                                        type: 'cross',
                                    } : {},
                                    valueFormatter: (value: number) => (Array.isArray(prefixo) ? "" : prefixo) + formatarNumeroBrl(value) + (Array.isArray(sufixo) ? "" : sufixo),
                                },
                                emphasis: {
                                    focus: focusView ? 'series' : ''
                                },
                            }} />
                        </div>
                    </ScrollArea>
                </div>
            ) : (
                <EmptyPage
                    texto="Nenhuma informação disponível"
                    Icone={BsFileBarGraph}
                />
            )}
        </>
    )
}

const Total = ({ titulo, valor }: PropsTotal) => {
    return (
        <>
            {(!!valor) &&
                <div className='border-t-[1px] py-2'>
                    <div className='mx-auto flex flex-col items-center'>
                        <div className='font-medium'>{valor}</div>
                        <div>{titulo}</div>
                    </div>
                </div>
            }
        </>
    )
}

const Totalizadores = ({ children }: PropsTotalizadores) => {
    return (
        <div className={classNames('w-full border-t pt-2 flex flex-row gap-10 flex-wrap justify-center')}>
            {children}
        </div>
    )
}

const Item = (props: PropsItemTotalizadores) => {
    const { titulo, value } = props;
    return (
        <div className='flex flex-col justify-center items-center'>
            <p>{titulo}</p>
            <p className='font-medium'>{value || 0}</p>
        </div>
    )
}

GraficoBarra.Header = Header;
GraficoBarra.Content = Content;
GraficoBarra.Total = Total;
GraficoBarra.Totalizadores = Totalizadores;
Totalizadores.Item = Item;