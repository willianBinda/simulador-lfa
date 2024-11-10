export const geraGrafo = (rules: string) => {
  const gramatica = rules.split("\n");

  const novaGramatica = gramatica.map((item, index) => {
    const naoTerminal = item[0];
    return {
      [naoTerminal]: gramatica[index].split(naoTerminal + "->")[1].split("|"),
    };
  });

  const nodes = novaGramatica.map((item, index) => {
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

  // const nodes = [
  //   { id: 0, label: "S" },
  //   { id: 1, label: "A" },
  //   { id: 2, label: "B" },
  // ];

  // const nodes = [
  //   { id: 1, label: "Node 1" },
  //   { id: 2, label: "Node 2" },
  //   { id: 3, label: "Node 3" },
  //   { id: 4, label: "Node 4" },
  //   { id: 5, label: "Node 5" },
  // ];

  // const ed = novaGramatica.map((item, index) => {
  //   const rota1 = Object.values(item).map((opts) => {
  //     const rotas2 = opts
  //       .map((opt) => {
  //         const [terminal, naoTerminal] = opt.split("");
  //         const to = nodes.find((value) => value.label === naoTerminal);

  //         if (to) {
  //           return {
  //             from: index,
  //             to: to.id,
  //             label: terminal,
  //           };
  //         }
  //       })
  //       .filter((el) => el !== undefined);

  //     return rotas2;
  //   });

  //   return rota1;
  // });

  // console.log("resultado final: ", ed);
  const edges = novaGramatica.flatMap((item, index) => {
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

  // console.log("resultado final: ", ed);

  // const edges = [
  //   { from: 0, to: 1, label: "a" },
  //   { from: 0, to: 2, label: "b" },
  //   { from: 1, to: 1, label: "a" },
  //   { from: 2, to: 2, label: "b" },
  // ];

  // const edges = [
  //   { from: 1, to: 2, label: "Edge 1-2" },
  //   { from: 1, to: 3, label: "Edge 1-3" },
  //   { from: 2, to: 4, label: "Edge 2-4" },
  //   { from: 2, to: 5, label: "Edge 2-5" },
  // ];

  return {
    nodes,
    edges,
  };
};
