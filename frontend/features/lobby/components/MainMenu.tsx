import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Users, Globe, ArrowLeft, RefreshCw, Terminal } from "lucide-react";
import Button from "@/features/ui/components/Button";
import Card from "@/features/ui/components/Card";
import { cn } from "@/lib/utils";

interface MainMenuProps {
  onCreateGame: () => void;
  onJoinGame: (code: string) => void;
  activeGames: any[];
  onRefreshGames: () => void;
  userId: string;
  loading?: boolean;
}

export default function MainMenu({
  onCreateGame,
  onJoinGame,
  activeGames,
  onRefreshGames,
  userId,
  loading,
}: MainMenuProps) {
  const [view, setView] = useState<"main" | "join" | "create">("main");
  const [roomCode, setRoomCode] = useState("");

  return (
    <div className="w-full max-w-md pointer-events-auto">
      <AnimatePresence mode="wait">
        {view === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col gap-4"
          >
            <Card className="border-l-4 border-l-primary bg-black/90">
              <div className="space-y-2">
                <div className="text-xs text-primary/70 font-mono mb-2">OPERATIVE ID: {userId}</div>
                <h2 className="text-3xl font-black italic text-white tracking-tighter">MISSION SELECT</h2>
                <p className="text-sm text-gray-400 font-mono">Select protocol to initiate.</p>
              </div>
            </Card>
            <div className="grid gap-4">
              <Button size="lg" onClick={() => setView("create")} className="w-full justify-between group">
                <span>INITIATE OPERATION</span>
                <Play className="w-5 h-5 group-hover:text-black transition-colors" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setView("join")} className="w-full justify-between group">
                <span>JOIN NETWORK</span>
                <Globe className="w-5 h-5 group-hover:text-primary transition-colors" />
              </Button>
            </div>
            <div className="bg-black/60 p-4 rounded border border-white/5 backdrop-blur-sm">
              <div className="flex justify-between items-center text-xs text-gray-500 font-mono mb-2">
                <span>LIVE SIGNALS ({activeGames.length})</span>
                <RefreshCw className={cn("w-3 h-3 cursor-pointer hover:text-white", loading && "animate-spin")} onClick={onRefreshGames} />
              </div>
              <div className="space-y-1 max-h-[100px] overflow-y-auto custom-scrollbar">
                {activeGames.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => onJoinGame(g.roomCode)}
                    className="flex justify-between items-center p-2 hover:bg-white/10 rounded cursor-pointer group transition-colors"
                  >
                    <span className="text-primary font-mono text-xs group-hover:text-white">{g.roomCode}</span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Users className="w-3 h-3" />
                      {g.players?.length}/8
                    </div>
                  </div>
                ))}
                {activeGames.length === 0 && (
                  <div className="text-[10px] text-gray-600 italic text-center py-2">No active signals detected.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        {view === "create" && (
          <motion.div key="create" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Card title="CONFIRM PROTOCOL">
              <div className="space-y-6">
                <p className="text-sm text-gray-300 font-mono leading-relaxed">
                  WARNING: You are about to establish a new secure room. This action will be logged on the network.
                </p>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded">
                  <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase mb-1">
                    <Terminal className="w-4 h-4" />
                    System Check
                  </div>
                  <div className="text-xs text-primary/70 font-mono">
                    &gt; Sector 7 clearance... OK
                    <br />
                    &gt; Encryption key... GENERATED
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button size="lg" onClick={onCreateGame} className="w-full">
                    EXECUTE
                  </Button>
                  <Button variant="ghost" onClick={() => setView("main")} className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" /> ABORT
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
        {view === "join" && (
          <motion.div key="join" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Card title="FREQUENCY INPUT">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Room Access Code</label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="X-X-X-X"
                    className="w-full bg-black/50 border-2 border-white/10 focus:border-primary rounded p-4 text-2xl font-black text-center text-white tracking-[0.5em] placeholder:tracking-normal placeholder:text-gray-700 outline-none transition-all"
                    maxLength={6}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button size="lg" onClick={() => onJoinGame(roomCode)} disabled={!roomCode} className="w-full">
                    CONNECT
                  </Button>
                  <Button variant="ghost" onClick={() => setView("main")} className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" /> RETURN
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

