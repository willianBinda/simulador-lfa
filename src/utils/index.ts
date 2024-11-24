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

export const validarGramatica = (gr: GR[], entrada: string) => {
  // eslint-disable-next-line
  let naoTerminalAtual = "S";

  const valida = (copiaEntrada: string, naoTerminal: string): boolean => {
    const regraEncontrada = encontraRegra(gr, naoTerminal);
    if (!regraEncontrada) return false;

    // Tenta cada produção para o não-terminal atual
    const options = regraEncontrada[naoTerminal];
    for (const opcao of options) {
      // Caso base: se a produção é "&" e a entrada foi totalmente consumida, aceita a entrada
      if (opcao === "&" && copiaEntrada.length === 0) {
        return true;
      }

      // Se a produção corresponde exatamente ao restante da entrada
      if (opcao === copiaEntrada) {
        return true;
      }

      // Verifica se a produção começa com o próximo caractere da entrada
      if (opcao[0] === copiaEntrada[0]) {
        const proximoNaoTerminal = opcao[1]; // Segundo caractere na produção
        const novaEntrada = copiaEntrada.slice(1); // Remove o primeiro caractere da entrada

        // Recursão com o próximo caractere e não-terminal
        if (valida(novaEntrada, proximoNaoTerminal)) {
          return true;
        }
      }
    }
    return false; // Retorna falso se nenhuma opção levou a uma solução
  };

  if (valida(entrada, naoTerminalAtual)) {
    console.log("A entrada é aceita pela gramática.");
  } else {
    throw new Error("Entrada não foi aceita pela gramática.");
  }
};

// Função auxiliar para encontrar uma regra da gramática
const encontraRegra = (gr: GR[], naoTerminalAtual: string) => {
  return gr.find((obj) => obj.hasOwnProperty(naoTerminalAtual));
};
