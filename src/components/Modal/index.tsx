import * as AlertDialog from '@radix-ui/react-alert-dialog';
import React from 'react';
import { HiPrinter } from 'react-icons/hi';
import { RxCheckCircled, RxExclamationTriangle, RxInfoCircled } from 'react-icons/rx';
import classNames from '../../utils/classNames';
import Botao from '../Button';
import ScrollArea from '../ScrollArea';

type TipoModal = "erro" | "sucesso" | "aviso" | "impressao";

type Props = {
    tipo?: TipoModal;
    open: boolean;
    setOpen: (open: boolean) => void;
    children: JSX.Element | Array<JSX.Element>;
    widthClassName?: string;
    overlayClassName?: string;
}

export default function Modal(props: Props): JSX.Element {
    const {
        tipo = "erro",
        open,
        setOpen,
        widthClassName = "max-w-lg w-11/12",
        overlayClassName
    } = props

    const childrenComProps = React.Children.map(props.children, (child) => {
        return React.cloneElement(child, {
            tipo: tipo
        });
    })

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay onClick={() => setOpen(false)} className={classNames("backdrop-blur-sm bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-50", overlayClassName)} />
                <AlertDialog.Content className={classNames("data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 -translate-x-1/2 z-50 -translate-y-1/2 rounded-[6px] bg-white p-4 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none", widthClassName)}>
                    {childrenComProps}
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}

type PropsTitulo = {
    texto: string;
    tipo?: TipoModal;
}

Modal.Titulo = ({ texto, tipo }: PropsTitulo): JSX.Element => {
    return (
        <AlertDialog.Title className="flex flex-row items-center gap-2 text-lg leading-6 font-medium text-gray-900">
            <div className='w-8'>
                {
                    tipo == "erro" && <RxExclamationTriangle className='text-red-600 h-8 w-8' />
                }
                {
                    tipo == "sucesso" && <RxCheckCircled className='text-primary-600 h-8 w-8' />
                }
                {
                    tipo == "aviso" && <RxInfoCircled className='text-yellow-600 h-8 w-8' />
                }
                {
                    tipo == "impressao" && <HiPrinter className='text-indigo-700 h-8 w-8' />
                }
            </div>
            <span className='text-ellipsis whitespace-nowrap w-fit overflow-hidden'>{texto}</span>
        </AlertDialog.Title>
    )
}

type PropsDescricao = {
    texto: string;
}

Modal.Descricao = ({ texto }: PropsDescricao): JSX.Element => {
    return (
        <AlertDialog.Description className="text-sm text-gray-500 mt-2 line-clamp-2 ">
            {texto}
        </AlertDialog.Description>
    )
}

type PropsConteudo = {
    children?: JSX.Element | Array<JSX.Element>;
    paddingX?: string;
    className?: string;
}

Modal.Conteudo = ({ children, paddingX, className }: PropsConteudo): JSX.Element => {
    return (
        <div className={className}>
            <ScrollArea paddingX={paddingX}>
                <div>
                    {children || <></>}
                </div>
            </ScrollArea>
        </div>
    )
}

type PropsContainerBotoes = {
    children: JSX.Element | Array<JSX.Element>;
    tipo?: TipoModal;
}

Modal.ContainerBotoes = (props: PropsContainerBotoes): JSX.Element => {
    const { tipo } = props;

    const childrenComProps = React.Children.map(props.children, (child) => {
        return React.cloneElement(child, {
            tipo: tipo
        });
    })

    return (
        <div className="mt-5 sm:mt-4 flex flex-row-reverse gap-4">
            {childrenComProps}
        </div>
    )
}

type PropsBotaoAcao = {
    textoBotao: string;
    acao: Function;
    tipo?: TipoModal;
    setOpen?: (open: boolean) => void;
}

Modal.BotaoAcao = (props: PropsBotaoAcao): JSX.Element => {

    const { textoBotao, acao, tipo, setOpen } = props;

    return (
        <>
            {textoBotao && (
                <AlertDialog.Action asChild>
                    <Botao
                        onClick={() => {
                            acao && acao()
                            setOpen && setOpen(false)
                        }}
                        tipo={tipo}
                        texto={textoBotao}
                        className={"relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md sm:w-auto"}
                    />
                </AlertDialog.Action>
            )}
        </>
    )
}

Modal.BotaoCancelar = ({texto = "Cancelar", acao}: {texto?: string; acao?: React.MouseEventHandler<HTMLButtonElement>;}): JSX.Element => {
    return (
        <AlertDialog.Cancel asChild>
            <Botao
                tipo="padrao"
                texto={texto}
                onClick={acao}
            />
        </AlertDialog.Cancel>
    );
};
