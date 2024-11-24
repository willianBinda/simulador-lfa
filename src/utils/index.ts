export interface GR {
  [key: string]: string[];
}

export const isDeterministico = (gr: GR[]) => {
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

const verificaOpcao = (
  nT: string,
  gr: GR[],
  char: string,
  sucessor: string
) => {
  const regraEncontrada = encontraRegra(gr, nT);
  console.log("regra for: ", regraEncontrada);
  if (regraEncontrada) {
    const opcoes = regraEncontrada[nT];
    console.log("NT: ", nT);
    console.log("opções: ", opcoes);
    console.log("atual: ", char);
    console.log("sucessor: ", sucessor);
    const opcao = opcoes.filter((e) => e.startsWith(char));
    const opcao2 = opcoes.filter((e) => e.startsWith(sucessor));
    console.log("Opção escolhida: ", opcao, opcao2);
    if (opcao.length > 0 && opcao2.length > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const verificarOpcaoFinal = (nT: string, gr: GR[], char: string) => {
  console.log("******************");
  const regraEncontrada = encontraRegra(gr, nT);
  console.log("regra final: ", regraEncontrada);
  if (regraEncontrada) {
    const opcoes = regraEncontrada[nT];
    console.log("char final: ", char);
    console.log("opções final: ", opcoes);

    const opcao = opcoes.find((element) => element === char);
    console.log("opção final: ", opcao);
    console.log("nT final: ", nT);

    if (opcao) {
      return true;
    } else {
      const edisonEncontrado = opcoes.find((opt) => opt === "&");
      if (edisonEncontrado) {
        return true;
      } else {
        return false;
        // throw new Error("opção final nao encontrada.");
      }
    }
  } else {
    return false;
    // throw new Error("opção final nao encontrada.");
  }
};

const encontraRegra = (gr: GR[], naoTerminalAtual: string) => {
  return gr.find((obj) => obj.hasOwnProperty(naoTerminalAtual));
};

export const validarGramatica = (gr: GR[], entrada: string) => {
  // eslint-disable-next-line
  let naoTerminalAtual = "S";

  if (!entrada.length) {
    const encontraEdison = gr[0]["S"].find((opt) => opt === "&");

    if (!encontraEdison) {
      throw new Error("Entrada inválida");
    }
  }

  entrada.split("").forEach((char, index) => {
    if (entrada.length - 1 === index) {
      const regraEncontrada = encontraRegra(gr, naoTerminalAtual);

      if (regraEncontrada) {
        const options = regraEncontrada[naoTerminalAtual];

        const opcoes = options.filter((e) => e.startsWith(char));

        if (opcoes.length > 0) {
          console.log("opções fnais: ", opcoes);
          //eslint-disable-next-line
          const validado = [];
          for (const opcao of opcoes) {
            const nT = opcao.split("")[1];
            const choseOption = verificarOpcaoFinal(nT, gr, char);
            if (choseOption) {
              naoTerminalAtual = nT;
              validado.push(1);
              break;
            }
          }
          if (validado.length === 0) {
            throw new Error("opção final nao encontrada.");
          }
        } else {
          throw new Error("entrada não encontrada");
        }
      } else {
        throw new Error("nao terminal não foi encontrado");
      }
    } else {
      // console.log("atual: ", entrada[index]);
      // console.log("Sucessor: ", entrada[index + 1]);
      const regraEncontrada = encontraRegra(gr, naoTerminalAtual);

      if (regraEncontrada) {
        const options = regraEncontrada[naoTerminalAtual];

        const opcoes = options.filter((e) => e.startsWith(char));

        if (opcoes.length > 0) {
          for (const opcao of opcoes) {
            const nT = opcao.split("")[1];
            const choseOption = verificaOpcao(nT, gr, char, entrada[index + 1]);
            if (choseOption) {
              naoTerminalAtual = nT;
              // console.log("opção escolhida: ", nT);
              break;
            }
          }
        } else {
          throw new Error("entrada não encontrada");
        }
      } else {
        throw new Error("nao terminal não foi encontrado");
      }
    }
  });
};
