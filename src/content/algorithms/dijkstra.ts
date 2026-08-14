import type { AlgorithmContent } from "@/content/algorithm-content";

export const dijkstraContent: AlgorithmContent = {
	en: {
		metaTitle: "Dijkstra's Algorithm — Shortest Path Visualizer",
		metaDescription:
			"Run Dijkstra's shortest path algorithm on a graph you draw. Step-by-step distances, pseudocode, O((V + E) log V) complexity, and Dijkstra vs Bellman-Ford.",
		heading: "Dijkstra's shortest path algorithm",
		categoryLabel: "Shortest path",
		summary:
			"Dijkstra's algorithm finds the cheapest path from one source node to every other node in a graph with non-negative edge weights. It repeatedly settles the unvisited node with the smallest known distance and relaxes its outgoing edges, running in O((V + E) log V) with a binary heap.",
		facts: [
			{ label: "Time complexity", value: "O((V + E) log V) with a binary heap" },
			{ label: "Space complexity", value: "O(V)" },
			{ label: "Data structure", value: "Priority queue (min-heap)" },
			{ label: "Needs edge weights", value: "Yes" },
			{ label: "Handles negative weights", value: "No" },
			{ label: "Detects negative cycles", value: "No" },
		],
		howItWorks: [
			"Set the distance of the source to 0 and every other node to infinity.",
			"Take the unvisited node with the smallest tentative distance and mark it as settled — its distance is now final.",
			"Relax each outgoing edge: if the distance to the settled node plus the edge weight is smaller than the neighbour's current distance, update it.",
			"Repeat until every reachable node is settled. The recorded distances are the shortest ones.",
		],
		pseudocode: `DIJKSTRA(graph, source):
    distance[v] <- infinity for every node v
    distance[source] <- 0
    queue <- min-heap of (0, source)
    settled <- {}

    while queue is not empty:
        (cost, node) <- queue.popMinimum()
        if node in settled:
            continue
        settled.add(node)

        for (neighbour, weight) in graph.neighbours(node):
            candidate <- cost + weight
            if candidate < distance[neighbour]:
                distance[neighbour] <- candidate
                queue.push((candidate, neighbour))

    return distance`,
		exampleNarrative:
			"From source A, the algorithm settles nodes in increasing order of distance. Note that the cheapest route to E is not the direct edge from B but the detour through D, which BFS would never find.",
		useCases: [
			"Route planning on road, transit and network maps with non-negative costs.",
			"Latency or cost-optimal routing in computer networks.",
			"Any single-source shortest path problem where weights represent distance, time or price.",
			"As the base of A*, which adds a heuristic to Dijkstra to reach a single target faster.",
		],
		pitfalls: [
			"A single negative edge breaks the correctness guarantee: once a node is settled it is never revisited, so a cheaper path found later is ignored. Use Bellman-Ford.",
			"Scanning an array for the minimum instead of using a heap turns the running time into O(V²), which matters on large sparse graphs.",
			"Not skipping stale heap entries (nodes already settled) silently does extra work and can produce wrong distances if the settled check is missing.",
		],
		faq: [
			{
				question: "What is the time complexity of Dijkstra's algorithm?",
				answer:
					"With a binary heap it is O((V + E) log V). With a simple array scan it is O(V²), which can be faster on very dense graphs, and with a Fibonacci heap it is O(E + V log V) in theory.",
			},
			{
				question: "Why does Dijkstra fail with negative weights?",
				answer:
					"Dijkstra assumes that once the closest unvisited node is chosen, no cheaper path to it can exist. A negative edge can make a longer route cheaper later, breaking that assumption. Bellman-Ford handles negative weights correctly.",
			},
			{
				question: "Dijkstra or Bellman-Ford — which should I use?",
				answer:
					"Use Dijkstra when all weights are non-negative: it is much faster. Use Bellman-Ford when weights can be negative or when you need to detect a negative cycle, accepting its slower O(V · E) running time.",
			},
			{
				question: "Does Dijkstra work on undirected graphs?",
				answer:
					"Yes. An undirected edge is treated as two directed edges of the same weight, and the algorithm is unchanged. The non-negative weight requirement still applies.",
			},
		],
		relatedAlgorithmIds: ["bellman-ford", "bfs", "prim"],
	},
	pt: {
		metaTitle: "Algoritmo de Dijkstra — Visualizador de Caminho Mínimo",
		metaDescription:
			"Execute o algoritmo de Dijkstra em um grafo desenhado por você. Distâncias passo a passo, pseudocódigo, complexidade O((V + E) log V) e Dijkstra vs Bellman-Ford.",
		heading: "Algoritmo de Dijkstra (caminho mínimo)",
		categoryLabel: "Caminho mínimo",
		summary:
			"O algoritmo de Dijkstra encontra o caminho mais barato de um nó de origem até todos os outros em grafos com pesos não negativos. Ele fecha repetidamente o nó não visitado de menor distância conhecida e relaxa suas arestas de saída, rodando em O((V + E) log V) com heap binário.",
		facts: [
			{
				label: "Complexidade de tempo",
				value: "O((V + E) log V) com heap binário",
			},
			{ label: "Complexidade de espaço", value: "O(V)" },
			{ label: "Estrutura de dados", value: "Fila de prioridade (min-heap)" },
			{ label: "Precisa de pesos", value: "Sim" },
			{ label: "Aceita pesos negativos", value: "Não" },
			{ label: "Detecta ciclos negativos", value: "Não" },
		],
		howItWorks: [
			"Defina a distância da origem como 0 e a de todos os outros nós como infinito.",
			"Pegue o nó não visitado de menor distância tentativa e marque-o como fechado — sua distância agora é definitiva.",
			"Relaxe cada aresta de saída: se a distância até o nó fechado somada ao peso da aresta for menor que a distância atual do vizinho, atualize-a.",
			"Repita até todos os nós alcançáveis estarem fechados. As distâncias registradas são as mínimas.",
		],
		pseudocode: `DIJKSTRA(grafo, origem):
    distancia[v] <- infinito para todo nó v
    distancia[origem] <- 0
    fila <- min-heap com (0, origem)
    fechados <- {}

    enquanto fila não estiver vazia:
        (custo, no) <- fila.removerMinimo()
        se no está em fechados:
            continue
        fechados.adicionar(no)

        para cada (vizinho, peso) em grafo.vizinhos(no):
            candidato <- custo + peso
            se candidato < distancia[vizinho]:
                distancia[vizinho] <- candidato
                fila.inserir((candidato, vizinho))

    retornar distancia`,
		exampleNarrative:
			"A partir da origem A, o algoritmo fecha os nós em ordem crescente de distância. Repare que a rota mais barata até E não é a aresta direta vinda de B, e sim o desvio por D — caminho que o BFS jamais encontraria.",
		useCases: [
			"Planejamento de rotas em mapas de ruas, transporte e redes com custos não negativos.",
			"Roteamento por menor latência ou custo em redes de computadores.",
			"Qualquer problema de caminho mínimo com origem única em que o peso represente distância, tempo ou preço.",
			"Como base do A*, que acrescenta uma heurística ao Dijkstra para chegar mais rápido a um destino específico.",
		],
		pitfalls: [
			"Uma única aresta negativa quebra a garantia de corretude: uma vez fechado, o nó nunca é revisitado, então um caminho mais barato descoberto depois é ignorado. Use Bellman-Ford.",
			"Varrer um vetor em busca do mínimo em vez de usar heap transforma o tempo em O(V²), o que pesa em grafos grandes e esparsos.",
			"Não descartar entradas obsoletas do heap (nós já fechados) gera trabalho extra e pode produzir distâncias erradas se a verificação de fechados faltar.",
		],
		faq: [
			{
				question: "Qual é a complexidade do algoritmo de Dijkstra?",
				answer:
					"Com heap binário é O((V + E) log V). Com varredura simples de vetor é O(V²), que pode ser mais rápido em grafos muito densos, e com heap de Fibonacci é O(E + V log V) na teoria.",
			},
			{
				question: "Por que Dijkstra falha com pesos negativos?",
				answer:
					"O Dijkstra assume que, escolhido o nó não visitado mais próximo, não pode existir caminho mais barato até ele. Uma aresta negativa pode baratear uma rota mais longa depois, quebrando essa premissa. O Bellman-Ford trata pesos negativos corretamente.",
			},
			{
				question: "Dijkstra ou Bellman-Ford: qual usar?",
				answer:
					"Use Dijkstra quando todos os pesos forem não negativos: é bem mais rápido. Use Bellman-Ford quando houver pesos negativos ou quando precisar detectar ciclo negativo, aceitando o tempo O(V · E), mais lento.",
			},
			{
				question: "Dijkstra funciona em grafos não direcionados?",
				answer:
					"Sim. Uma aresta não direcionada equivale a duas arestas direcionadas de mesmo peso, e o algoritmo não muda. A exigência de pesos não negativos continua valendo.",
			},
		],
		relatedAlgorithmIds: ["bellman-ford", "bfs", "prim"],
	},
};
