import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useState } from 'react';
import { AiFillMinusCircle } from "react-icons/ai";
import { MdAddCircle } from "react-icons/md";
import { tamanhoTitulo } from '../../types/tabela.d';
import classNames from '../../utils/classNames';
import ScrollArea from "../ScrollArea";

type PropsTabela = {
    titulo: string;
    tamanhoTitulo?: tamanhoTitulo;
    descricao?: string;
    children: Array<JSX.Element>;
    botoes?: JSX.Element | boolean | string;
    Header?: PropsHeader;
    Body?: PropsBody;
    tags?: JSX.Element;
    icone?: JSX.Element;
    iconeDestaque?: boolean;
}

type PropsHeader = {
    children: Array<JSX.Element | boolean>;
    Coluna?: PropsColuna;
}

type PropsColuna = {
    children: JSX.Element | string;
    alignText?: string;
}

type PropsBody = {
    children?: Array<JSX.Element>;
    Linha?: PropsBodyLinha;
}

type PropsBodyLinha = {
    children: JSX.Element;
    Coluna?: PropsBodyLinhaColuna;
}

type PropsBodyLinhaColuna = {
    children: JSX.Element;
}

function Tabela({ titulo, tamanhoTitulo = "grande", descricao, children, botoes, tags,  iconeDestaque }: PropsTabela): JSX.Element {
    return (
        <div className="bg-white sm:rounded-lg rounded-t-lg divide-y">
            <div className="sm:flex pb-4 sm:items-center border-gray-200">
                <div className="sm:flex-auto">
                    <div className='flex flex-row items-center gap-2'>
                        <div className={classNames(iconeDestaque && "p-2 bg-primary-900 rounded-md")}>
                       
                        </div>
                        <h1 className={classNames(
                            'font-semibold text-primary-900',
                            (tamanhoTitulo == "normal" ? "text-lg" : (tamanhoTitulo == "pequeno" ? "text-base" : "text-2xl"))
                        )}>{titulo}</h1>
                    </div>
                    {descricao && <span className="text-sm font-normal text-gray-500">{descricao}</span>}
                </div>
                <div className="flex flex-col lg:flex-row gap-4 mt-2 lg:mt-0">
                    {botoes}
                </div>
            </div>
            {tags}
            <div className="flow-root -mx-4">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow grid ring-1 ring-black ring-opacity-5">
                            <ScrollArea paddingX="px-1 lg:px-0">
                                <table className="min-w-full table divide-y divide-gray-300">
                                    {children}
                                </table>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Header = ({ children }: PropsHeader): JSX.Element => {
    return (
        <thead className="bg-gray-50">
            <tr>{children}</tr>
        </thead>
    );
};

const Coluna = ({ children, alignText = "text-left" }: PropsColuna): JSX.Element => {
    return (
        <th
            scope="col"
            className={`px-3 py-3.5 text-sm font-semibold text-gray-900 ${alignText}`}
        >
            {children}
        </th>
    );
};


const Body = ({ children }: PropsBody): JSX.Element => {
    const [autoAnimateRef] = useAutoAnimate();
    return (
        <tbody ref={autoAnimateRef} className="divide-y divide-gray-200 bg-white">{children}</tbody>
    );
};

const Linha = ({ children }) => {
    const [detalhesOpen, setDetalhesOpen] = useState<boolean>(false);
    const [temDetalhes, setTemDetalhes] = useState<boolean>(false);

    return (
        <>
            <tr
                className={classNames(temDetalhes && "cursor-pointer")}
                onClick={() => temDetalhes && setDetalhesOpen(!detalhesOpen)}
            >
                {
                    React.Children.map(children, (child, index) => {
                        if (!temDetalhes && child.type?.name == "Detalhes") setTemDetalhes(true);

                        if (index == 0)
                            return React.cloneElement(child, { detalhesOpen: temDetalhes ? detalhesOpen : undefined })

                        if (child.type?.name != "Detalhes")
                            return child;
                    })
                }
            </tr>

            <tr className={classNames("ease-linear duration-300", detalhesOpen ? "opacity-1 visible" : "opacity-0 collapse ")}>
                <td colSpan={children?.length}>
                    {children.find(child => child.type?.name == "Detalhes")}
                </td>
            </tr>
        </>
    );
};

const ColunaBody = ({ children, alignText = "text-left", detalhesOpen = undefined, className = "" }) => {
    return (
        <td className={classNames(`whitespace-nowrap max-w-sm truncate px-3 py-4 text-sm text-gray-500`, alignText, className)}>
            <div className={classNames(detalhesOpen != undefined && 'flex items-center gap-2')}>
                {detalhesOpen != undefined && (detalhesOpen ? <AiFillMinusCircle className='w-5 h-5 fill-red-500' /> : <MdAddCircle className='w-5 h-5 fill-primary-500' />)} {children}
            </div>
        </td>
    );
};

const Detalhes = ({ children, className = "" }: { children: JSX.Element | Array<JSX.Element>, className?: string }) => {
    return (
        <tr className={classNames('px-3 py-4 flex gap-4 text-sm', className)}>
            {children}
        </tr>
    );
};

Header.Coluna = Coluna;
Linha.Coluna = ColunaBody;
Linha.Detalhes = Detalhes;
Body.Linha = Linha;
Tabela.Body = Body;
Tabela.Header = Header;

export default Tabela;
