import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import ModalBase from '../../../components/ModalBase';
import Formulario from '../../../components/Input';
import { ModeloMensagem } from '../../../types/modeloMensagem';
import Botao from '../../../components/Button';

interface ModalCadastroModeloProps {
  isOpen: boolean;
  handleClose: () => void;
  onSave: (modelo: ModeloMensagem) => void;
  modelo?: ModeloMensagem | null;
}

export const ModalCadastroModeloMensagem = ({
  isOpen,
  handleClose,
  onSave,
  modelo,
}: ModalCadastroModeloProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<ModeloMensagem>();
  const tagsDisponiveis = ['{nome}'];

  const sincronizarTagsComConteudo = (conteudo: string): string[] => {
    return tagsDisponiveis.filter((tag) => conteudo.includes(tag));
  };

  const adicionarTag = (tag: string) => {
    const conteudoAtual = watch('conteudo') || '';
    const conteudoField = document.getElementById('conteudo') as HTMLTextAreaElement;
    if (conteudoField) {
      const cursorPos = conteudoField.selectionStart;
      const novoConteudo = conteudoAtual.slice(0, cursorPos) + tag + conteudoAtual.slice(cursorPos);
      setValue('conteudo', novoConteudo);
    }
  };

  const cadastrarModelo = () => {
    handleSubmit((dadosForm) => {
      const tags = sincronizarTagsComConteudo(dadosForm.conteudo);
      onSave({
        id: modelo?.id,
        titulo: dadosForm.titulo,
        conteudo: dadosForm.conteudo,
        tags: tags,
      });
    })();
  };

  useEffect(() => {
    if (modelo) {
      reset({ ...modelo });
    } else {
      reset({
        titulo: '',
        conteudo: '',
      });
    }
  }, [isOpen, modelo, reset]);

  return (
    <ModalBase
      isOpen={isOpen}
      title="Cadastrar Modelo de Mensagem"
      handleClose={handleClose}
      footer={
        <Botao
          tipo="sucesso"
          onClick={cadastrarModelo}
          texto="Salvar"
        />
      }
    >
      <Formulario className="flex flex-col gap-4 lg:col-span-3">
        <Formulario.InputTexto
          name="titulo"
          label="Título"
          register={register}
          opcional={false}
          placeholder="Título do modelo"
          lowercase
        />

        <Formulario.TextArea
          name="conteudo"
          label="Conteúdo"
          register={register}
          opcional={false}
          placeholder="Conteúdo do modelo"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Inserir Tags</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {tagsDisponiveis.map((tag, index) => (
              <button
                key={index}
                type="button"
                onClick={() => adicionarTag(tag)}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg shadow hover:bg-blue-200 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </Formulario>
    </ModalBase>
  );
};

