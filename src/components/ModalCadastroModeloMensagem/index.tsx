import * as Dialog from '@radix-ui/react-dialog';
import Formulario from '../Input';
import { ModeloMensagem } from '../../types/modeloMensagem';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Botao from '../Button';

interface ModalCadastroModeloProps {
  isOpen: boolean;
  handleClose: () => void;
  onSave: (modelo: ModeloMensagem) => void;
  modelo?: ModeloMensagem | null;
}

export const ModalCadastroModeloMensagem = ({ isOpen, handleClose, onSave, modelo }: ModalCadastroModeloProps) => {
  const { register, handleSubmit, reset } = useForm<ModeloMensagem>();

  function cadastrarModelo() {
    handleSubmit(dadosForm => {
      onSave({
        id: modelo?.id,
        titulo: dadosForm.titulo,
        conteudo: dadosForm.conteudo,
        tags: dadosForm.tags,
      });
    })();
  }

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  useEffect(() => {
    if (modelo) reset({ ...modelo });
  }, [modelo, reset]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={handleClose}
          aria-hidden="true"
        />
        <Dialog.Content
          aria-labelledby="cadastro-modelo-title"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-96 shadow-xl z-50 transition-all duration-500 ease-in-out"
        >
          <Dialog.Title id="cadastro-modelo-title" className="text-xl font-semibold mb-4">Cadastrar Modelo de Mensagem</Dialog.Title>

          <Formulario className="flex flex-col gap-4 lg:col-span-3">
            <Formulario.InputTexto
              name="titulo"
              label="Título"
              register={register}
              opcional={false}
              placeholder="Título do modelo"
              // disabled={salvando}
              lowercase
            />

            <Formulario.TextArea
              name="conteudo"
              label="Conteúdo"
              register={register}
              opcional={false}
              placeholder="Conteúdo do modelo"
            // disabled={salvando}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Inserir Tags</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['{nome}', '{numero}', '{email}', '{cidade}'].map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      const conteudoField = document.getElementById('conteudo') as HTMLTextAreaElement;
                      if (conteudoField) {
                        const posicao = conteudoField.selectionStart;
                        if (posicao !== null)
                          conteudoField.value = conteudoField.value.substring(0, posicao) + tag + conteudoField.value.substring(posicao);
                      }
                    }}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg shadow hover:bg-blue-200 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Botao tipo="erro" onClick={handleClose} texto={"Fechar"} />
              <Botao tipo="sucesso" onClick={cadastrarModelo} texto={"Salvar"} />
            </div>
          </Formulario>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
