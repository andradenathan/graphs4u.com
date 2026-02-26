export const languages = [
    { code: "en", label: "English" },
    { code: "pt", label: "Português" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

const translations: Record<LanguageCode, Record<string, string>> = {
    en: {
        // Header
        "header.nodes": "nodes",
        "header.node": "node",
        "header.edges": "edges",
        "header.edge": "edge",
        "header.clear": "Clear",
        "header.openSource": "Open Source",

        // Sidebar
        "sidebar.title": "Graph",
        "sidebar.nodes": "Nodes",
        "sidebar.edges": "Edges",
        "sidebar.settings": "Settings",

        // Node list
        "nodeList.empty.title": "No nodes yet.",
        "nodeList.empty.hint": "Use the",
        "nodeList.empty.tool": "Add Node",
        "nodeList.empty.suffix": "tool and click on the board.",

        // Edge list
        "edgeList.empty.title": "No edges yet.",
        "edgeList.empty.hint": "Use the",
        "edgeList.empty.tool": "Add Edge",
        "edgeList.empty.suffix": "tool and click two nodes.",

        // Settings
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

        // Toolbar
        "tool.select": "Select",
        "tool.addNode": "Add Node",
        "tool.addEdge": "Add Edge",
        "tool.delete": "Delete",

        // Board status
        "board.clickTarget": "Click a target node to create edge",
        "board.clickPlace": "Click anywhere to place a node",
        "board.panZoom": "Drag to pan · Scroll to zoom",
        "board.selected": "selected",
        "board.clickDelete": "Click a node or edge to delete",
    },
    pt: {
        // Header
        "header.nodes": "nós",
        "header.node": "nó",
        "header.edges": "arestas",
        "header.edge": "aresta",
        "header.clear": "Limpar",
        "header.openSource": "Código Aberto",

        // Sidebar
        "sidebar.title": "Grafo",
        "sidebar.nodes": "Nós",
        "sidebar.edges": "Arestas",
        "sidebar.settings": "Config",

        // Node list
        "nodeList.empty.title": "Nenhum nó ainda.",
        "nodeList.empty.hint": "Use a ferramenta",
        "nodeList.empty.tool": "Adicionar Nó",
        "nodeList.empty.suffix": "e clique no quadro.",

        // Edge list
        "edgeList.empty.title": "Nenhuma aresta ainda.",
        "edgeList.empty.hint": "Use a ferramenta",
        "edgeList.empty.tool": "Adicionar Aresta",
        "edgeList.empty.suffix": "e clique em dois nós.",

        // Settings
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

        // Toolbar
        "tool.select": "Selecionar",
        "tool.addNode": "Adicionar Nó",
        "tool.addEdge": "Adicionar Aresta",
        "tool.delete": "Excluir",

        // Board status
        "board.clickTarget": "Clique em um nó de destino para criar aresta",
        "board.clickPlace": "Clique em qualquer lugar para posicionar um nó",
        "board.panZoom": "Arraste para mover · Scroll para zoom",
        "board.selected": "selecionado(s)",
        "board.clickDelete": "Clique em um nó ou aresta para excluir",
    },
};

export function t(key: string, lang: LanguageCode): string {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
