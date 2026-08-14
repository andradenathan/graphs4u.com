import type { AlgorithmContent } from "@/content/algorithm-content";

export const connectedComponentsContent: AlgorithmContent = {
	en: {
		metaTitle: "Connected Components — Graph Component Visualizer",
		metaDescription:
			"Find the connected components of a graph you draw. How the traversal works, O(V + E) complexity, pseudocode, and connected vs strongly connected components.",
		heading: "Connected components",
		categoryLabel: "Components",
		summary:
			"A connected component is a maximal set of nodes where every node can reach every other by following edges. Finding all components takes one traversal per component and runs in O(V + E): start a search from any unvisited node, mark everything it reaches, and repeat until no node is left.",
		facts: [
			{ label: "Time complexity", value: "O(V + E)" },
			{ label: "Space complexity", value: "O(V)" },
			{ label: "Data structure", value: "Visited set + stack or Union-Find" },
			{ label: "Needs edge weights", value: "No" },
			{ label: "Graph type", value: "Undirected (weak connectivity)" },
			{ label: "Needs a source node", value: "No" },
		],
		howItWorks: [
			"Pick any node that has not been visited yet and open a new component.",
			"Run a DFS or BFS from it, adding every node it reaches to that component.",
			"When the traversal ends, the component is complete — nothing else is reachable from it.",
			"Repeat with the next unvisited node. The number of traversals is exactly the number of components.",
		],
		pseudocode: `CONNECTED_COMPONENTS(graph):
    visited <- {}
    components <- []

    for node in graph.nodes:
        if node in visited:
            continue

        component <- []
        stack <- [node]
        visited.add(node)

        while stack is not empty:
            current <- stack.removeLast()
            component.append(current)

            for neighbour in graph.neighbours(current):
                if neighbour not in visited:
                    visited.add(neighbour)
                    stack.addLast(neighbour)

        components.append(component)

    return components`,
		exampleNarrative:
			"This graph is deliberately disconnected. The traversal finds each group separately, and the result lists them as distinct components — including any node that has no edges at all, which forms a component of its own.",
		useCases: [
			"Checking whether a network is fully connected, or where it fell apart.",
			"Clustering related items — friends, duplicated records, related files.",
			"Preprocessing before algorithms that assume connectivity, such as a spanning tree.",
			"Counting isolated nodes and dead subgraphs in imported data.",
		],
		pitfalls: [
			"On a directed graph this reports weak connectivity, which ignores direction; strong connectivity needs Tarjan's or Kosaraju's algorithm.",
			"Forgetting isolated nodes: a node with no edges is still a component, and skipping it undercounts.",
			"Restarting the traversal from an already visited node, which splits one component into several.",
		],
		faq: [
			{
				question: "What is a connected component?",
				answer:
					"A maximal group of nodes in which every node is reachable from every other one. Maximal means nothing can be added: no edge leaves the group towards a node that is not already in it.",
			},
			{
				question: "What is the difference between connected and strongly connected?",
				answer:
					"Connectivity ignores edge direction, so it is about undirected reachability. Strong connectivity requires a directed path in both directions between every pair, and is computed with Tarjan's or Kosaraju's algorithm.",
			},
			{
				question: "What is the complexity of finding components?",
				answer:
					"O(V + E) in total, not per component: across all traversals each node is visited once and each edge inspected once. A Union-Find approach costs O(E · α(V)), which is effectively the same.",
			},
			{
				question: "Does an isolated node count as a component?",
				answer:
					"Yes. A node with no edges is trivially connected to itself and cannot be part of any other group, so it forms a component of size one.",
			},
		],
		relatedAlgorithmIds: ["dfs", "bfs", "kruskal"],
	},
	pt: {
		metaTitle: "Componentes Conexos — Visualizador de Componentes",
		metaDescription:
			"Encontre os componentes conexos de um grafo desenhado por você. Como funciona a travessia, complexidade O(V + E), pseudocódigo e conexo vs fortemente conexo.",
		heading: "Componentes conexos",
		categoryLabel: "Componentes",
		summary:
			"Um componente conexo é um conjunto maximal de nós em que cada nó alcança todos os outros seguindo arestas. Encontrar todos exige uma travessia por componente e roda em O(V + E): inicie uma busca em qualquer nó não visitado, marque tudo que ela alcança e repita até não sobrar nó.",
		facts: [
			{ label: "Complexidade de tempo", value: "O(V + E)" },
			{ label: "Complexidade de espaço", value: "O(V)" },
			{
				label: "Estrutura de dados",
				value: "Conjunto de visitados + pilha ou Union-Find",
			},
			{ label: "Precisa de pesos", value: "Não" },
			{ label: "Tipo de grafo", value: "Não direcionado (conexidade fraca)" },
			{ label: "Precisa de nó de origem", value: "Não" },
		],
		howItWorks: [
			"Escolha qualquer nó ainda não visitado e abra um novo componente.",
			"Rode um DFS ou BFS a partir dele, adicionando ao componente todo nó alcançado.",
			"Quando a travessia terminar, o componente está completo — nada mais é alcançável a partir dele.",
			"Repita com o próximo nó não visitado. O número de travessias é exatamente o número de componentes.",
		],
		pseudocode: `COMPONENTES_CONEXOS(grafo):
    visitados <- {}
    componentes <- []

    para cada no em grafo.nos:
        se no está em visitados:
            continue

        componente <- []
        pilha <- [no]
        visitados.adicionar(no)

        enquanto pilha não estiver vazia:
            atual <- pilha.removerUltimo()
            componente.adicionar(atual)

            para cada vizinho em grafo.vizinhos(atual):
                se vizinho não está em visitados:
                    visitados.adicionar(vizinho)
                    pilha.adicionarUltimo(vizinho)

        componentes.adicionar(componente)

    retornar componentes`,
		exampleNarrative:
			"Este grafo é propositalmente desconexo. A travessia encontra cada grupo separadamente e o resultado os lista como componentes distintos — inclusive qualquer nó sem nenhuma aresta, que forma um componente sozinho.",
		useCases: [
			"Verificar se uma rede está totalmente conectada, ou onde ela se partiu.",
			"Agrupar itens relacionados — amigos, registros duplicados, arquivos relacionados.",
			"Pré-processamento antes de algoritmos que assumem conexidade, como árvore geradora.",
			"Contar nós isolados e subgrafos mortos em dados importados.",
		],
		pitfalls: [
			"Em grafo direcionado isso reporta conexidade fraca, que ignora a direção; conexidade forte exige Tarjan ou Kosaraju.",
			"Esquecer os nós isolados: um nó sem arestas ainda é um componente, e ignorá-lo subestima a contagem.",
			"Reiniciar a travessia a partir de um nó já visitado, o que divide um componente em vários.",
		],
		faq: [
			{
				question: "O que é um componente conexo?",
				answer:
					"Um grupo maximal de nós em que cada nó é alcançável a partir de qualquer outro. Maximal significa que nada pode ser acrescentado: nenhuma aresta sai do grupo para um nó que ainda não esteja nele.",
			},
			{
				question: "Qual a diferença entre conexo e fortemente conexo?",
				answer:
					"Conexidade ignora a direção das arestas, tratando de alcançabilidade não direcionada. Conexidade forte exige caminho direcionado nos dois sentidos entre cada par, e é calculada com Tarjan ou Kosaraju.",
			},
			{
				question: "Qual a complexidade de encontrar os componentes?",
				answer:
					"O(V + E) no total, não por componente: somando todas as travessias, cada nó é visitado uma vez e cada aresta inspecionada uma vez. A abordagem com Union-Find custa O(E · α(V)), praticamente o mesmo.",
			},
			{
				question: "Um nó isolado conta como componente?",
				answer:
					"Sim. Um nó sem arestas é trivialmente conexo consigo mesmo e não pode fazer parte de nenhum outro grupo, então forma um componente de tamanho um.",
			},
		],
		relatedAlgorithmIds: ["dfs", "bfs", "kruskal"],
	},
};
