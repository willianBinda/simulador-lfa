interface GR {
  [key: string]: string[];
}

const terminaComEdison = (gr: GR[], naoTerminalAtual: string) => {
  const regraEncontrada = gr.find((obj) =>
    obj.hasOwnProperty(naoTerminalAtual)
  );

  if (regraEncontrada) {
    const options = regraEncontrada[naoTerminalAtual];

    const optionEncontrada = options.find((opt) => opt === "&");

    if (optionEncontrada) {
      return true;
    } else {
      throw new Error("Entrada invalida!");
    }
  } else {
    throw new Error(
      "nao terminal não foi encontrado na utlima verificação de terminação"
    );
  }
};

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
  const gramatica = gr.split("\n");

  const novaGramatica = gramatica.map((item, index) => {
    const naoTerminal = item[0];
    return {
      [naoTerminal]: gramatica[index].split(naoTerminal + "->")[1].split("|"),
    };
  });

  // eslint-disable-next-line
  let naoTerminalAtual = "S";

  if (!entrada.length) {
    const optionEncontrada = novaGramatica[0]["S"].find((opt) => opt === "&");

    if (!optionEncontrada) {
      throw new Error("Entrada inválida");
    }
  }

  entrada.split("").forEach((char, index) => {
    if (entrada.length - 1 === index) {
      const regraEncontrada = novaGramatica.find((obj) =>
        obj.hasOwnProperty(naoTerminalAtual)
      );

      if (regraEncontrada) {
        const options = regraEncontrada[naoTerminalAtual];

        const optionEncontrada = procuraOpcao(options, char);

        if (optionEncontrada) {
          if (optionEncontrada.length === 1) {
          } else {
            const naoTerminalRegra = optionEncontrada.split("")[1];

            terminaComEdison(novaGramatica, naoTerminalRegra);
          }
        } else {
          throw new Error("entrada não encontrada");
        }
      } else {
        throw new Error("nao terminal não foi encontrado");
      }
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
