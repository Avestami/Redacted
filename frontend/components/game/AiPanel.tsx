import React from 'react';
import { Bot } from 'lucide-react';
import Card from '@/components/ui/Card';

const AiPanel: React.FC = () => {
    return (
        <Card title="Detective Max Payne (AI)" className="border-cyan-500/30 bg-cyan-950/10">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/20 animate-pulse">
                    <Bot className="h-8 w-8 text-cyan-400" />
                </div>
                <div className="flex-1 space-y-2">
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50 font-mono text-xs text-cyan-300">
                        <span className="text-cyan-600 mr-2">{'>'}</span>
                        Analyzing behavioral patterns... 
                        <span className="animate-pulse">_</span>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50 font-mono text-xs text-slate-300">
                         <span className="text-slate-600 mr-2">{'>'}</span>
                        System integrity check: STABLE. 
                        No immediate anomalies detected in sector 7.
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AiPanel;
