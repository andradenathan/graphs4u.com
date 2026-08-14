import type { AlgorithmContent } from "@/content/algorithm-content";

export const bellmanFordContent: AlgorithmContent = {
	en: {
		metaTitle: "Bellman-Ford Algorithm — Shortest Path Visualizer",
		metaDescription:
			"Run Bellman-Ford on a graph with negative weights. Step-by-step relaxation, pseudocode, O(V · E) complexity, negative cycle detection, and Bellman-Ford vs Dijkstra.",
		heading: "Bellman-Ford shortest path algorithm",
		categoryLabel: "Shortest path",
		summary:
			"Bellman-Ford finds shortest paths from one source even when edges have negative weights. It relaxes every edge V − 1 times, which is enough for any shortest path, then does one extra pass: any edge that still improves proves the graph contains a negative cycle. It runs in O(V · E).",
		facts: [
			{ label: "Time complexity", value: "O(V · E)" },
			{ label: "Space complexity", value: "O(V)" },
			{ label: "Data structure", value: "Distance array, edge list" },
			{ label: "Needs edge weights", value: "Yes" },
			{ label: "Handles negative weights", value: "Yes" },
			{ label: "Detects negative cycles", value: "Yes" },
		],
		howItWorks: [
			"Set the distance of the source to 0 and every other node to infinity.",
			"Relax every edge in the graph: if distance[u] + weight(u, v) is smaller than distance[v], update distance[v].",
			"Repeat that full pass V − 1 times, since no shortest path can contain more than V − 1 edges.",
			"Run one more pass. If any edge can still be relaxed, a negative cycle is reachable from the source and no shortest path is well defined.",
		],
		pseudocode: `BELLMAN_FORD(graph, source):
    distance[v] <- infinity for every node v
    distance[source] <- 0

    repeat (V - 1) times:
        changed <- false
        for (u, v, weight) in graph.edges:
            if distance[u] + weight < distance[v]:
                distance[v] <- distance[u] + weight
                changed <- true
        if not changed:
            break

    for (u, v, weight) in graph.edges:
        if distance[u] + weight < distance[v]:
            return "negative cycle detected"

    return distance`,
		exampleNarrative:
			"This directed example contains the negative edge D → B. Dijkstra would settle B at cost 4 through A and never reconsider it; Bellman-Ford keeps relaxing and finds the cheaper route A → D → B.",
		useCases: [
			"Shortest paths where costs can be negative, such as arbitrage, rebates or energy gains.",
			"Detecting negative cycles, for example a currency exchange loop that yields profit.",
			"Distance-vector routing protocols such as RIP, which are built on the same relaxation idea.",
			"As the first phase of Johnson's algorithm for all-pairs shortest paths.",
		],
		pitfalls: [
			"Stopping after V − 1 passes without the extra verification pass silently returns wrong distances when a negative cycle exists.",
			"Relaxing from a node whose distance is still infinity causes overflow in languages where infinity is a large integer.",
			"Using Bellman-Ford when all weights are non-negative wastes time — Dijkstra is asymptotically much faster.",
		],
		faq: [
			{
				question: "What is the time complexity of Bellman-Ford?",
				answer:
					"O(V · E): the algorithm makes V − 1 passes over all E edges, plus one verification pass. Space is O(V) for the distance array. An early exit when a pass changes nothing often makes it much faster in practice.",
			},
			{
				question: "How does Bellman-Ford detect a negative cycle?",
				answer:
					"After V − 1 passes every shortest path is final, so no edge should improve any distance. If a Vth pass still relaxes an edge, that edge is reachable from a cycle whose total weight is negative.",
			},
			{
				question: "Why V − 1 passes?",
				answer:
					"A shortest path visits each node at most once, so it has at most V − 1 edges. Each pass guarantees correctness for paths one edge longer, so V − 1 passes cover every possible shortest path.",
			},
			{
				question: "Can Bellman-Ford run on undirected graphs with negative edges?",
				answer:
					"Not meaningfully: an undirected negative edge is itself a negative cycle, because you can traverse it back and forth to lower the cost without bound. Negative weights only make sense on directed graphs.",
			},
		],
		relatedAlgorithmIds: ["dijkstra", "bfs", "topological-sort"],
	},
	pt: {
		metaTitle: "Algoritmo de Bellman-Ford — Visualizador de Caminho Mínimo",
		metaDescription:
			"Execute Bellman-Ford em um grafo com pesos negativos. Relaxamento passo a passo, pseudocódigo, complexidade O(V · E), detecção de ciclo negativo e comparação com Dijkstra.",
		heading: "Algoritmo de Bellman-Ford (caminho mínimo)",
		categoryLabel: "Caminho mínimo",
		summary:
			"O Bellman-Ford encontra caminhos mínimos a partir de uma origem mesmo com arestas de peso negativo. Ele relaxa todas as arestas V − 1 vezes, o suficiente para qualquer caminho mínimo, e faz uma passada extra: se alguma aresta ainda melhora, o grafo tem ciclo negativo. Roda em O(V · E).",
		facts: [
			{ label: "Complexidade de tempo", value: "O(V · E)" },
			{ label: "Complexidade de espaço", value: "O(V)" },
			{
				label: "Estrutura de dados",
				value: "Vetor de distâncias, lista de arestas",
			},
			{ label: "Precisa de pesos", value: "Sim" },
			{ label: "Aceita pesos negativos", value: "Sim" },
			{ label: "Detecta ciclos negativos", value: "Sim" },
		],
		howItWorks: [
			"Defina a distância da origem como 0 e a de todos os outros nós como infinito.",
			"Relaxe todas as arestas do grafo: se distancia[u] + peso(u, v) for menor que distancia[v], atualize distancia[v].",
			"Repita essa passada completa V − 1 vezes, já que nenhum caminho mínimo pode ter mais de V − 1 arestas.",
			"Faça mais uma passada. Se ainda for possível relaxar alguma aresta, existe um ciclo negativo alcançável a partir da origem e não há caminho mínimo bem definido.",
		],
		pseudocode: `BELLMAN_FORD(grafo, origem):
    distancia[v] <- infinito para todo nó v
    distancia[origem] <- 0

    repita (V - 1) vezes:
        mudou <- falso
        para cada (u, v, peso) em grafo.arestas:
            se distancia[u] + peso < distancia[v]:
                distancia[v] <- distancia[u] + peso
                mudou <- verdadeiro
        se não mudou:
            pare

    para cada (u, v, peso) em grafo.arestas:
        se distancia[u] + peso < distancia[v]:
            retornar "ciclo negativo detectado"

    retornar distancia`,
		exampleNarrative:
			"Este exemplo direcionado contém a aresta negativa D → B. O Dijkstra fecharia B com custo 4 passando por A e nunca reconsideraria; o Bellman-Ford continua relaxando e encontra a rota mais barata A → D → B.",
		useCases: [
			"Caminhos mínimos em que os custos podem ser negativos, como arbitragem, descontos ou ganhos de energia.",
			"Detecção de ciclos negativos, por exemplo um ciclo de câmbio que gera lucro.",
			"Protocolos de roteamento por vetor de distância, como o RIP, construídos sobre a mesma ideia de relaxamento.",
			"Como primeira fase do algoritmo de Johnson para caminhos mínimos entre todos os pares.",
		],
		pitfalls: [
			"Parar após V − 1 passadas sem a passada de verificação devolve distâncias erradas em silêncio quando existe ciclo negativo.",
			"Relaxar a partir de um nó cuja distância ainda é infinito causa estouro em linguagens onde infinito é um inteiro grande.",
			"Usar Bellman-Ford quando todos os pesos são não negativos desperdiça tempo — o Dijkstra é assintoticamente muito mais rápido.",
		],
		faq: [
			{
				question: "Qual é a complexidade do Bellman-Ford?",
				answer:
					"O(V · E): o algoritmo faz V − 1 passadas por todas as E arestas, mais uma passada de verificação. O espaço é O(V), para o vetor de distâncias. A parada antecipada quando uma passada não muda nada costuma torná-lo bem mais rápido na prática.",
			},
			{
				question: "Como o Bellman-Ford detecta um ciclo negativo?",
				answer:
					"Após V − 1 passadas todo caminho mínimo já é definitivo, então nenhuma aresta deveria melhorar distância alguma. Se uma V-ésima passada ainda relaxa uma aresta, essa aresta é alcançável a partir de um ciclo de peso total negativo.",
			},
			{
				question: "Por que V − 1 passadas?",
				answer:
					"Um caminho mínimo visita cada nó no máximo uma vez, logo tem no máximo V − 1 arestas. Cada passada garante corretude para caminhos com uma aresta a mais, então V − 1 passadas cobrem todos os caminhos mínimos possíveis.",
			},
			{
				question: "Bellman-Ford roda em grafos não direcionados com peso negativo?",
				answer:
					"Não de forma útil: uma aresta negativa não direcionada já é um ciclo negativo, pois dá para percorrê-la de ida e volta reduzindo o custo indefinidamente. Pesos negativos só fazem sentido em grafos direcionados.",
			},
		],
		relatedAlgorithmIds: ["dijkstra", "bfs", "topological-sort"],
	},
};
