import type { AlgorithmContent } from "@/content/algorithm-content";

export const primContent: AlgorithmContent = {
	en: {
		metaTitle: "Prim's Algorithm — Minimum Spanning Tree Visualizer",
		metaDescription:
			"Build a minimum spanning tree with Prim's algorithm on a graph you draw. Step-by-step growth, pseudocode, O(E log V) complexity, and Prim vs Kruskal vs Dijkstra.",
		heading: "Prim's algorithm (minimum spanning tree)",
		categoryLabel: "Minimum spanning tree",
		summary:
			"Prim's algorithm grows a minimum spanning tree from a single starting node: at every step it adds the cheapest edge that connects the tree to a node outside it. With a binary heap it runs in O(E log V) and always produces a tree of the same total weight as Kruskal's.",
		facts: [
			{ label: "Time complexity", value: "O(E log V) with a binary heap" },
			{ label: "Space complexity", value: "O(V + E)" },
			{ label: "Data structure", value: "Priority queue (min-heap)" },
			{ label: "Needs edge weights", value: "Yes" },
			{ label: "Graph type", value: "Undirected" },
			{ label: "Needs a source node", value: "Yes (any node works)" },
		],
		howItWorks: [
			"Pick any node as the start; the tree begins with that single node.",
			"Put all edges leaving the tree into a priority queue keyed by weight.",
			"Remove the cheapest edge. If it leads to a node already in the tree, discard it; otherwise add both the edge and the node to the tree.",
			"Push the new node's edges into the queue and repeat until the tree spans every reachable node.",
		],
		pseudocode: `PRIM(graph, start):
    inTree <- {start}
    tree   <- []
    queue  <- min-heap of edges leaving start

    while queue is not empty and size(tree) < V - 1:
        (weight, u, v) <- queue.popMinimum()
        if v in inTree:
            continue

        inTree.add(v)
        tree.append((u, v, weight))

        for (v, w, weight) in graph.edges(v):
            if w not in inTree:
                queue.push((weight, v, w))

    return tree`,
		exampleNarrative:
			"Starting at A, the tree grows one node at a time, always across the cheapest available edge. The highlighted edges below are the minimum spanning tree — the same total weight Kruskal produces, possibly reached in a different order.",
		useCases: [
			"Dense networks where an adjacency structure is already available.",
			"Incremental network design, where the tree must grow outward from a fixed hub.",
			"Maze generation, by growing a spanning tree over a grid with random weights.",
			"Any minimum spanning tree problem when edges are easier to reach per node than as a global sorted list.",
		],
		pitfalls: [
			"Confusing Prim with Dijkstra: Prim compares the weight of the single connecting edge, Dijkstra compares the accumulated distance from the source.",
			"Not checking whether the popped edge leads to a node already in the tree creates cycles.",
			"On a disconnected graph, Prim only spans the component containing the start node.",
		],
		faq: [
			{
				question: "What is the time complexity of Prim's algorithm?",
				answer:
					"O(E log V) with a binary heap, or O(V²) with an adjacency matrix and a linear minimum scan, which is actually preferable on very dense graphs where E approaches V².",
			},
			{
				question: "What is the difference between Prim and Dijkstra?",
				answer:
					"The loops look almost identical, but the key differs. Prim keys the queue by the weight of the edge connecting a node to the tree; Dijkstra keys it by the total distance from the source. That single change turns a spanning tree into shortest paths.",
			},
			{
				question: "Does the starting node change the result?",
				answer:
					"It can change which tree you get when several edges tie in weight, but never the total weight: every minimum spanning tree of a graph has the same cost, whatever node you start from.",
			},
			{
				question: "Prim or Kruskal for a dense graph?",
				answer:
					"Prim. It avoids sorting all E edges and works locally from an adjacency structure, so it scales better as the graph gets denser. Kruskal is more natural for sparse graphs already stored as an edge list.",
			},
		],
		relatedAlgorithmIds: ["kruskal", "dijkstra", "bfs"],
	},
	pt: {
		metaTitle: "Algoritmo de Prim — Visualizador de Árvore Geradora Mínima",
		metaDescription:
			"Construa uma árvore geradora mínima com o algoritmo de Prim em um grafo desenhado por você. Crescimento passo a passo, pseudocódigo, complexidade O(E log V) e Prim vs Kruskal.",
		heading: "Algoritmo de Prim (árvore geradora mínima)",
		categoryLabel: "Árvore geradora mínima",
		summary:
			"O algoritmo de Prim faz a árvore geradora mínima crescer a partir de um nó inicial: a cada passo adiciona a aresta mais barata que liga a árvore a um nó de fora dela. Com heap binário roda em O(E log V) e sempre produz uma árvore de peso total igual à do Kruskal.",
		facts: [
			{ label: "Complexidade de tempo", value: "O(E log V) com heap binário" },
			{ label: "Complexidade de espaço", value: "O(V + E)" },
			{ label: "Estrutura de dados", value: "Fila de prioridade (min-heap)" },
			{ label: "Precisa de pesos", value: "Sim" },
			{ label: "Tipo de grafo", value: "Não direcionado" },
			{
				label: "Precisa de nó de origem",
				value: "Sim (qualquer nó serve)",
			},
		],
		howItWorks: [
			"Escolha qualquer nó como início; a árvore começa com esse único nó.",
			"Coloque todas as arestas que saem da árvore em uma fila de prioridade ordenada por peso.",
			"Remova a aresta mais barata. Se ela leva a um nó que já está na árvore, descarte-a; caso contrário, adicione a aresta e o nó à árvore.",
			"Insira as arestas do novo nó na fila e repita até a árvore cobrir todos os nós alcançáveis.",
		],
		pseudocode: `PRIM(grafo, inicio):
    naArvore <- {inicio}
    arvore   <- []
    fila     <- min-heap com as arestas que saem de inicio

    enquanto fila não estiver vazia e tamanho(arvore) < V - 1:
        (peso, u, v) <- fila.removerMinimo()
        se v está em naArvore:
            continue

        naArvore.adicionar(v)
        arvore.adicionar((u, v, peso))

        para cada (v, w, peso) em grafo.arestas(v):
            se w não está em naArvore:
                fila.inserir((peso, v, w))

    retornar arvore`,
		exampleNarrative:
			"Começando em A, a árvore cresce um nó por vez, sempre pela aresta mais barata disponível. As arestas destacadas abaixo formam a árvore geradora mínima — o mesmo peso total que o Kruskal produz, possivelmente alcançado em outra ordem.",
		useCases: [
			"Redes densas em que já existe uma estrutura de adjacência disponível.",
			"Projeto incremental de rede, quando a árvore precisa crescer a partir de um ponto central fixo.",
			"Geração de labirintos, fazendo crescer uma árvore geradora sobre uma grade com pesos aleatórios.",
			"Qualquer problema de árvore geradora mínima em que as arestas são mais fáceis de obter por nó do que como lista global ordenada.",
		],
		pitfalls: [
			"Confundir Prim com Dijkstra: o Prim compara o peso da aresta de ligação, o Dijkstra compara a distância acumulada desde a origem.",
			"Não verificar se a aresta removida leva a um nó já presente na árvore cria ciclos.",
			"Em grafo desconexo, o Prim cobre apenas o componente que contém o nó inicial.",
		],
		faq: [
			{
				question: "Qual é a complexidade do algoritmo de Prim?",
				answer:
					"O(E log V) com heap binário, ou O(V²) com matriz de adjacência e varredura linear do mínimo — versão que na prática é preferível em grafos muito densos, onde E se aproxima de V².",
			},
			{
				question: "Qual a diferença entre Prim e Dijkstra?",
				answer:
					"Os laços são quase idênticos, mas a chave muda. O Prim ordena a fila pelo peso da aresta que liga o nó à árvore; o Dijkstra ordena pela distância total desde a origem. Só essa troca transforma árvore geradora em caminhos mínimos.",
			},
			{
				question: "O nó inicial muda o resultado?",
				answer:
					"Pode mudar qual árvore você obtém quando há empate de pesos, mas nunca o peso total: toda árvore geradora mínima de um grafo tem o mesmo custo, independentemente do nó de partida.",
			},
			{
				question: "Prim ou Kruskal em grafo denso?",
				answer:
					"Prim. Ele evita ordenar todas as E arestas e trabalha localmente a partir da adjacência, escalando melhor conforme o grafo fica mais denso. O Kruskal é mais natural em grafos esparsos já armazenados como lista de arestas.",
			},
		],
		relatedAlgorithmIds: ["kruskal", "dijkstra", "bfs"],
	},
};
