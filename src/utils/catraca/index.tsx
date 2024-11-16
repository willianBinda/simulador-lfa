export const geraEntrada = (tamanho = 6) => {
  const caracteres = "abc123";
  let resultado = "";

  for (let i = 0; i < tamanho; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres.charAt(indiceAleatorio);
  }
  //   console.log(resultado);
  return resultado;
};

// Exemplo de uso
// console.log(geraEntrada());
