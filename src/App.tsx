import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/sidebar/sidebar";
import { GraphBoard } from "@/components/board/graph-board";
import { GraphProvider } from "@/contexts/graph-context";
import { I18nProvider } from "@/contexts/i18n-context";

export function App() {
    return (
        <I18nProvider>
            <GraphProvider>
                <div className="flex h-dvh flex-col overflow-hidden bg-surface text-foreground">
                    <Header />
                    <div className="flex flex-1 overflow-hidden">
                        <Sidebar />
                        <GraphBoard />
                    </div>
                </div>
            </GraphProvider>
        </I18nProvider>
    );
}
