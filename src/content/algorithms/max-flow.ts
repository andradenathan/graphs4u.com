import type { AlgorithmContent } from "@/content/algorithm-content";

export const maxFlowContent: AlgorithmContent = {
	en: {
		metaTitle: "Max Flow (Edmonds-Karp) — Network Flow Visualizer",
		metaDescription:
			"Compute the maximum flow of a network you draw. Ford-Fulkerson and Edmonds-Karp explained, residual graphs, O(V · E²) complexity, and the max-flow min-cut theorem.",
		heading: "Maximum flow (Edmonds-Karp)",
		categoryLabel: "Network flow",
		summary:
			"Maximum flow asks how much can be pushed from a source to a sink when every edge has a capacity. Edmonds-Karp repeatedly finds the shortest augmenting path with BFS, pushes the bottleneck capacity along it, and updates the residual graph. It runs in O(V · E²) and the answer equals the minimum cut.",
		facts: [
			{ label: "Time complexity", value: "O(V · E²) (Edmonds-Karp)" },
			{ label: "Space complexity", value: "O(V + E)" },
			{ label: "Data structure", value: "Residual capacity map + BFS queue" },
			{ label: "Edge weights mean", value: "Capacity" },
			{ label: "Graph type", value: "Directed" },
			{ label: "Needs source and sink", value: "Yes" },
		],
		howItWorks: [
			"Treat every edge weight as a capacity and start with zero flow everywhere.",
			"Find a path from source to sink using only edges with remaining capacity. Edmonds-Karp uses BFS, so it is always a shortest such path.",
			"Push the bottleneck — the smallest remaining capacity on that path — and subtract it along the path, adding it to the reverse direction so the choice can be undone later.",
			"Repeat until no augmenting path exists. The total pushed is the maximum flow.",
		],
		pseudocode: `EDMONDS_KARP(graph, source, sink):
    residual <- capacities of graph.edges
    flow <- 0

    while true:
        parent <- BFS over edges with residual capacity > 0
        if sink not reached:
            break

        bottleneck <- min residual capacity along the path
        for (u, v) in path:
            residual[u][v] <- residual[u][v] - bottleneck
            residual[v][u] <- residual[v][u] + bottleneck

        flow <- flow + bottleneck

    return flow`,
		exampleNarrative:
			"In this network the edge weights are capacities, not distances. The algorithm saturates the paths out of the source until no augmenting path remains; the highlighted edges are the ones carrying flow in the final solution.",
		useCases: [
			"Capacity planning in logistics, pipelines, traffic and computer networks.",
			"Bipartite matching, by adding a source connected to one side and a sink to the other.",
			"Image segmentation and other min-cut formulations in computer vision.",
			"Scheduling and assignment problems that reduce to flow.",
		],
		pitfalls: [
			"Forgetting the reverse residual edge. Without it, an early greedy choice can never be undone and the result is too small.",
			"Using plain DFS for augmenting paths (Ford-Fulkerson) with irrational capacities, which may not terminate; BFS gives the O(V · E²) bound.",
			"Treating the weights as distances: in a flow network a weight is capacity, so shortest-path intuition does not apply.",
		],
		faq: [
			{
				question: "What is the max-flow min-cut theorem?",
				answer:
					"The maximum flow from source to sink is exactly equal to the capacity of the cheapest cut separating them. So computing the flow also tells you the bottleneck: the set of edges whose removal disconnects source from sink at minimum cost.",
			},
			{
				question: "What is the difference between Ford-Fulkerson and Edmonds-Karp?",
				answer:
					"Ford-Fulkerson is the general method — repeatedly augment along any path. Edmonds-Karp is the version that picks the shortest augmenting path using BFS, which guarantees termination and an O(V · E²) bound independent of capacity values.",
			},
			{
				question: "Why does the algorithm need reverse edges?",
				answer:
					"Reverse residual capacity is what lets the algorithm cancel flow it sent earlier. Without that ability to backtrack, a greedy first path can block the optimal solution and the result is not maximum.",
			},
			{
				question: "Can max flow run on an undirected graph?",
				answer:
					"Yes, by modelling each undirected edge as two directed edges of the same capacity, one in each direction. The algorithm itself is unchanged.",
			},
		],
		relatedAlgorithmIds: ["bfs", "dijkstra", "connected-components"],
	},
	pt: {
		metaTitle: "Fluxo Máximo (Edmonds-Karp) — Visualizador de Fluxo em Redes",
		metaDescription:
			"Calcule o fluxo máximo de uma rede desenhada por você. Ford-Fulkerson e Edmonds-Karp explicados, grafo residual, complexidade O(V · E²) e o teorema fluxo máximo–corte mínimo.",
		heading: "Fluxo máximo (Edmonds-Karp)",
		categoryLabel: "Fluxo em redes",
		summary:
			"O fluxo máximo pergunta quanto é possível enviar de uma origem até um destino quando cada aresta tem capacidade. O Edmonds-Karp encontra repetidamente o caminho aumentante mais curto com BFS, empurra a capacidade do gargalo e atualiza o grafo residual. Roda em O(V · E²) e o resultado é igual ao corte mínimo.",
		facts: [
			{ label: "Complexidade de tempo", value: "O(V · E²) (Edmonds-Karp)" },
			{ label: "Complexidade de espaço", value: "O(V + E)" },
			{
				label: "Estrutura de dados",
				value: "Mapa de capacidade residual + fila do BFS",
			},
			{ label: "O peso da aresta é", value: "Capacidade" },
			{ label: "Tipo de grafo", value: "Direcionado" },
			{ label: "Precisa de origem e destino", value: "Sim" },
		],
		howItWorks: [
			"Trate o peso de cada aresta como capacidade e comece com fluxo zero em toda parte.",
			"Encontre um caminho da origem ao destino usando só arestas com capacidade restante. O Edmonds-Karp usa BFS, então é sempre um caminho mais curto.",
			"Empurre o gargalo — a menor capacidade restante do caminho — subtraindo-o ao longo do trajeto e somando-o no sentido inverso, para que a escolha possa ser desfeita depois.",
			"Repita até não existir caminho aumentante. O total empurrado é o fluxo máximo.",
		],
		pseudocode: `EDMONDS_KARP(grafo, origem, destino):
    residual <- capacidades de grafo.arestas
    fluxo <- 0

    repita:
        pai <- BFS pelas arestas com capacidade residual > 0
        se destino não foi alcançado:
            pare

        gargalo <- menor capacidade residual do caminho
        para cada (u, v) no caminho:
            residual[u][v] <- residual[u][v] - gargalo
            residual[v][u] <- residual[v][u] + gargalo

        fluxo <- fluxo + gargalo

    retornar fluxo`,
		exampleNarrative:
			"Nesta rede os pesos das arestas são capacidades, não distâncias. O algoritmo satura os caminhos que saem da origem até não restar caminho aumentante; as arestas destacadas são as que carregam fluxo na solução final.",
		useCases: [
			"Planejamento de capacidade em logística, dutos, tráfego e redes de computadores.",
			"Emparelhamento bipartido, adicionando uma origem ligada a um lado e um destino ao outro.",
			"Segmentação de imagens e outras formulações de corte mínimo em visão computacional.",
			"Problemas de escalonamento e alocação que se reduzem a fluxo.",
		],
		pitfalls: [
			"Esquecer a aresta residual inversa. Sem ela, uma escolha gulosa inicial nunca pode ser desfeita e o resultado sai menor que o real.",
			"Usar DFS puro para os caminhos aumentantes (Ford-Fulkerson) com capacidades irracionais, o que pode não terminar; o BFS garante o limite O(V · E²).",
			"Tratar os pesos como distâncias: em rede de fluxo o peso é capacidade, então a intuição de caminho mínimo não se aplica.",
		],
		faq: [
			{
				question: "O que diz o teorema fluxo máximo–corte mínimo?",
				answer:
					"O fluxo máximo da origem ao destino é exatamente igual à capacidade do corte mais barato que os separa. Calcular o fluxo, portanto, também revela o gargalo: o conjunto de arestas cuja remoção desconecta origem e destino com custo mínimo.",
			},
			{
				question: "Qual a diferença entre Ford-Fulkerson e Edmonds-Karp?",
				answer:
					"Ford-Fulkerson é o método geral — aumentar repetidamente por qualquer caminho. Edmonds-Karp é a versão que escolhe o caminho aumentante mais curto usando BFS, o que garante terminação e o limite O(V · E²) independente dos valores de capacidade.",
			},
			{
				question: "Por que o algoritmo precisa de arestas inversas?",
				answer:
					"A capacidade residual inversa é o que permite cancelar fluxo enviado antes. Sem essa possibilidade de retroceder, um primeiro caminho guloso pode bloquear a solução ótima e o resultado não é máximo.",
			},
			{
				question: "Dá para rodar fluxo máximo em grafo não direcionado?",
				answer:
					"Sim, modelando cada aresta não direcionada como duas arestas direcionadas de mesma capacidade, uma em cada sentido. O algoritmo em si não muda.",
			},
		],
		relatedAlgorithmIds: ["bfs", "dijkstra", "connected-components"],
	},
};
