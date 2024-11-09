interface GR {
  [key: string]: string[];
}

const terminaComEdison = (gr: GR[], naoTerminalAtual: string) => {
  const regraEncontrada = gr.find((obj) =>
    obj.hasOwnProperty(naoTerminalAtual)
  );

  // console.log("Estado atual: ", naoTerminalAtual);
  // console.log("Verificar se existe & na regra atual: ", regraEncontrada);

  if (regraEncontrada) {
    const options = regraEncontrada[naoTerminalAtual];

    const optionEncontrada = options.find((opt) => opt === "&");

    if (optionEncontrada) {
      // console.log("Edison encontrado:", optionEncontrada);
      return true;
    } else {
      throw new Error("Entrada invalida!");
      // console.log("entrada não encontrada");
      // throw new Error(
      //   "Gramática incorreta terminal não foi declarado corretamente nas regras."
      // );
    }
  } else {
    // console.log(
    //   "nao terminal não foi encontrado na utlima verificação de terminação"
    // );

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
  //   console.log("gramatica string:", gr);
  const gramatica = gr.split("\n");

  // console.log("gramatica:", gramatica);

  const novaGramatica = gramatica.map((item, index) => {
    const naoTerminal = item[0];
    return {
      [naoTerminal]: gramatica[index].split(naoTerminal + "->")[1].split("|"),
    };
  });

  //   console.log("nova gramatica: ", novaGramatica);

  // eslint-disable-next-line
  let naoTerminalAtual = "S";

  entrada.split("").forEach((char, index) => {
    if (entrada.length - 1 === index) {
      //   console.log("******************");
      //   console.log("******************");
      //   console.log(
      //     "ultima derivação deve terminal no & ou na regra que possui a ultima entrada"
      //   );
      //   console.log("ultimo caractere: ", char);
      //   console.log("Não terminal atual: ", naoTerminalAtual);
      //   throw new Error("ultima derivação deve terminal no &");

      const regraEncontrada = novaGramatica.find((obj) =>
        obj.hasOwnProperty(naoTerminalAtual)
      );

      if (regraEncontrada) {
        // console.log("regra: ", regraEncontrada);
        const options = regraEncontrada[naoTerminalAtual];
        // console.log("options: ", options);

        const optionEncontrada = procuraOpcao(options, char);
        // const optionEncontrada = options.find(
        //   (opt) => opt === char || regex.test(opt)
        // );

        if (optionEncontrada) {
          //   console.log("entrada encontrada ultima rep: ", optionEncontrada);
          //   console.log(optionEncontrada.length);
          if (optionEncontrada.length !== 1) {
            //termina com edison
            // console.log("regras com edison");
            const naoTerminalRegra = optionEncontrada.split("")[1];
            // console.log("opções da regra: ", naoTerminalRegra);
            // const uppercaseChars = naoTerminalRegra.find(
            //   (charRegra) => charRegra === charRegra.toUpperCase()
            // );
            // console.log("Não terminal da regra da linha: ", naoTerminalRegra);
            // naoTerminalAtual = naoTerminalRegra;
            terminaComEdison(novaGramatica, naoTerminalRegra);
            // console.log("edison encontrado");
          }

          // if (uppercaseChars) {
          //   // naoTerminalAtual = uppercaseChars
          // } else {
          //   console.log("Não terminal não foi encontrado na regra");
          //   throw new Error(
          //     "Gramática incorreta não terminal não foi encontrado na derivação."
          //   );
          // }
        } else {
          //   console.log("entrada não encontrada");
          throw new Error("entrada não encontrada");
        }
      } else {
        // console.log("nao terminal não foi encontrado");

        throw new Error("nao terminal não foi encontrado");
      }

      // demais repetições
    } else {
      const regraEncontrada = novaGramatica.find((obj) =>
        obj.hasOwnProperty(naoTerminalAtual)
      );

      if (regraEncontrada) {
        // console.log("regra: ", regraEncontrada);
        const options = regraEncontrada[naoTerminalAtual];
        // console.log("options: ", options);

        const searchTerm = char;
        const regex = new RegExp(`^${searchTerm}`);

        const optionEncontrada = options.find((opt) => regex.test(opt));
        if (optionEncontrada) {
          //   console.log("entrada encontrada: ", optionEncontrada);
          const naoTerminalRegra = optionEncontrada.split("")[1];
          // console.log("opções da regra: ", naoTerminalRegra);
          // const uppercaseChars = naoTerminalRegra.find(
          //   (charRegra) => charRegra === charRegra.toUpperCase()
          // );
          //   console.log("Não terminal da regra da linha: ", naoTerminalRegra);
          naoTerminalAtual = naoTerminalRegra;
          // if (uppercaseChars) {
          //   // naoTerminalAtual = uppercaseChars
          // } else {
          //   console.log("Não terminal não foi encontrado na regra");
          //   throw new Error(
          //     "Gramática incorreta não terminal não foi encontrado na derivação."
          //   );
          // }
        } else {
          //   console.log("entrada não encontrada");
          throw new Error("entrada não encontrada");
        }
      } else {
        // console.log("nao terminal não foi encontrado");

        throw new Error("nao terminal não foi encontrado");
      }
    }
  });

  //verificar se a ultima regra possui &
};
