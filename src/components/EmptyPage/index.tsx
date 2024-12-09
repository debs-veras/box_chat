import { IconType } from 'react-icons/lib';
import classNames from '../../utils/classNames';
import Botao from '../Button';

type Props = {
    texto?: string;
    Icone?: IconType;
    acao?: Function;
    iconeBotao?: JSX.Element;
    botao?: boolean;
    textoBotao?: string
    classNameTexto?: string
}

export default function EmptyPage(props: Props): JSX.Element {
    const { texto, acao, botao, textoBotao = "Adicionar", classNameTexto, iconeBotao } = props

    return (
        <div className="relative block w-full py-8 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" >

            <span className={classNames("mt-6 mb-8 block text-md font-medium text-primary-900", classNameTexto)}>{texto}</span>
            {botao &&
                <Botao
                    onClick={() => acao && acao()}
                    texto={textoBotao}
                    icone={iconeBotao}
                    className={"inline-flex items-center"}
                    tipo={"sucesso"}
                />
            }
        </div>
    )
}
