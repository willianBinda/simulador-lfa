import { GR } from "@/types";

export const geraGrafo = (gr: GR[]) => {
  const nodes = gr.map((item, index) => {
    const naoTerminal = Object.keys(item)[0];

    const isAceitacao = Object.values(item)[0].find(
      (element) => element.length === 1
    );
    if (naoTerminal === "S") {
      return {
        id: index,
        label: naoTerminal,
        color: "red",
      };
    }
    if (isAceitacao) {
      return {
        id: index,
        label: naoTerminal,
        borderWidth: 3,
        color: {
          border: "#2B7CE9",
          background: "#D2E5FF",
        },
      };
    }
    return {
      id: index,
      label: naoTerminal,
      color: "grey",
    };
  });

  const edges = gr.flatMap((item, index) => {
    return Object.values(item).flatMap((opts) => {
      return opts
        .map((opt) => {
          const [terminal, naoTerminal] = opt.split("");
          const to = nodes.find((value) => value.label === naoTerminal);

          if (to) {
            return {
              from: index, // aqui você poderia trocar por 'from' se preferir
              to: to.id,
              label: terminal,
            };
          }
          return undefined;
        })
        .filter((el) => el !== undefined);
    });
  });

  const result: { from: number; to: number; label: string }[] = [];

  // Iterando sobre o array
  edges.forEach((item) => {
    // console.log(item);
    // Verificando se já existe um objeto com from e to iguais no resultado
    const existingItem = result.find(
      (el) => el.from === item.from && el.to === item.to
    );

    if (existingItem) {
      // Se encontrar, concatena a label com ","
      existingItem.label += "," + item.label;
    } else {
      // Caso contrário, adiciona o item ao resultado
      result.push({ ...item });
    }
  });

  return {
    nodes,
    edges: result,
  };
};
