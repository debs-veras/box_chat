import React, { useState } from "react";
import Formulario from "../../../components/Input";
import { useForm } from "react-hook-form";
import { authLogin } from "../../../types/auth.d";
import Botao from "../../../components/Button";
// import { useNavigate, useLocation } from "react-router-dom";
import useToastLoading from "../../../hooks/useToastLoading";
import { login } from "../../../services/auth";

// function useQuery() {
//   const { search } = useLocation();
//   return React.useMemo(() => new URLSearchParams(search), [search]);
// }

export default function LoginForm(): JSX.Element {
  const { register, handleSubmit } = useForm<authLogin>();
  // const navigate = useNavigate();
  // let query = useQuery();

  const [loading, setLoading] = useState<boolean>(false);
  const toastLoading = useToastLoading();

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key.toLowerCase() === "enter") {
      const target = event.target as HTMLInputElement;
      const form = target.form;
      if (form) {
        const index = [...form.elements].indexOf(target);
        if (index !== -1 && index + 1 < form.elements.length) {
          (form.elements[index + 1] as HTMLElement).focus();
        }

        if (index + 1 == form.elements.length) handleLogin();
      }
      event.preventDefault();
    }
  };

  async function handleLogin(): Promise<void> {
    setLoading(true);
    toastLoading({ mensagem: "Verificando usuário" });

    let usuarioLogin: authLogin;

    await handleSubmit(
      (dados) => (usuarioLogin = { ...usuarioLogin, ...dados })
    )();

    const request = () => login(usuarioLogin);
    const response = await request();

    if (response.sucesso) {
      localStorage.setItem("@admin_Token", response.dados.token);
      toastLoading({
        mensagem: "Login realizado com sucesso",
        tipo: response.tipo,
        // onClose: () => navigate(query.get("url") || "/"),
      });
    } else {
      toastLoading({
        mensagem: response.mensagem,
        tipo: response.tipo,
      });
    }
    setLoading(false);
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 sm:p-12 w-full max-w-lg">
      <div className="flex flex-col items-center">
        <img
          className="w-16 h-16 object-contain mb-4"
          src="imagens/logo.png"
          alt="Logo"
        />
        <h1 className="text-2xl font-semibold text-gray-800">
          Bem-vindo ao Chat - Box<sup>3</sup>
        </h1>
        <p className="text-gray-500 mt-2 text-center">
          Faça login para continuar.
        </p>
      </div>
      <Formulario className="mt-6 space-y-4">
        <Formulario.InputTexto
          lowercase={true}
          name="email"
          label="Email"
          register={register}
          placeholder="Digite seu email"
          opcional={false}
          onKeyDown={handleEnter}
        />
        <Formulario.InputTexto
          lowercase={false}
          name="senha"
          label="Senha"
          type="password"
          register={register}
          placeholder="Digite sua senha"
          opcional={false}
          onKeyDown={handleEnter}
        />
      </Formulario>

      <Botao
        id="botaoLogin"
        texto="Entrar"
        tipo="sucesso"
        onClick={handleLogin}
        carregando={loading}
        className="w-full mt-6 flex justify-center"
      />
    </div>
  );
}
