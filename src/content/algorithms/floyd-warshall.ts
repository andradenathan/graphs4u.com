import type { AlgorithmContent } from "@/content/algorithm-content";

export const floydWarshallContent: AlgorithmContent = {
	en: {
		metaTitle: "Floyd-Warshall — All-Pairs Shortest Path Visualizer",
		metaDescription:
			"Run Floyd-Warshall on a graph you draw. All-pairs shortest paths, O(V³) complexity, pseudocode, negative cycle detection, and when to prefer it over Dijkstra.",
		heading: "Floyd-Warshall algorithm",
		categoryLabel: "Shortest path",
		summary:
			"Floyd-Warshall computes the shortest distance between every pair of nodes at once. It fills a V × V matrix, asking for each intermediate node k whether going through k is cheaper than the route found so far. It runs in O(V³), handles negative weights, and flags negative cycles.",
		facts: [
			{ label: "Time complexity", value: "O(V³)" },
			{ label: "Space complexity", value: "O(V²)" },
			{ label: "Data structure", value: "V × V distance matrix" },
			{ label: "Needs edge weights", value: "Yes" },
			{ label: "Handles negative weights", value: "Yes" },
			{ label: "Detects negative cycles", value: "Yes" },
		],
		howItWorks: [
			"Build a V × V matrix: 0 on the diagonal, the edge weight where an edge exists, infinity elsewhere.",
			"For each node k, consider it as an intermediate stop for every pair (i, j).",
			"If distance(i, k) + distance(k, j) is smaller than distance(i, j), replace it. The order of the loops matters: k must be the outermost.",
			"After the last k, every entry holds a shortest distance. A negative value on the diagonal means a negative cycle exists.",
		],
		pseudocode: `FLOYD_WARSHALL(graph):
    distance <- V x V matrix filled with infinity
    for each node v:
        distance[v][v] <- 0
    for each (u, v, weight) in graph.edges:
        distance[u][v] <- min(distance[u][v], weight)

    for k in nodes:
        for i in nodes:
            for j in nodes:
                if distance[i][k] + distance[k][j] < distance[i][j]:
                    distance[i][j] <- distance[i][k] + distance[k][j]

    for each node v:
        if distance[v][v] < 0:
            return "negative cycle detected"

    return distance`,
		exampleNarrative:
			"The full V × V matrix is computed in one run. The editor shows the row for the node you pick as the source, which is why the distances below match what Dijkstra would return for that same node.",
		useCases: [
			"Small, dense graphs where distances between all pairs are needed at once.",
			"Precomputing a distance table that will be queried many times.",
			"Transitive closure and reachability, by replacing sums with boolean OR.",
			"Detecting negative cycles anywhere in the graph, not only from one source.",
		],
		pitfalls: [
			"Writing the loops in the wrong order — k must be the outer loop, otherwise the results are simply wrong.",
			"Using it on large graphs: at V = 5000, V³ is 1.25 × 10¹¹ operations, far beyond running V Dijkstras.",
			"Storing infinity as a large integer and then adding two of them, which overflows and creates fake shortcuts.",
		],
		faq: [
			{
				question: "What is the time complexity of Floyd-Warshall?",
				answer:
					"O(V³) time and O(V²) space, because of the three nested loops over all nodes. The cost does not depend on the number of edges, which makes it competitive on dense graphs and wasteful on sparse ones.",
			},
			{
				question: "Floyd-Warshall or Dijkstra for all pairs?",
				answer:
					"Running Dijkstra from every node costs O(V · (V + E) log V), which wins on sparse graphs. Floyd-Warshall's O(V³) is simpler, cache-friendly and competitive when the graph is dense or when negative weights are involved.",
			},
			{
				question: "Does Floyd-Warshall work with negative weights?",
				answer:
					"Yes, as long as there is no negative cycle. Negative edges are handled correctly, and a negative value appearing on the diagonal after the run proves that a negative cycle exists.",
			},
			{
				question: "Why must k be the outermost loop?",
				answer:
					"The invariant is that after iteration k, distance[i][j] is the shortest path using only the first k nodes as intermediates. Reordering the loops breaks that invariant, and paths through later intermediates are missed.",
			},
		],
		relatedAlgorithmIds: ["dijkstra", "bellman-ford", "a-star"],
	},
	pt: {
		metaTitle: "Floyd-Warshall — Caminhos Mínimos entre Todos os Pares",
		metaDescription:
			"Execute Floyd-Warshall em um grafo desenhado por você. Caminhos mínimos entre todos os pares, complexidade O(V³), pseudocódigo, detecção de ciclo negativo e quando preferir ao Dijkstra.",
		heading: "Algoritmo de Floyd-Warshall",
		categoryLabel: "Caminho mínimo",
		summary:
			"O Floyd-Warshall calcula de uma vez a menor distância entre todos os pares de nós. Ele preenche uma matriz V × V perguntando, para cada nó intermediário k, se passar por k é mais barato que a rota encontrada até então. Roda em O(V³), aceita pesos negativos e acusa ciclos negativos.",
		facts: [
			{ label: "Complexidade de tempo", value: "O(V³)" },
			{ label: "Complexidade de espaço", value: "O(V²)" },
			{ label: "Estrutura de dados", value: "Matriz de distâncias V × V" },
			{ label: "Precisa de pesos", value: "Sim" },
			{ label: "Aceita pesos negativos", value: "Sim" },
			{ label: "Detecta ciclos negativos", value: "Sim" },
		],
		howItWorks: [
			"Monte uma matriz V × V: 0 na diagonal, o peso da aresta onde ela existe e infinito no resto.",
			"Para cada nó k, considere-o como parada intermediária de todos os pares (i, j).",
			"Se distancia(i, k) + distancia(k, j) for menor que distancia(i, j), substitua. A ordem dos laços importa: k precisa ser o mais externo.",
			"Depois do último k, cada célula guarda uma distância mínima. Um valor negativo na diagonal indica ciclo negativo.",
		],
		pseudocode: `FLOYD_WARSHALL(grafo):
    distancia <- matriz V x V preenchida com infinito
    para cada nó v:
        distancia[v][v] <- 0
    para cada (u, v, peso) em grafo.arestas:
        distancia[u][v] <- min(distancia[u][v], peso)

    para k em nós:
        para i em nós:
            para j em nós:
                se distancia[i][k] + distancia[k][j] < distancia[i][j]:
                    distancia[i][j] <- distancia[i][k] + distancia[k][j]

    para cada nó v:
        se distancia[v][v] < 0:
            retornar "ciclo negativo detectado"

    retornar distancia`,
		exampleNarrative:
			"A matriz V × V completa é calculada em uma única execução. O editor mostra a linha do nó escolhido como origem, e é por isso que as distâncias abaixo coincidem com o que o Dijkstra devolveria para esse mesmo nó.",
		useCases: [
			"Grafos pequenos e densos em que se precisa das distâncias entre todos os pares de uma vez.",
			"Pré-computar uma tabela de distâncias que será consultada muitas vezes.",
			"Fecho transitivo e alcançabilidade, trocando somas por OU lógico.",
			"Detectar ciclos negativos em qualquer parte do grafo, não só a partir de uma origem.",
		],
		pitfalls: [
			"Escrever os laços na ordem errada — k precisa ser o laço externo, caso contrário os resultados simplesmente saem errados.",
			"Usar em grafos grandes: com V = 5000, V³ dá 1,25 × 10¹¹ operações, muito além de rodar V vezes o Dijkstra.",
			"Guardar infinito como inteiro grande e depois somar dois deles, o que estoura e cria atalhos falsos.",
		],
		faq: [
			{
				question: "Qual é a complexidade do Floyd-Warshall?",
				answer:
					"Tempo O(V³) e espaço O(V²), por causa dos três laços aninhados sobre todos os nós. O custo não depende do número de arestas, o que o torna competitivo em grafos densos e desperdício em grafos esparsos.",
			},
			{
				question: "Floyd-Warshall ou Dijkstra para todos os pares?",
				answer:
					"Rodar Dijkstra a partir de cada nó custa O(V · (V + E) log V), o que vence em grafos esparsos. O O(V³) do Floyd-Warshall é mais simples, amigável ao cache e competitivo quando o grafo é denso ou há pesos negativos.",
			},
			{
				question: "O Floyd-Warshall aceita pesos negativos?",
				answer:
					"Sim, desde que não haja ciclo negativo. Arestas negativas são tratadas corretamente, e um valor negativo aparecendo na diagonal ao final prova que existe um ciclo negativo.",
			},
			{
				question: "Por que k precisa ser o laço mais externo?",
				answer:
					"A invariante é que, após a iteração k, distancia[i][j] é o menor caminho usando apenas os k primeiros nós como intermediários. Reordenar os laços quebra essa invariante e caminhos por intermediários posteriores deixam de ser considerados.",
			},
		],
		relatedAlgorithmIds: ["dijkstra", "bellman-ford", "a-star"],
	},
};
