export const languages = [
    { code: "en", label: "English" },
    { code: "pt", label: "Português" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

const translations: Record<LanguageCode, Record<string, string>> = {
    en: {
        "header.nodes": "nodes",
        "header.node": "node",
        "header.edges": "edges",
        "header.edge": "edge",
        "header.clear": "Clear",
        "header.openSource": "Open Source",

        "sidebar.title": "Graph",
        "sidebar.nodes": "Nodes",
        "sidebar.edges": "Edges",
        "sidebar.settings": "Settings",

        "nodeList.empty.title": "No nodes yet.",
        "nodeList.empty.hint": "Use the",
        "nodeList.empty.tool": "Add Node",
        "nodeList.empty.suffix": "tool and click on the board.",

        "edgeList.empty.title": "No edges yet.",
        "edgeList.empty.hint": "Use the",
        "edgeList.empty.tool": "Add Edge",
        "edgeList.empty.suffix": "tool and click two nodes.",

        "settings.graphType": "Graph Type",
        "settings.directed": "Directed",
        "settings.directedDesc": "Edges have direction",
        "settings.weighted": "Weighted",
        "settings.weightedDesc": "Edges have weight values",
        "settings.shortcuts": "Keyboard Shortcuts",
        "settings.selectTool": "Select tool",
        "settings.addNode": "Add node",
        "settings.addEdge": "Add edge",
        "settings.delete": "Delete",
        "settings.deleteSelected": "Delete selected",
        "settings.escape": "Escape",
        "settings.export": "Export",
        "settings.exportPdf": "Export as PDF",
        "settings.exportPdfDesc": "Download the current graph as a PDF file",

        "tool.select": "Select",
        "tool.addNode": "Add Node",
        "tool.addEdge": "Add Edge",
        "tool.delete": "Delete",

        "board.clickTarget": "Click a target node to create edge",
        "board.clickPlace": "Click anywhere to place a node",
        "board.panZoom": "Drag to pan · Scroll to zoom",
        "board.selected": "selected",
        "board.clickDelete": "Click a node or edge to delete",

        "sidebar.algorithms": "Algorithms",

        "algo.empty":
            "Add nodes and edges to the graph first, then run an algorithm.",
        "algo.select": "Algorithm",
        "algo.placeholder": "Select an algorithm…",
        "algo.sourceNode": "Source Node",
        "algo.run": "Run",
        "algo.clear": "Clear",
        "algo.result": "Result",
        "algo.distances": "Distances",
        "algo.requiresWeighted": "⚡ Weighted mode enabled automatically.",
        "algo.requiresDirected": "⚡ Directed mode enabled automatically.",
        "algo.requiresBoth":
            "⚡ Weighted and directed modes enabled automatically.",
        "algo.cat.traversal": "Traversal",
        "algo.cat.shortestPath": "Shortest Path",
        "algo.cat.mst": "Minimum Spanning Tree",
        "algo.cat.ordering": "Ordering",
        "algo.bfs": "BFS (Breadth-First)",
        "algo.dfs": "DFS (Depth-First)",
        "algo.dijkstra": "Dijkstra",
        "algo.bellmanFord": "Bellman-Ford",
        "algo.kruskal": "Kruskal (MST)",
        "algo.prim": "Prim (MST)",
        "algo.topologicalSort": "Topological Sort",
    },
    pt: {
        "header.nodes": "nós",
        "header.node": "nó",
        "header.edges": "arestas",
        "header.edge": "aresta",
        "header.clear": "Limpar",
        "header.openSource": "Código Aberto",

        "sidebar.title": "Grafo",
        "sidebar.nodes": "Nós",
        "sidebar.edges": "Arestas",
        "sidebar.settings": "Config",

        "nodeList.empty.title": "Nenhum nó ainda.",
        "nodeList.empty.hint": "Use a ferramenta",
        "nodeList.empty.tool": "Adicionar Nó",
        "nodeList.empty.suffix": "e clique no quadro.",

        "edgeList.empty.title": "Nenhuma aresta ainda.",
        "edgeList.empty.hint": "Use a ferramenta",
        "edgeList.empty.tool": "Adicionar Aresta",
        "edgeList.empty.suffix": "e clique em dois nós.",

        "settings.graphType": "Tipo de Grafo",
        "settings.directed": "Direcionado",
        "settings.directedDesc": "Arestas possuem direção",
        "settings.weighted": "Ponderado",
        "settings.weightedDesc": "Arestas possuem peso",
        "settings.shortcuts": "Atalhos de Teclado",
        "settings.selectTool": "Ferramenta de seleção",
        "settings.addNode": "Adicionar nó",
        "settings.addEdge": "Adicionar aresta",
        "settings.delete": "Excluir",
        "settings.deleteSelected": "Excluir selecionado",
        "settings.escape": "Cancelar",
        "settings.export": "Exportar",
        "settings.exportPdf": "Exportar como PDF",
        "settings.exportPdfDesc": "Baixe o grafo atual como arquivo PDF",

        "tool.select": "Selecionar",
        "tool.addNode": "Adicionar Nó",
        "tool.addEdge": "Adicionar Aresta",
        "tool.delete": "Excluir",

        "board.clickTarget": "Clique em um nó de destino para criar aresta",
        "board.clickPlace": "Clique em qualquer lugar para posicionar um nó",
        "board.panZoom": "Arraste para mover · Scroll para zoom",
        "board.selected": "selecionado(s)",
        "board.clickDelete": "Clique em um nó ou aresta para excluir",

        "sidebar.algorithms": "Algoritmos",

        "algo.empty":
            "Adicione nós e arestas ao grafo primeiro, depois execute um algoritmo.",
        "algo.select": "Algoritmo",
        "algo.placeholder": "Selecione um algoritmo…",
        "algo.sourceNode": "Nó de Origem",
        "algo.run": "Executar",
        "algo.clear": "Limpar",
        "algo.result": "Resultado",
        "algo.distances": "Distâncias",
        "algo.requiresWeighted": "⚡ Modo ponderado ativado automaticamente.",
        "algo.requiresDirected": "⚡ Modo direcionado ativado automaticamente.",
        "algo.requiresBoth":
            "⚡ Modos ponderado e direcionado ativados automaticamente.",
        "algo.cat.traversal": "Travessia",
        "algo.cat.shortestPath": "Caminho Mínimo",
        "algo.cat.mst": "Árvore Geradora Mínima",
        "algo.cat.ordering": "Ordenação",
        "algo.bfs": "BFS (Busca em Largura)",
        "algo.dfs": "DFS (Busca em Profundidade)",
        "algo.dijkstra": "Dijkstra",
        "algo.bellmanFord": "Bellman-Ford",
        "algo.kruskal": "Kruskal (AGM)",
        "algo.prim": "Prim (AGM)",
        "algo.topologicalSort": "Ordenação Topológica",
    },
};

export function t(key: string, lang: LanguageCode): string {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
