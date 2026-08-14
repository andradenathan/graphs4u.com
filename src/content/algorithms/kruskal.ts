import type { AlgorithmContent } from "@/content/algorithm-content";

export const kruskalContent: AlgorithmContent = {
	en: {
		metaTitle: "Kruskal's Algorithm — Minimum Spanning Tree Visualizer",
		metaDescription:
			"Build a minimum spanning tree with Kruskal's algorithm on a graph you draw. Union-Find explained, pseudocode, O(E log E) complexity, and Kruskal vs Prim.",
		heading: "Kruskal's algorithm (minimum spanning tree)",
		categoryLabel: "Minimum spanning tree",
		summary:
			"Kruskal's algorithm builds a minimum spanning tree by sorting all edges by weight and adding each one that connects two different components, skipping edges that would close a cycle. Union-Find makes the cycle test almost constant time, giving O(E log E) overall — dominated by the sort.",
		facts: [
			{ label: "Time complexity", value: "O(E log E)" },
			{ label: "Space complexity", value: "O(V + E)" },
			{ label: "Data structure", value: "Sorted edge list + Union-Find" },
			{ label: "Needs edge weights", value: "Yes" },
			{ label: "Graph type", value: "Undirected" },
			{ label: "Needs a source node", value: "No" },
		],
		howItWorks: [
			"Sort every edge of the graph by weight, from cheapest to most expensive.",
			"Start with each node in its own component and an empty tree.",
			"Walk the sorted edges: if an edge joins two different components, add it to the tree and merge the components; otherwise discard it, because it would create a cycle.",
			"Stop when the tree has V − 1 edges. On a disconnected graph you end up with a minimum spanning forest instead.",
		],
		pseudocode: `KRUSKAL(graph):
    tree <- []
    unionFind <- makeSet(each node)

    for (u, v, weight) in sortByWeight(graph.edges):
        if unionFind.find(u) != unionFind.find(v):
            unionFind.union(u, v)
            tree.append((u, v, weight))
            if size(tree) == V - 1:
                break

    return tree`,
		exampleNarrative:
			"Edges are considered from the cheapest upwards. The highlighted edges below form the minimum spanning tree: the cheapest set of edges that keeps every node connected without a single cycle.",
		useCases: [
			"Laying out cable, pipes or roads that must reach every site at minimum total cost.",
			"Clustering: removing the k − 1 most expensive tree edges splits the data into k clusters.",
			"Network design where redundancy is not needed, only connectivity.",
			"Approximation building blocks, such as the classic 2-approximation for metric TSP.",
		],
		pitfalls: [
			"Skipping the Union-Find and testing cycles with a traversal turns the algorithm into O(V · E).",
			"Union-Find without path compression and union by rank loses the near-constant cost that makes Kruskal fast.",
			"Kruskal is defined for undirected graphs — on a directed graph the minimum spanning arborescence needs a different algorithm (Chu-Liu/Edmonds).",
		],
		faq: [
			{
				question: "What is the time complexity of Kruskal's algorithm?",
				answer:
					"O(E log E), which is the cost of sorting the edges; the Union-Find operations add only a near-constant inverse Ackermann factor. Since E ≤ V², this is equivalent to O(E log V).",
			},
			{
				question: "Kruskal or Prim — which is better?",
				answer:
					"Both produce a minimum spanning tree of the same total weight. Kruskal sorts edges globally and is a natural fit for sparse graphs or an edge list; Prim grows one tree from a source and is faster on dense graphs with an adjacency structure.",
			},
			{
				question: "Does Kruskal work on a disconnected graph?",
				answer:
					"Yes. It never fails, but it cannot connect what is not connected: the result is a minimum spanning forest, one tree per connected component, with fewer than V − 1 edges in total.",
			},
			{
				question: "Can a graph have more than one minimum spanning tree?",
				answer:
					"Yes, whenever two or more edges share the same weight. All of them have the same total weight; the one Kruskal returns depends on how ties are broken during sorting.",
			},
		],
		relatedAlgorithmIds: ["prim", "dijkstra", "dfs"],
	},
	pt: {
		metaTitle: "Algoritmo de Kruskal — Visualizador de Árvore Geradora Mínima",
		metaDescription:
			"Construa uma árvore geradora mínima com o algoritmo de Kruskal em um grafo desenhado por você. Union-Find explicado, pseudocódigo, complexidade O(E log E) e Kruskal vs Prim.",
		heading: "Algoritmo de Kruskal (árvore geradora mínima)",
		categoryLabel: "Árvore geradora mínima",
		summary:
			"O algoritmo de Kruskal constrói uma árvore geradora mínima ordenando todas as arestas por peso e adicionando cada uma que conecta dois componentes diferentes, descartando as que fechariam ciclo. O Union-Find deixa o teste de ciclo quase constante, resultando em O(E log E) — custo dominado pela ordenação.",
		facts: [
			{ label: "Complexidade de tempo", value: "O(E log E)" },
			{ label: "Complexidade de espaço", value: "O(V + E)" },
			{
				label: "Estrutura de dados",
				value: "Lista de arestas ordenada + Union-Find",
			},
			{ label: "Precisa de pesos", value: "Sim" },
			{ label: "Tipo de grafo", value: "Não direcionado" },
			{ label: "Precisa de nó de origem", value: "Não" },
		],
		howItWorks: [
			"Ordene todas as arestas do grafo por peso, da mais barata para a mais cara.",
			"Comece com cada nó em seu próprio componente e uma árvore vazia.",
			"Percorra as arestas ordenadas: se a aresta une dois componentes diferentes, adicione-a à árvore e funda os componentes; caso contrário, descarte-a, pois criaria um ciclo.",
			"Pare quando a árvore tiver V − 1 arestas. Em um grafo desconexo o resultado é uma floresta geradora mínima.",
		],
		pseudocode: `KRUSKAL(grafo):
    arvore <- []
    unionFind <- criarConjunto(cada nó)

    para cada (u, v, peso) em ordenarPorPeso(grafo.arestas):
        se unionFind.encontrar(u) != unionFind.encontrar(v):
            unionFind.unir(u, v)
            arvore.adicionar((u, v, peso))
            se tamanho(arvore) == V - 1:
                pare

    retornar arvore`,
		exampleNarrative:
			"As arestas são consideradas da mais barata em diante. As arestas destacadas abaixo formam a árvore geradora mínima: o conjunto mais barato de arestas que mantém todos os nós conectados sem nenhum ciclo.",
		useCases: [
			"Passar cabos, tubulações ou estradas que precisam alcançar todos os pontos com custo total mínimo.",
			"Agrupamento: remover as k − 1 arestas mais caras da árvore divide os dados em k grupos.",
			"Projeto de redes em que não se busca redundância, apenas conectividade.",
			"Blocos de construção de aproximações, como a clássica 2-aproximação do TSP métrico.",
		],
		pitfalls: [
			"Dispensar o Union-Find e testar ciclos com uma travessia transforma o algoritmo em O(V · E).",
			"Union-Find sem compressão de caminho e união por rank perde o custo quase constante que torna o Kruskal rápido.",
			"O Kruskal é definido para grafos não direcionados — em grafos direcionados, a arborescência geradora mínima exige outro algoritmo (Chu-Liu/Edmonds).",
		],
		faq: [
			{
				question: "Qual é a complexidade do algoritmo de Kruskal?",
				answer:
					"O(E log E), que é o custo de ordenar as arestas; as operações de Union-Find acrescentam apenas um fator quase constante (inverso de Ackermann). Como E ≤ V², isso equivale a O(E log V).",
			},
			{
				question: "Kruskal ou Prim: qual é melhor?",
				answer:
					"Os dois produzem árvore geradora mínima de mesmo peso total. O Kruskal ordena arestas globalmente e combina com grafos esparsos ou lista de arestas; o Prim cresce uma árvore a partir de uma origem e é mais rápido em grafos densos com estrutura de adjacência.",
			},
			{
				question: "O Kruskal funciona em grafo desconexo?",
				answer:
					"Sim. Ele não falha, mas não conecta o que não está conectado: o resultado é uma floresta geradora mínima, uma árvore por componente conexo, com menos de V − 1 arestas no total.",
			},
			{
				question: "Um grafo pode ter mais de uma árvore geradora mínima?",
				answer:
					"Sim, sempre que duas ou mais arestas tiverem o mesmo peso. Todas têm o mesmo peso total; qual delas o Kruskal devolve depende de como os empates são desfeitos na ordenação.",
			},
		],
		relatedAlgorithmIds: ["prim", "dijkstra", "dfs"],
	},
};
