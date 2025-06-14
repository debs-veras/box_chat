function gerarIdAleatorio(): string {
  return `user-${Math.random().toString(36).substring(2, 10)}`;
}

export function getUsuarioId(): string {
  let usuarioId = sessionStorage.getItem("usuarioId");

  if (!usuarioId) {
    usuarioId = gerarIdAleatorio();
    sessionStorage.setItem("usuarioId", usuarioId);
  }

  return usuarioId;
}
