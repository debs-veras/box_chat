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
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <img className="w-12 h-12 object-contain" src="imagens/logo.png" alt="logo" />
        <span className="font-extrabold text-lg sm:text-2xl text-gray-800 ">Chat - Box<sup>3</sup></span>
      </div>
      <Formulario>
        <Formulario.InputTexto
          lowercase={true}
          name="email"
          label="Email"
          register={register}
          placeholder="Email"
          opcional={true}
          onKeyDown={handleEnter}
        />

        <Formulario.InputTexto
          lowercase={true}
          name="senha"
          label="Senha"
          type="password"
          register={register}
          placeholder="Senha"
          opcional={true}
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
