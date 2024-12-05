import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faTag } from "@fortawesome/free-solid-svg-icons";
import Botao from "../../../components/Button";
import { ModalCadastroModeloMensagem } from "../../modal/ModalCadastroModeloMensagem";
import { ModeloMensagem } from "../../../types/modeloMensagem";
import useToastLoading from "../../../hooks/useToastLoading";
import Modal from "../../../components/Modal";

type PropsModelosMensagem = {
  modelos: ModeloMensagem[];
  setModelos: React.Dispatch<React.SetStateAction<ModeloMensagem[]>>;
};

export const ModelosMensagem = ({ modelos, setModelos }: PropsModelosMensagem) => {
  const [modalAberto, setModalAberto] = useState(false);
  const [confirmacaoDeletar, setConfirmacaoDeletar] = useState<boolean>(false);
  const [modeloSelecionado, setModeloSelecionado] = useState<ModeloMensagem | null>(null);
  const toast = useToastLoading();

  const abrirModal = () => setModalAberto(true);

  const fecharModal = () => {
    setModeloSelecionado(null);
    setModalAberto(false);
  };

  const salvarModelo = (modelo: ModeloMensagem) => {
    try {
      if (modelo.id) {
        setModelos((prev) =>
          prev.map((m) => (m.id === modelo.id ? modelo : m))
        );
      } else {
        setModelos((prev) => [
          ...prev,
          { ...modelo, id: Date.now() }
        ]);
      }
      toast({ tipo: "success", mensagem: "Modelo de mensagem cadastrado com sucesso!" });
      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar o modelo:", error);
      toast({ tipo: "error", mensagem: "Ocorreu um erro ao salvar o modelo de mensagem. Tente novamente." });
    }
  };

  function openModalExcluir(dados: ModeloMensagem): void {
    setModeloSelecionado(dados);
    setConfirmacaoDeletar(true);
  }

  const excluirModelo = () => {
    setModelos((prev) => prev.filter((modelo) => modelo.id !== modeloSelecionado?.id));
    setModeloSelecionado(null);
    toast({
      mensagem: "Modelo de mensagem deletado com sucesso.",
      tipo: "success",
    });
  };

  const editarModelo = (modelo: ModeloMensagem) => {
    setModeloSelecionado(modelo);
    abrirModal();
  };

  return (
    <>
      <div className="p-5 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Modelos de Mensagem</h2>
          <Botao tipo="informacao" onClick={abrirModal} texto={"Adicionar"} icone={<FontAwesomeIcon icon={faPlus} />} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {modelos.map((modelo) => (
            <div
              key={modelo.id}
              className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-lg truncate">/{modelo.titulo}</h3>
                <div className="flex gap-3">
                  <FontAwesomeIcon icon={faEdit} className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => editarModelo(modelo)} />
                  <FontAwesomeIcon icon={faTrash} className="text-red-600 hover:text-red-800 cursor-pointer" onClick={() => openModalExcluir(modelo)} />
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-3 text-left">
                {modelo.conteudo}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {modelo.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full shadow-sm"
                  >
                    <FontAwesomeIcon icon={faTag} className="mr-1 text-blue-600" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <ModalCadastroModeloMensagem
          isOpen={modalAberto}
          handleClose={fecharModal}
          onSave={salvarModelo}
          modelo={modeloSelecionado}
        />
      </div>

      <Modal open={confirmacaoDeletar} setOpen={setConfirmacaoDeletar}>
        <Modal.Titulo texto={`Deletar`} />
        <Modal.Descricao
          texto={`Deseja realmente deletar o modelo "${modeloSelecionado?.titulo}"?`}
        />

        <Modal.ContainerBotoes>
          <Modal.BotaoAcao textoBotao="Deletar" acao={excluirModelo} />
          <Modal.BotaoCancelar />
        </Modal.ContainerBotoes>
      </Modal>
    </>
  );
};
