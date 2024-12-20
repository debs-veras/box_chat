import { TbDeviceDesktopOff } from 'react-icons/tb'
import EmptyPage from '../../../components/EmptyPage'

export default function NotFound() {
    return (
        <div className="h-full flex-1  flex items-center justify-center">
            <EmptyPage
                texto="Página não encontrada"
                Icone={TbDeviceDesktopOff}
                botao={true}
                acao={() => { window.location.href = "/" }}
                textoBotao="Voltar ao início"
            />
        </div>
    )
}
