import type { AlgorithmContent } from "@/content/algorithm-content";

export const topologicalSortContent: AlgorithmContent = {
	en: {
		metaTitle: "Topological Sort — DAG Ordering Visualizer",
		metaDescription:
			"Run a topological sort on a directed acyclic graph you draw. Kahn's algorithm explained, pseudocode, O(V + E) complexity, and how it detects cycles.",
		heading: "Topological sort",
		categoryLabel: "Ordering",
		summary:
			"A topological sort orders the nodes of a directed acyclic graph so that every edge points forward: if there is an edge u → v, then u appears before v. Kahn's algorithm produces one in O(V + E) by repeatedly taking nodes with in-degree zero, and fails exactly when the graph has a cycle.",
		facts: [
			{ label: "Time complexity", value: "O(V + E)" },
			{ label: "Space complexity", value: "O(V)" },
			{ label: "Data structure", value: "In-degree counts + queue" },
			{ label: "Needs edge weights", value: "No" },
			{ label: "Graph type", value: "Directed, acyclic" },
			{ label: "Detects cycles", value: "Yes" },
		],
		howItWorks: [
			"Count the in-degree of every node: how many edges point into it.",
			"Put every node with in-degree zero into a queue — these have no unmet prerequisites.",
			"Remove a node from the queue, append it to the output, and decrement the in-degree of each of its successors. Any successor that reaches zero enters the queue.",
			"If the output contains every node, it is a valid topological order. If it is shorter, the remaining nodes form a cycle and no order exists.",
		],
		pseudocode: `TOPOLOGICAL_SORT(graph):
    inDegree[v] <- number of incoming edges of v
    queue <- all nodes with inDegree 0
    order <- []

    while queue is not empty:
        node <- queue.removeFirst()
        order.append(node)

        for successor in graph.successors(node):
            inDegree[successor] <- inDegree[successor] - 1
            if inDegree[successor] == 0:
                queue.addLast(successor)

    if size(order) < V:
        return "cycle detected — no topological order"

    return order`,
		exampleNarrative:
			"This directed acyclic graph has A as its only node without incoming edges, so any valid order starts there. The order below is one of several valid answers — a DAG usually has more than one.",
		useCases: [
			"Build systems and package managers resolving dependencies before compiling or installing.",
			"Task and course scheduling where some items must precede others.",
			"Spreadsheet recalculation and dataflow evaluation order.",
			"Shortest or longest paths in a DAG, which become linear time once the nodes are in topological order.",
		],
		pitfalls: [
			"Running it on a graph with a cycle: there is no valid order, and the algorithm must report that rather than return a partial list silently.",
			"Treating the result as unique — most DAGs admit many topological orders, so tests must not assume one specific answer.",
			"Forgetting that the graph must be directed: an undirected edge has no precedence to encode.",
		],
		faq: [
			{
				question: "What is the time complexity of topological sort?",
				answer:
					"O(V + E), whether you use Kahn's in-degree algorithm or DFS with post-order reversal. Each node enters the queue once and each edge is relaxed once. Space is O(V) for the in-degree table and the queue.",
			},
			{
				question: "Does a topological sort exist for every graph?",
				answer:
					"Only for directed acyclic graphs. A cycle creates a circular dependency where each node must come before the other, so no linear order can satisfy every edge.",
			},
			{
				question: "How does topological sort detect a cycle?",
				answer:
					"With Kahn's algorithm, if the queue empties while some nodes still have positive in-degree, those nodes are locked in a cycle. That makes topological sorting a practical cycle detector for directed graphs.",
			},
			{
				question: "Kahn's algorithm or DFS?",
				answer:
					"Both are O(V + E). Kahn's is iterative, reports cycles naturally and gives you the ordering directly. The DFS version is shorter to write but needs the reversed post-order and risks stack overflow on deep graphs.",
			},
		],
		relatedAlgorithmIds: ["dfs", "bfs", "bellman-ford"],
	},
	pt: {
		metaTitle: "Ordenação Topológica — Visualizador de Ordenação em DAG",
		metaDescription:
			"Execute ordenação topológica em um grafo acíclico direcionado desenhado por você. Algoritmo de Kahn explicado, pseudocódigo, complexidade O(V + E) e detecção de ciclos.",
		heading: "Ordenação topológica",
		categoryLabel: "Ordenação",
		summary:
			"A ordenação topológica organiza os nós de um grafo acíclico direcionado de modo que toda aresta aponte para frente: se existe a aresta u → v, então u aparece antes de v. O algoritmo de Kahn produz uma em O(V + E) retirando repetidamente nós com grau de entrada zero, e falha exatamente quando há ciclo.",
		facts: [
			{ label: "Complexidade de tempo", value: "O(V + E)" },
			{ label: "Complexidade de espaço", value: "O(V)" },
			{ label: "Estrutura de dados", value: "Graus de entrada + fila" },
			{ label: "Precisa de pesos", value: "Não" },
			{ label: "Tipo de grafo", value: "Direcionado e acíclico" },
			{ label: "Detecta ciclos", value: "Sim" },
		],
		howItWorks: [
			"Conte o grau de entrada de cada nó: quantas arestas apontam para ele.",
			"Coloque em uma fila todos os nós com grau de entrada zero — são os que não têm pré-requisitos pendentes.",
			"Remova um nó da fila, acrescente-o à saída e diminua em um o grau de entrada de cada sucessor. Todo sucessor que chegar a zero entra na fila.",
			"Se a saída contiver todos os nós, é uma ordenação topológica válida. Se for menor, os nós restantes formam um ciclo e não existe ordenação.",
		],
		pseudocode: `ORDENACAO_TOPOLOGICA(grafo):
    grauEntrada[v] <- número de arestas que chegam em v
    fila  <- todos os nós com grauEntrada 0
    ordem <- []

    enquanto fila não estiver vazia:
        no <- fila.removerPrimeiro()
        ordem.adicionar(no)

        para cada sucessor em grafo.sucessores(no):
            grauEntrada[sucessor] <- grauEntrada[sucessor] - 1
            se grauEntrada[sucessor] == 0:
                fila.adicionarUltimo(sucessor)

    se tamanho(ordem) < V:
        retornar "ciclo detectado — não existe ordenação topológica"

    retornar ordem`,
		exampleNarrative:
			"Neste grafo acíclico direcionado, A é o único nó sem arestas de entrada, então toda ordenação válida começa por ele. A ordem abaixo é uma das várias respostas válidas — um DAG normalmente admite mais de uma.",
		useCases: [
			"Sistemas de build e gerenciadores de pacotes resolvendo dependências antes de compilar ou instalar.",
			"Agendamento de tarefas e disciplinas em que alguns itens precisam vir antes de outros.",
			"Ordem de recálculo de planilhas e de avaliação em fluxos de dados.",
			"Caminhos mínimos ou máximos em DAGs, que passam a ser lineares depois de ordenar os nós topologicamente.",
		],
		pitfalls: [
			"Rodar em grafo com ciclo: não existe ordenação válida, e o algoritmo precisa reportar isso em vez de devolver uma lista parcial em silêncio.",
			"Tratar o resultado como único — a maioria dos DAGs admite muitas ordenações, então os testes não podem assumir uma resposta específica.",
			"Esquecer que o grafo precisa ser direcionado: uma aresta não direcionada não codifica precedência alguma.",
		],
		faq: [
			{
				question: "Qual é a complexidade da ordenação topológica?",
				answer:
					"O(V + E), tanto com o algoritmo de Kahn por grau de entrada quanto com DFS e pós-ordem invertida. Cada nó entra na fila uma vez e cada aresta é processada uma vez. O espaço é O(V), para a tabela de graus e a fila.",
			},
			{
				question: "Existe ordenação topológica para qualquer grafo?",
				answer:
					"Apenas para grafos acíclicos direcionados. Um ciclo cria uma dependência circular em que cada nó teria de vir antes do outro, então nenhuma ordem linear satisfaz todas as arestas.",
			},
			{
				question: "Como a ordenação topológica detecta ciclos?",
				answer:
					"Com o algoritmo de Kahn, se a fila esvazia enquanto ainda há nós com grau de entrada positivo, esses nós estão presos em um ciclo. Isso torna a ordenação topológica um detector prático de ciclos em grafos direcionados.",
			},
			{
				question: "Algoritmo de Kahn ou DFS?",
				answer:
					"Ambos são O(V + E). O de Kahn é iterativo, reporta ciclos naturalmente e já entrega a ordenação. A versão com DFS é mais curta, mas exige inverter a pós-ordem e arrisca estourar a pilha em grafos profundos.",
			},
		],
		relatedAlgorithmIds: ["dfs", "bfs", "bellman-ford"],
	},
};
