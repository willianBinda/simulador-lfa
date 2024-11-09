function procuraOpcao(options: string[], searchTerm: string) {
  // Primeiro tenta encontrar o caractere exato
  let found = options.find((element) => element === searchTerm);

  // Se não encontrar, tenta com regex
  if (!found) {
    const regex = new RegExp(`^${searchTerm}`); // Busca por strings que começam com o searchTerm
    found = options.find((element) => regex.test(element));
  }

  return found;
}

export const validarGramatica = (gr: string, entrada: string) => {
  // separa a string das regras em array  ['S->aA|bB', 'A->aA|&', 'B->bB|&']
  const gramatica = gr.split("\n");
  //   console.log(gramatica);

  // trasnforma o array em objeto [{S: ['aA','aB']}, {A: ['aA','&']}, {B: ['bB','&']}]
  const novaGramatica = gramatica.map((item, index) => {
    const naoTerminal = item[0];
    return {
      [naoTerminal]: gramatica[index].split(naoTerminal + "->")[1].split("|"),
    };
  });
  //   console.log(novaGramatica);
  // eslint-disable-next-line
  let naoTerminalAtual = "S";

  //percorrer e validar entrada
  entrada.split("").forEach((char, index) => {
    // ultimo caractere da entrada
    if (entrada.length - 1 === index) {
      //procura no array de objeto se possui o não terminal como chave
      const regraEncontrada = novaGramatica.find((obj) =>
        obj.hasOwnProperty(naoTerminalAtual)
      );

      if (regraEncontrada) {
        // pega o array do não terminal
        const options = regraEncontrada[naoTerminalAtual];

        // procura se tem edison ou nao retonar 'aA' = caso edison ou 'a' = não edison
        const optionEncontrada = procuraOpcao(options, char);

        if (optionEncontrada) {
          // sem termina com edison
          if (optionEncontrada.length === 2) {
            // separa a opção 'aA' em ['a','A'] e retorna o index 1 = 'A'
            const naoTerminalRegra = optionEncontrada.split("")[1];

            //procura na gr o não terminal
            const regraEncontrada = novaGramatica.find((obj) =>
              obj.hasOwnProperty(naoTerminalAtual)
            );

            if (regraEncontrada) {
              const options = regraEncontrada[naoTerminalRegra];
              // procura se tem o edison nas opções
              const optionEncontrada = options.find((opt) => opt === "&");

              if (!optionEncontrada) {
                throw new Error("Entrada invalida!");
              }
            } else {
              throw new Error(
                "nao terminal não foi encontrado na utlima verificação de terminação"
              );
            }
          }
        } else {
          throw new Error("entrada não encontrada");
        }
      } else {
        throw new Error("nao terminal não foi encontrado");
      }

      // demais repetições
    } else {
      const regraEncontrada = novaGramatica.find((obj) =>
        obj.hasOwnProperty(naoTerminalAtual)
      );

      if (regraEncontrada) {
        const options = regraEncontrada[naoTerminalAtual];

        const searchTerm = char;
        const regex = new RegExp(`^${searchTerm}`);

        const optionEncontrada = options.find((opt) => regex.test(opt));
        if (optionEncontrada) {
          const naoTerminalRegra = optionEncontrada.split("")[1];

          naoTerminalAtual = naoTerminalRegra;
        } else {
          throw new Error("entrada não encontrada");
        }
      } else {
        throw new Error("nao terminal não foi encontrado");
      }
    }
  });
};
