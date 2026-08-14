import type { AlgorithmContent } from "@/content/algorithm-content";

export const bfsContent: AlgorithmContent = {
	en: {
		metaTitle: "BFS (Breadth-First Search) — Visualizer & Explanation",
		metaDescription:
			"Run breadth-first search on a graph you draw. Step-by-step BFS traversal, pseudocode, O(V + E) complexity, and when to use BFS instead of DFS or Dijkstra.",
		heading: "Breadth-first search (BFS)",
		categoryLabel: "Traversal",
		summary:
			"Breadth-first search explores a graph level by level: it visits every neighbour of the current node before moving one step further away from the source. It uses a queue, runs in O(V + E) time, and finds the shortest path in edge count on unweighted graphs.",
		facts: [
			{ label: "Time complexity", value: "O(V + E)" },
			{ label: "Space complexity", value: "O(V)" },
			{ label: "Data structure", value: "Queue (FIFO)" },
			{ label: "Needs edge weights", value: "No" },
			{ label: "Works on directed graphs", value: "Yes" },
			{ label: "Shortest path guarantee", value: "Yes, on unweighted graphs" },
		],
		howItWorks: [
			"Put the source node in a queue and mark it as visited.",
			"Remove the node at the front of the queue and record it as visited.",
			"Add every unvisited neighbour of that node to the back of the queue and mark it visited immediately, so it is never queued twice.",
			"Repeat until the queue is empty. Nodes come out in non-decreasing distance from the source.",
		],
		pseudocode: `BFS(graph, source):
    queue  <- [source]
    seen   <- {source}
    order  <- []

    while queue is not empty:
        node <- queue.removeFirst()
        order.append(node)

        for neighbour in graph.neighbours(node):
            if neighbour not in seen:
                seen.add(neighbour)
                queue.addLast(neighbour)

    return order`,
		exampleNarrative:
			"Starting from A, BFS visits A, then its direct neighbours B and D, then the nodes two steps away, and so on. The highlighted nodes below are the traversal order produced by the algorithm on this graph.",
		useCases: [
			"Shortest path in number of edges on unweighted graphs (mazes, grids, social distance).",
			"Finding all nodes reachable from a source, by distance layer.",
			"Testing whether a graph is bipartite, by two-colouring each layer.",
			"Crawling or flood-fill where nearby nodes should be processed first.",
		],
		pitfalls: [
			"Marking a node as visited when it leaves the queue instead of when it enters causes the same node to be queued many times.",
			"BFS ignores edge weights — on a weighted graph the fewest-edges path is often not the cheapest one. Use Dijkstra instead.",
			"On very wide graphs the queue can hold a large fraction of the nodes, so memory, not time, becomes the limit.",
		],
		faq: [
			{
				question: "What is the time complexity of BFS?",
				answer:
					"BFS runs in O(V + E) time, where V is the number of nodes and E the number of edges, because every node is dequeued once and every edge is examined once. Space is O(V) for the queue and the visited set.",
			},
			{
				question: "When should I use BFS instead of DFS?",
				answer:
					"Use BFS when you need the shortest path in number of edges, or when the answer is likely close to the source. Use DFS when you need to explore whole branches, detect cycles, or produce a topological order.",
			},
			{
				question: "Does BFS find the shortest path?",
				answer:
					"Yes, but only on unweighted graphs (or graphs where every edge has the same weight). With varying weights, BFS can return a path with fewer edges but a higher total cost; Dijkstra is the correct choice there.",
			},
			{
				question: "Does BFS work on directed graphs?",
				answer:
					"Yes. On a directed graph BFS follows only outgoing edges, so it visits exactly the nodes reachable from the source by respecting edge direction.",
			},
		],
		relatedAlgorithmIds: ["dfs", "dijkstra", "topological-sort"],
	},
	pt: {
		metaTitle: "BFS (Busca em Largura) — Visualizador e Explicação",
		metaDescription:
			"Execute busca em largura em um grafo desenhado por você. Passo a passo do BFS, pseudocódigo, complexidade O(V + E) e quando usar BFS em vez de DFS ou Dijkstra.",
		heading: "Busca em largura (BFS)",
		categoryLabel: "Travessia",
		summary:
			"A busca em largura explora o grafo nível a nível: visita todos os vizinhos do nó atual antes de se afastar mais um passo da origem. Usa uma fila, roda em tempo O(V + E) e encontra o caminho com menos arestas em grafos não ponderados.",
		facts: [
			{ label: "Complexidade de tempo", value: "O(V + E)" },
			{ label: "Complexidade de espaço", value: "O(V)" },
			{ label: "Estrutura de dados", value: "Fila (FIFO)" },
			{ label: "Precisa de pesos", value: "Não" },
			{ label: "Funciona em grafos direcionados", value: "Sim" },
			{
				label: "Garante caminho mínimo",
				value: "Sim, em grafos não ponderados",
			},
		],
		howItWorks: [
			"Coloque o nó de origem em uma fila e marque-o como visitado.",
			"Remova o nó do início da fila e registre-o na ordem de visita.",
			"Adicione ao fim da fila todos os vizinhos ainda não visitados desse nó, marcando-os como visitados na hora, para que nunca entrem na fila duas vezes.",
			"Repita até a fila esvaziar. Os nós saem em ordem não decrescente de distância até a origem.",
		],
		pseudocode: `BFS(grafo, origem):
    fila   <- [origem]
    vistos <- {origem}
    ordem  <- []

    enquanto fila não estiver vazia:
        no <- fila.removerPrimeiro()
        ordem.adicionar(no)

        para cada vizinho em grafo.vizinhos(no):
            se vizinho não está em vistos:
                vistos.adicionar(vizinho)
                fila.adicionarUltimo(vizinho)

    retornar ordem`,
		exampleNarrative:
			"Partindo de A, o BFS visita A, depois seus vizinhos diretos B e D, depois os nós a dois passos de distância, e assim por diante. Os nós destacados abaixo são a ordem de travessia produzida pelo algoritmo neste grafo.",
		useCases: [
			"Caminho com menos arestas em grafos não ponderados (labirintos, grades, distância social).",
			"Encontrar todos os nós alcançáveis a partir de uma origem, camada por camada.",
			"Verificar se um grafo é bipartido, colorindo cada camada com duas cores.",
			"Rastreamento ou preenchimento em que os nós próximos devem ser processados primeiro.",
		],
		pitfalls: [
			"Marcar o nó como visitado ao sair da fila, e não ao entrar, faz o mesmo nó ser enfileirado várias vezes.",
			"O BFS ignora pesos — em um grafo ponderado, o caminho com menos arestas costuma não ser o mais barato. Use Dijkstra nesse caso.",
			"Em grafos muito largos a fila pode guardar boa parte dos nós, e o limite passa a ser memória, não tempo.",
		],
		faq: [
			{
				question: "Qual é a complexidade do BFS?",
				answer:
					"O BFS roda em tempo O(V + E), onde V é o número de nós e E o de arestas, porque cada nó sai da fila uma vez e cada aresta é examinada uma vez. O espaço é O(V), para a fila e o conjunto de visitados.",
			},
			{
				question: "Quando usar BFS em vez de DFS?",
				answer:
					"Use BFS quando precisar do caminho com menos arestas ou quando a resposta provavelmente está perto da origem. Use DFS para percorrer ramos inteiros, detectar ciclos ou produzir uma ordenação topológica.",
			},
			{
				question: "O BFS encontra o caminho mínimo?",
				answer:
					"Sim, mas apenas em grafos não ponderados (ou com todas as arestas de mesmo peso). Com pesos diferentes, o BFS pode devolver um caminho com menos arestas e custo total maior; nesse caso o correto é Dijkstra.",
			},
			{
				question: "O BFS funciona em grafos direcionados?",
				answer:
					"Sim. Em um grafo direcionado o BFS segue apenas as arestas de saída, visitando exatamente os nós alcançáveis a partir da origem respeitando a direção das arestas.",
			},
		],
		relatedAlgorithmIds: ["dfs", "dijkstra", "topological-sort"],
	},
};
