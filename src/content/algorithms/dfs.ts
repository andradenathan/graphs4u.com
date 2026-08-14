import type { AlgorithmContent } from "@/content/algorithm-content";

export const dfsContent: AlgorithmContent = {
	en: {
		metaTitle: "DFS (Depth-First Search) — Visualizer & Explanation",
		metaDescription:
			"Run depth-first search on a graph you draw. Step-by-step DFS traversal, recursive and iterative pseudocode, O(V + E) complexity, and DFS vs BFS.",
		heading: "Depth-first search (DFS)",
		categoryLabel: "Traversal",
		summary:
			"Depth-first search follows one branch as deep as it goes before backtracking to the last node with an unexplored neighbour. It uses a stack — explicit or the call stack via recursion — runs in O(V + E) time, and is the base of cycle detection, topological sort and connected components.",
		facts: [
			{ label: "Time complexity", value: "O(V + E)" },
			{ label: "Space complexity", value: "O(V)" },
			{ label: "Data structure", value: "Stack (LIFO) or recursion" },
			{ label: "Needs edge weights", value: "No" },
			{ label: "Works on directed graphs", value: "Yes" },
			{ label: "Shortest path guarantee", value: "No" },
		],
		howItWorks: [
			"Start at the source node and mark it as visited.",
			"Pick any unvisited neighbour and move to it, going as deep as possible.",
			"When the current node has no unvisited neighbours, backtrack to the previous node and try its remaining neighbours.",
			"Repeat until every node reachable from the source has been visited.",
		],
		pseudocode: `DFS(graph, source):
    stack <- [source]
    seen  <- {}
    order <- []

    while stack is not empty:
        node <- stack.removeLast()
        if node in seen:
            continue

        seen.add(node)
        order.append(node)

        for neighbour in reverse(graph.neighbours(node)):
            if neighbour not in seen:
                stack.addLast(neighbour)

    return order`,
		exampleNarrative:
			"Starting from A, DFS dives down one branch until it hits a dead end, then backtracks and takes the next unexplored edge. The order below is the traversal produced by the algorithm on this graph.",
		useCases: [
			"Detecting cycles in directed and undirected graphs.",
			"Producing a topological order of a directed acyclic graph.",
			"Finding connected components and strongly connected components.",
			"Exhaustive exploration such as maze solving, backtracking and puzzle search.",
		],
		pitfalls: [
			"Recursive DFS overflows the call stack on deep graphs; prefer the iterative version for large inputs.",
			"DFS does not find shortest paths — the first path it reaches a node by is often not the shortest one.",
			"Forgetting to check the visited set when popping from the stack makes nodes appear more than once in the traversal.",
		],
		faq: [
			{
				question: "What is the time complexity of DFS?",
				answer:
					"DFS runs in O(V + E) time: every node is visited once and every edge is inspected once. Space is O(V) for the visited set plus the stack, which in the worst case holds a whole path through the graph.",
			},
			{
				question: "What is the difference between DFS and BFS?",
				answer:
					"DFS goes deep along one branch before backtracking and uses a stack; BFS expands level by level and uses a queue. BFS finds the fewest-edges path, while DFS is better for cycle detection, topological sorting and component analysis.",
			},
			{
				question: "Can DFS detect a cycle?",
				answer:
					"Yes. In a directed graph, a cycle exists if DFS reaches a node that is currently on the recursion stack. In an undirected graph, a cycle exists if DFS reaches an already visited node that is not the immediate parent.",
			},
			{
				question: "Should I write DFS recursively or iteratively?",
				answer:
					"Both are O(V + E). Recursion is shorter and reads better, but risks a stack overflow on graphs with long paths. An explicit stack is safer for large or adversarial inputs.",
			},
		],
		relatedAlgorithmIds: ["bfs", "topological-sort", "kruskal"],
	},
	pt: {
		metaTitle: "DFS (Busca em Profundidade) — Visualizador e Explicação",
		metaDescription:
			"Execute busca em profundidade em um grafo desenhado por você. Passo a passo do DFS, pseudocódigo recursivo e iterativo, complexidade O(V + E) e DFS vs BFS.",
		heading: "Busca em profundidade (DFS)",
		categoryLabel: "Travessia",
		summary:
			"A busca em profundidade segue um ramo até o fim antes de retroceder ao último nó com vizinho inexplorado. Usa uma pilha — explícita ou a pilha de chamadas via recursão —, roda em tempo O(V + E) e é a base de detecção de ciclos, ordenação topológica e componentes conexos.",
		facts: [
			{ label: "Complexidade de tempo", value: "O(V + E)" },
			{ label: "Complexidade de espaço", value: "O(V)" },
			{ label: "Estrutura de dados", value: "Pilha (LIFO) ou recursão" },
			{ label: "Precisa de pesos", value: "Não" },
			{ label: "Funciona em grafos direcionados", value: "Sim" },
			{ label: "Garante caminho mínimo", value: "Não" },
		],
		howItWorks: [
			"Comece no nó de origem e marque-o como visitado.",
			"Escolha qualquer vizinho não visitado e avance para ele, indo o mais fundo possível.",
			"Quando o nó atual não tiver vizinhos não visitados, retroceda ao nó anterior e tente os vizinhos restantes.",
			"Repita até visitar todos os nós alcançáveis a partir da origem.",
		],
		pseudocode: `DFS(grafo, origem):
    pilha  <- [origem]
    vistos <- {}
    ordem  <- []

    enquanto pilha não estiver vazia:
        no <- pilha.removerUltimo()
        se no está em vistos:
            continue

        vistos.adicionar(no)
        ordem.adicionar(no)

        para cada vizinho em inverso(grafo.vizinhos(no)):
            se vizinho não está em vistos:
                pilha.adicionarUltimo(vizinho)

    retornar ordem`,
		exampleNarrative:
			"Partindo de A, o DFS mergulha por um ramo até chegar a um beco sem saída, depois retrocede e toma a próxima aresta inexplorada. A ordem abaixo é a travessia produzida pelo algoritmo neste grafo.",
		useCases: [
			"Detectar ciclos em grafos direcionados e não direcionados.",
			"Produzir uma ordenação topológica de um grafo acíclico direcionado.",
			"Encontrar componentes conexos e componentes fortemente conexos.",
			"Exploração exaustiva, como resolver labirintos, backtracking e busca em quebra-cabeças.",
		],
		pitfalls: [
			"O DFS recursivo estoura a pilha de chamadas em grafos profundos; prefira a versão iterativa para entradas grandes.",
			"O DFS não encontra caminhos mínimos — o primeiro caminho pelo qual ele chega a um nó costuma não ser o menor.",
			"Esquecer de verificar o conjunto de visitados ao desempilhar faz nós aparecerem mais de uma vez na travessia.",
		],
		faq: [
			{
				question: "Qual é a complexidade do DFS?",
				answer:
					"O DFS roda em tempo O(V + E): cada nó é visitado uma vez e cada aresta é inspecionada uma vez. O espaço é O(V), para o conjunto de visitados mais a pilha, que no pior caso guarda um caminho inteiro do grafo.",
			},
			{
				question: "Qual a diferença entre DFS e BFS?",
				answer:
					"O DFS aprofunda por um ramo antes de retroceder e usa pilha; o BFS expande nível a nível e usa fila. O BFS encontra o caminho com menos arestas, enquanto o DFS é melhor para detectar ciclos, ordenar topologicamente e analisar componentes.",
			},
			{
				question: "O DFS detecta ciclos?",
				answer:
					"Sim. Em um grafo direcionado, existe ciclo se o DFS alcança um nó que está na pilha de recursão. Em um grafo não direcionado, existe ciclo se o DFS alcança um nó já visitado que não seja o pai imediato.",
			},
			{
				question: "Escrevo o DFS de forma recursiva ou iterativa?",
				answer:
					"As duas são O(V + E). A recursão é mais curta e legível, mas arrisca estourar a pilha em grafos com caminhos longos. A pilha explícita é mais segura para entradas grandes.",
			},
		],
		relatedAlgorithmIds: ["bfs", "topological-sort", "kruskal"],
	},
};
