import type { AlgorithmContent } from "@/content/algorithm-content";

export const aStarContent: AlgorithmContent = {
	en: {
		metaTitle: "A* Search Algorithm — Pathfinding Visualizer",
		metaDescription:
			"Run A* pathfinding on a graph you draw. How the heuristic works, admissibility explained, pseudocode, complexity, and A* vs Dijkstra.",
		heading: "A* search algorithm",
		categoryLabel: "Shortest path",
		summary:
			"A* finds the cheapest path between two specific nodes by ordering the search with f(n) = g(n) + h(n): the cost already paid plus an estimate of what is left. With an admissible heuristic — one that never overestimates — A* returns the same optimal path as Dijkstra while expanding far fewer nodes.",
		facts: [
			{ label: "Time complexity", value: "O((V + E) log V) worst case" },
			{ label: "Space complexity", value: "O(V)" },
			{ label: "Data structure", value: "Priority queue on f = g + h" },
			{ label: "Needs edge weights", value: "Yes" },
			{ label: "Needs a target node", value: "Yes" },
			{ label: "Optimal", value: "Yes, with an admissible heuristic" },
		],
		howItWorks: [
			"Give every node two numbers: g, the cheapest cost found so far from the source, and h, the estimated cost from that node to the target.",
			"Take the open node with the smallest f = g + h and mark it as expanded.",
			"Relax its edges, updating g and the parent pointer whenever a cheaper route is found.",
			"Stop as soon as the target is expanded; following the parent pointers backwards gives the optimal path.",
		],
		pseudocode: `A_STAR(graph, source, target):
    g[v] <- infinity for every node v
    g[source] <- 0
    open <- {source}

    while open is not empty:
        node <- argmin over open of (g[node] + h(node, target))
        if node == target:
            return reconstructPath(node)

        open.remove(node)
        closed.add(node)

        for (neighbour, weight) in graph.neighbours(node):
            if neighbour in closed:
                continue
            candidate <- g[node] + weight
            if candidate < g[neighbour]:
                g[neighbour] <- candidate
                parent[neighbour] <- node
                open.add(neighbour)

    return "no path"`,
		exampleNarrative:
			"graphs4u uses the straight-line distance between node positions as the heuristic, scaled by the cheapest cost-per-pixel found in the graph. That scaling is what keeps the heuristic admissible: no edge can ever be cheaper than its length times that factor, so the estimate never overshoots the true cost. The highlighted path is the optimal route to the target.",
		useCases: [
			"Pathfinding in games and robotics, where nodes have real coordinates.",
			"Route planning on maps, using straight-line distance as the heuristic.",
			"Any single-pair shortest path problem where exploring the whole graph would be wasteful.",
			"Puzzle solving, where a distance-to-goal estimate prunes most of the search tree.",
		],
		pitfalls: [
			"An inadmissible heuristic (one that can overestimate) makes A* fast but no longer guaranteed to return the shortest path.",
			"With h(n) = 0 for every node, A* degenerates into Dijkstra — correct, but with none of the speedup.",
			"A* answers a single source-target question; for distances to every node, Dijkstra is the right tool.",
		],
		faq: [
			{
				question: "What is the difference between A* and Dijkstra?",
				answer:
					"Dijkstra expands nodes by distance from the source alone; A* adds a heuristic estimate of the remaining distance, so it walks towards the target instead of expanding in all directions. With a zero heuristic, A* is exactly Dijkstra.",
			},
			{
				question: "What makes a heuristic admissible?",
				answer:
					"A heuristic is admissible when it never overestimates the true remaining cost. Admissibility is what guarantees optimality: if the estimate can overshoot, A* may settle the target through a path that is not the cheapest.",
			},
			{
				question: "What is the time complexity of A*?",
				answer:
					"In the worst case it matches Dijkstra, O((V + E) log V), because a weak heuristic makes it explore everything. In practice the number of expanded nodes falls sharply as the heuristic gets closer to the real cost.",
			},
			{
				question: "Does A* work without coordinates?",
				answer:
					"It needs some estimate of remaining cost. Without geometry you can use domain knowledge — landmark distances, precomputed lower bounds — but if no estimate exists, Dijkstra is the honest choice.",
			},
		],
		relatedAlgorithmIds: ["dijkstra", "bfs", "floyd-warshall"],
	},
	pt: {
		metaTitle: "Algoritmo A* — Visualizador de Busca de Caminho",
		metaDescription:
			"Execute a busca A* em um grafo desenhado por você. Como funciona a heurística, admissibilidade explicada, pseudocódigo, complexidade e A* vs Dijkstra.",
		heading: "Algoritmo A* (A estrela)",
		categoryLabel: "Caminho mínimo",
		summary:
			"O A* encontra o caminho mais barato entre dois nós específicos ordenando a busca por f(n) = g(n) + h(n): o custo já pago mais uma estimativa do que falta. Com uma heurística admissível — que nunca superestima —, o A* devolve o mesmo caminho ótimo do Dijkstra expandindo muito menos nós.",
		facts: [
			{ label: "Complexidade de tempo", value: "O((V + E) log V) no pior caso" },
			{ label: "Complexidade de espaço", value: "O(V)" },
			{
				label: "Estrutura de dados",
				value: "Fila de prioridade por f = g + h",
			},
			{ label: "Precisa de pesos", value: "Sim" },
			{ label: "Precisa de nó de destino", value: "Sim" },
			{ label: "Ótimo", value: "Sim, com heurística admissível" },
		],
		howItWorks: [
			"Atribua a cada nó dois números: g, o menor custo já encontrado desde a origem, e h, o custo estimado daquele nó até o destino.",
			"Pegue o nó aberto de menor f = g + h e marque-o como expandido.",
			"Relaxe suas arestas, atualizando g e o ponteiro de pai sempre que encontrar rota mais barata.",
			"Pare assim que o destino for expandido; seguir os ponteiros de pai de trás para frente dá o caminho ótimo.",
		],
		pseudocode: `A_ESTRELA(grafo, origem, destino):
    g[v] <- infinito para todo nó v
    g[origem] <- 0
    abertos <- {origem}

    enquanto abertos não estiver vazio:
        no <- menor (g[no] + h(no, destino)) entre abertos
        se no == destino:
            retornar reconstruirCaminho(no)

        abertos.remover(no)
        fechados.adicionar(no)

        para cada (vizinho, peso) em grafo.vizinhos(no):
            se vizinho está em fechados:
                continue
            candidato <- g[no] + peso
            se candidato < g[vizinho]:
                g[vizinho] <- candidato
                pai[vizinho] <- no
                abertos.adicionar(vizinho)

    retornar "sem caminho"`,
		exampleNarrative:
			"O graphs4u usa a distância em linha reta entre as posições dos nós como heurística, escalada pelo menor custo por pixel encontrado no grafo. É esse fator de escala que mantém a heurística admissível: nenhuma aresta pode custar menos que seu comprimento vezes esse fator, então a estimativa nunca ultrapassa o custo real. O caminho destacado é a rota ótima até o destino.",
		useCases: [
			"Busca de caminho em jogos e robótica, onde os nós têm coordenadas reais.",
			"Planejamento de rotas em mapas, usando distância em linha reta como heurística.",
			"Qualquer problema de caminho mínimo entre um par específico em que explorar o grafo inteiro seria desperdício.",
			"Resolução de quebra-cabeças, em que a estimativa de distância até o objetivo poda boa parte da árvore de busca.",
		],
		pitfalls: [
			"Uma heurística inadmissível (que pode superestimar) deixa o A* rápido, mas sem garantia de devolver o caminho mínimo.",
			"Com h(n) = 0 para todo nó, o A* degenera em Dijkstra — correto, porém sem nenhum ganho de velocidade.",
			"O A* responde a uma pergunta origem-destino; para as distâncias até todos os nós, a ferramenta certa é o Dijkstra.",
		],
		faq: [
			{
				question: "Qual a diferença entre A* e Dijkstra?",
				answer:
					"O Dijkstra expande os nós apenas pela distância desde a origem; o A* soma uma estimativa da distância restante, caminhando na direção do destino em vez de expandir em todas as direções. Com heurística zero, o A* é exatamente o Dijkstra.",
			},
			{
				question: "O que torna uma heurística admissível?",
				answer:
					"Uma heurística é admissível quando nunca superestima o custo restante real. É a admissibilidade que garante a otimalidade: se a estimativa puder ultrapassar, o A* pode fechar o destino por um caminho que não é o mais barato.",
			},
			{
				question: "Qual é a complexidade do A*?",
				answer:
					"No pior caso é a mesma do Dijkstra, O((V + E) log V), porque uma heurística fraca faz o algoritmo explorar tudo. Na prática, o número de nós expandidos cai bastante conforme a heurística se aproxima do custo real.",
			},
			{
				question: "O A* funciona sem coordenadas?",
				answer:
					"Ele precisa de alguma estimativa do custo restante. Sem geometria dá para usar conhecimento do domínio — distâncias a marcos, limites inferiores pré-computados —, mas se não existe estimativa, o honesto é usar Dijkstra.",
			},
		],
		relatedAlgorithmIds: ["dijkstra", "bfs", "floyd-warshall"],
	},
};
