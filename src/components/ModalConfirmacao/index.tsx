import Botao from "../Button";
import Modal from "../Modal";

type Props = {
    open: boolean
    setOpen: (open: boolean) => void;
    children: any
    tipo: "aviso" | "erro"
    acao: any
    titulo: string
}

export default function ModalConfirmacao(props: Props) {
    return (
        <>
            <Modal open={props.open}
                setOpen={props.setOpen}
                tipo={props.tipo}
            >
                <Modal.Titulo texto={props.titulo} />
                <Modal.Conteudo children={props.children} />
                <Modal.ContainerBotoes>
                    <Botao tipo="sucesso" onClick={props.acao} texto={"Confirmar"} />
                    <Modal.BotaoCancelar texto="Cancelar" />
                </Modal.ContainerBotoes>

            </Modal>
        </>
    )
}