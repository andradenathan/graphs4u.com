import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/sidebar/sidebar";
import { GraphBoard } from "@/components/board/graph-board";
import { GraphProvider } from "@/contexts/graph-context";
import { I18nProvider } from "@/contexts/i18n-context";

export function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <I18nProvider>
            <GraphProvider>
                <div className="flex h-dvh flex-col overflow-hidden bg-surface text-foreground">
                    <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
                    <div className="flex flex-1 overflow-hidden">
                        {/* Desktop sidebar */}
                        <div className="hidden md:block">
                            <Sidebar onClose={() => setSidebarOpen(false)} />
                        </div>

                        {/* Mobile sidebar overlay */}
                        {sidebarOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                                    onClick={() => setSidebarOpen(false)}
                                />
                                <div className="fixed inset-y-12 left-0 z-40 w-80 md:hidden">
                                    <Sidebar onClose={() => setSidebarOpen(false)} />
                                </div>
                            </>
                        )}

                        <GraphBoard />
                    </div>
                </div>
            </GraphProvider>
        </I18nProvider>
    );
}
