import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faTag } from "@fortawesome/free-solid-svg-icons";
import Botao from "../Button";
import { ModalCadastroModeloMensagem } from "../ModalCadastroModeloMensagem";
import { ModeloMensagem } from "../../types/modeloMensagem";


const ModelosMensagem = () => {
  const [modelos, setModelos] = useState<ModeloMensagem[]>([
    {
      id: 1,
      titulo: "Saudação Pessoal",
      conteudo: "Olá {nome}, como posso ajudar você hoje?",
      tags: ["{nome}"],
    },
    {
      id: 2,
      titulo: "Confirmação de Pedido",
      conteudo: "Olá {nome}, seu pedido #{numero} foi confirmado com sucesso!",
      tags: ["{nome}", "{numero}"],
    },
  ]);

  const [modalAberto, setModalAberto] = useState(false);

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const salvarModelo = (modelo: ModeloMensagem) => {
    setModelos((prev) => [...prev, modelo]);
  };

  return (
    <div className="p-5">
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
              <h3 className="font-bold text-lg truncate">/{modelo.titulo}</h3>
              <div className="flex gap-3">
                <FontAwesomeIcon icon={faEdit} className="text-blue-600 hover:text-blue-800 cursor-pointer" />
                <FontAwesomeIcon icon={faTrash} className="text-red-600 hover:text-red-800 cursor-pointer" />
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-3 text-left">
              {modelo.conteudo}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {modelo.tags.map((tag, index) => (
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
      />
    </div>
  );
};

export default ModelosMensagem;
