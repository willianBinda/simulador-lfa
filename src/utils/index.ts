export interface GR {
  [key: string]: string[];
}

// const terminaComEdison = (gr: GR[], naoTerminalAtual: string) => {
//   const regraEncontrada = gr.find((obj) =>
//     obj.hasOwnProperty(naoTerminalAtual)
//   );

//   if (regraEncontrada) {
//     const options = regraEncontrada[naoTerminalAtual];

//     const optionEncontrada = options.find((opt) => opt === "&");

//     if (optionEncontrada) {
//       return true;
//     } else {
//       throw new Error("Entrada invalida!");
//     }
//   } else {
//     throw new Error(
//       "nao terminal não foi encontrado na utlima verificação de terminação"
//     );
//   }
// };

// function procuraOpcao(options: string[], searchTerm: string) {
//   // Primeiro tenta encontrar o caractere exato
//   let found = options.find((element) => element === searchTerm);

//   // Se não encontrar, tenta com regex
//   if (!found) {
//     const regex = new RegExp(`^${searchTerm}`); // Busca por strings que começam com o searchTerm
//     found = options.find((element) => regex.test(element));
//   }

//   return found;
// }

const isDeterministico = (gr: GR[]) => {
  for (const el of gr) {
    const chave = Object.keys(el)[0];
    const opcoesComDois = el[chave].filter((itens) => itens.length === 2);

    for (const e of opcoesComDois) {
      const t = e.split("")[0];
      const qtde = opcoesComDois
        .join("")
        .split("")
        .filter((item) => item === t).length;

      if (qtde === 2) {
        return "AFN";
      }
    }
  }

  return "AFD";
};

const buscaOpcao = (nT: string, novaGramatica: GR[], char: string) => {
  // console.log("Nao terminal na função de busca: ", nT);
  const regraEncontrada = novaGramatica.find((obj) => obj.hasOwnProperty(nT));
  if (regraEncontrada) {
    // console.log(
    //   "RegraEncontrada na função de busca: ",
    //   regraEncontrada
    // );
    const ooo = regraEncontrada[nT];
    // console.log("Opções na função de busca: ", ooo);
    // console.log("CHar na função de busca: ", char);
    const op = ooo.filter((e) => e.startsWith(char));
    if (op.length > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const buscaOpcaoFinal = (nT: string, novaGramatica: GR[], char: string) => {
  // console.log("Nao terminal na função de busca: ", nT);
  const regraEncontrada = novaGramatica.find((obj) => obj.hasOwnProperty(nT));

  if (regraEncontrada) {
    console.log("(FInal)RegraEncontrada na função de busca: ", regraEncontrada);
    const ooo = regraEncontrada[nT];
    console.log("Opções final na função de busca: ", ooo);
    // console.log("CHar na função de busca: ", char);
    //verificar se termina com a ou se termina com edison
    const op = ooo.find((element) => element === char);
    // const op = procuraOpcao(ooo, char);
    if (op) {
      return true;
    } else {
      const edisonEncontrado = ooo.find((opt) => opt === "&");
      if (edisonEncontrado) {
        return true;
      } else {
        return false;
      }
    }
    // console.log("op final: ", op);
    // if (op.length > 0) {
    //   return true;
    // } else {
    //   return false;
    // }
  } else {
    return false;
  }
};

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
      console.log("***************");
      console.log("ultimo char");
      const regraEncontrada = novaGramatica.find((obj) =>
        obj.hasOwnProperty(naoTerminalAtual)
      );

      console.log("regra: ", regraEncontrada);

      if (regraEncontrada) {
        const options = regraEncontrada[naoTerminalAtual];
        console.log("opções: ", options);

        // const optionEncontrada = procuraOpcao(options, char);
        const opcoes = options.filter((e) => e.startsWith(char));
        console.log("opts: ", opcoes);

        if (opcoes.length > 0) {
          for (const opcao of opcoes) {
            console.log("Opção final for: ", opcao);

            const nT = opcao.split("")[1];
            const choseOption = buscaOpcaoFinal(nT, novaGramatica, char);
            if (choseOption) {
              console.log("Opção escolhida: ", nT);
              naoTerminalAtual = nT;
              break;
            }
          }
        } else {
          throw new Error("entrada não encontrada");
        }

        // if (optionEncontrada) {
        //   if (optionEncontrada.length === 1) {
        //   } else {
        //     const naoTerminalRegra = optionEncontrada.split("")[1];

        //     terminaComEdison(novaGramatica, naoTerminalRegra);
        //   }
        // } else {
        //   throw new Error("entrada não encontrada");
        // }
      } else {
        throw new Error("nao terminal não foi encontrado");
      }
    } else {
      const regraEncontrada = novaGramatica.find((obj) =>
        obj.hasOwnProperty(naoTerminalAtual)
      );

      console.log("regra: ", regraEncontrada);

      if (regraEncontrada) {
        const options = regraEncontrada[naoTerminalAtual];
        console.log("opções: ", options);

        // const searchTerm = char;
        // const regex = new RegExp(`^${searchTerm}`);

        // const optionEncontrada = options.find((opt) => regex.test(opt));

        const opcoes = options.filter((e) => e.startsWith(char));
        console.log("opts: ", opcoes);

        if (opcoes.length > 0) {
          for (const opcao of opcoes) {
            const nT = opcao.split("")[1];
            const choseOption = buscaOpcao(nT, novaGramatica, char);
            if (choseOption) {
              console.log("Opção escolhida: ", nT);
              naoTerminalAtual = nT;
              break;
            }
          }
        } else {
          throw new Error("entrada não encontrada");
        }

        // if (optionEncontrada) {
        //   const naoTerminalRegra = optionEncontrada.split("")[1];
        //   naoTerminalAtual = naoTerminalRegra;
        // } else {
        //   throw new Error("entrada não encontrada");
        // }
      } else {
        throw new Error("nao terminal não foi encontrado");
      }
    }
  });

  return isDeterministico(novaGramatica);
};
