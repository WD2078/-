import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FileText, Users, AlertTriangle, Send, ChevronRight, BookOpen, Scale, ShieldCheck, Info } from 'lucide-react';
import { GameStage, Clue, Party } from './types';
import { CLUES, PARTIES, ETHICAL_PRINCIPLES } from './constants';
import { getNarrativeResponse } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [stage, setStage] = useState<GameStage>(GameStage.INTRO);
  const [foundClueIds, setFoundClueIds] = useState<string[]>([]);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEthicsPanel, setShowEthicsPanel] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStart = () => {
    setStage(GameStage.INVESTIGATION);
    setMessages([{
      role: 'assistant',
      content: '我是调查组组长。档案库已对你开放。在那个自建房倒塌现场，我们发现了一些极其矛盾的文件。你现在的任务是审查这些记录，并找出背后的伦理崩裂点。记住，工程伦理不是写在纸上的，是刻在被害者的血泪里的。请点击左侧面板查看初步线索。'
    }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const reply = await getNarrativeResponse(userMsg, foundClueIds);
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setIsLoading(false);
  };

  const findClue = (clueId: string) => {
    if (!foundClueIds.includes(clueId)) {
      setFoundClueIds(prev => [...prev, clueId]);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `你发现了新证据：[${CLUES.find(c => c.id === clueId)?.title}]。请务必结合“工程伦理准则”剖析其中的责任缺失。` 
      }]);
    }
    const clue = CLUES.find(c => c.id === clueId);
    if (clue) setSelectedClue(clue);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-crushing-red selection:text-white flex flex-col">
      <div className="fixed inset-0 pointer-events-none scanline opacity-10 z-50 overflow-hidden" />
      
      <AnimatePresence mode="wait">
        {stage === GameStage.INTRO && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center p-6 bg-zinc-950"
          >
            <div className="max-w-2xl text-center space-y-8">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-serif font-black tracking-tighter text-zinc-100"
              >
                灰烬下的<span className="text-crushing-red">谎言</span>
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-zinc-400 text-lg md:text-xl font-mono leading-relaxed"
              >
                — 工程伦理沉浸式调查 —
                <br />
                基于真实案例的灵魂拷问
              </motion.p>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-8"
              >
                <button 
                  onClick={handleStart}
                  className="px-8 py-4 bg-zinc-100 text-zinc-950 font-bold hover:bg-crushing-red hover:text-white transition-all duration-300 group"
                >
                  进入档案室
                  <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {stage === GameStage.INVESTIGATION && (
          <motion.div 
            key="investigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col lg:flex-row p-4 gap-4 h-screen max-h-screen overflow-hidden"
          >
            {/* Left Rail: Clues & Navigation */}
            <div className="w-full lg:w-80 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center">
                  <Search className="size-3 mr-2" /> 搜获证据库
                </h2>
                <div className="space-y-2">
                  {CLUES.map(clue => (
                    <button
                      key={clue.id}
                      onClick={() => findClue(clue.id)}
                      className={cn(
                        "w-full text-left p-3 rounded border transition-all duration-200 flex items-start gap-3",
                        foundClueIds.includes(clue.id) 
                          ? "bg-zinc-800 border-zinc-700 text-zinc-100" 
                          : "bg-zinc-950/50 border-zinc-900 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
                      )}
                    >
                      {clue.category === 'PHYSICAL' && <AlertTriangle className="size-4 shrink-0 mt-1" />}
                      {clue.category === 'DOCUMENT' && <FileText className="size-4 shrink-0 mt-1" />}
                      {clue.category === 'WITNESS' && <Users className="size-4 shrink-0 mt-1" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate">{clue.title}</div>
                        <div className="text-[10px] font-mono opacity-50 uppercase tracking-wider">{foundClueIds.includes(clue.id) ? '已归档' : '未解锁'}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <button 
                  onClick={() => setShowEthicsPanel(!showEthicsPanel)}
                  className="w-full py-2 px-3 bg-zinc-800 text-zinc-300 text-xs font-mono flex items-center justify-between hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2"><Scale className="size-3" /> 工程伦理准则库</span>
                  <Info className="size-3" />
                </button>
                {showEthicsPanel && (
                  <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {ETHICAL_PRINCIPLES.map(p => (
                      <div key={p.id} className="p-2 bg-zinc-950 rounded border border-zinc-800">
                        <div className="text-[10px] font-bold text-crushing-red uppercase mb-1">{p.title}</div>
                        <div className="text-[10px] text-zinc-500 leading-tight">{p.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <button 
                  onClick={() => setStage(GameStage.VERDICT)}
                  className="w-full py-3 bg-crushing-red text-white font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                >
                  发起伦理终审 <Scale className="size-4" />
                </button>
              </div>
            </div>

            {/* Middle: Document Viewer */}
            <div className="flex-1 overflow-hidden flex flex-col gap-4">
              <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-lg p-6 overflow-y-auto font-serif relative">
                <AnimatePresence mode="wait">
                  {selectedClue ? (
                    <motion.div
                      key={selectedClue.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-zinc-100">{selectedClue.title}</h3>
                        <span className="text-xs font-mono px-2 py-1 bg-zinc-800 text-zinc-400 uppercase">{selectedClue.category}</span>
                      </div>
                      <div className="h-px bg-gradient-to-r from-zinc-800 to-transparent" />
                      <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-crushing-red/20" />
                        <p className="text-zinc-300 leading-loose text-lg whitespace-pre-wrap italic pl-4">
                          {selectedClue.content}
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-crushing-red/5 border border-crushing-red/20 rounded">
                          <h4 className="text-xs font-mono uppercase text-crushing-red mb-2 font-bold flex items-center gap-2">
                             <AlertTriangle className="size-3" /> 伦理冲突点
                          </h4>
                          <p className="text-sm text-zinc-400">{selectedClue.ethicsViolation}</p>
                        </div>
                        <div className="p-4 bg-zinc-800/30 border border-zinc-700 rounded">
                          <h4 className="text-xs font-mono uppercase text-zinc-500 mb-2 font-bold">关联准则</h4>
                          <p className="text-sm text-zinc-500">{selectedClue.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-zinc-600 italic font-mono animate-pulse flex-col gap-4">
                      <BookOpen className="size-12 opacity-20" />
                      -- 请从左侧库里选择一份证据进行伦理审查 --
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom: Chat / AI Interaction */}
              <div className="h-48 lg:h-64 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm custom-scrollbar">
                  {messages.map((m, i) => (
                    <div key={i} className={cn("flex gap-3", m.role === 'user' ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[80%] p-3 rounded-lg",
                        m.role === 'user' ? "bg-zinc-800 text-zinc-100" : "bg-crushing-red/10 border border-crushing-red/20 text-zinc-200"
                      )}>
                        <div className="text-[10px] opacity-40 mb-1 uppercase font-black">{m.role === 'user' ? '调查官' : '专家顾问'}</div>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && <div className="text-zinc-600 animate-pulse text-xs">正在调取工程伦理专家库数据...</div>}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="分析伦理疑点，例如：第三方机构为何知假造假？"
                    className="flex-1 bg-transparent border-none outline-none text-zinc-100 text-sm placeholder:text-zinc-600 font-mono"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="p-2 text-zinc-400 hover:text-zinc-100 disabled:opacity-50 transition-colors"
                  >
                    <Send className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {stage === GameStage.VERDICT && (
          <motion.div 
            key="verdict"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center p-6 bg-zinc-950"
          >
            <div className="max-w-5xl w-full space-y-8 overflow-y-auto max-h-[90vh] pr-4 custom-scrollbar">
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-serif font-black text-white flex items-center justify-center gap-4">
                   <ShieldCheck className="text-crushing-red" /> 伦理责任判定 
                </h2>
                <p className="text-zinc-500 font-mono uppercase tracking-widest text-xs">不仅是法律的裁决，更是职业良知的审判</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {PARTIES.map(party => (
                  <div key={party.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg space-y-4 flex flex-col group hover:border-crushing-red/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-crushing-red/20 rounded">
                        <Users className="size-5 text-crushing-red" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{party.name}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-mono">{party.role}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs text-zinc-400 leading-relaxed">{party.description}</p>
                      <div className="p-3 bg-zinc-950/50 rounded border border-zinc-800 italic">
                        <h5 className="text-[10px] font-mono text-zinc-500 mb-1 uppercase tracking-tighter">深度伦理剖析</h5>
                        <p className="text-xs text-zinc-300 leading-relaxed">{party.ethicsAnalysis}</p>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-zinc-800">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-2 uppercase tracking-tighter">
                        <span>失范指数</span>
                        <span className="text-crushing-red">
                          {Array(party.faultLevel).fill('★').join('')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => setStage(GameStage.FINALE)}
                  className="px-12 py-4 bg-zinc-100 text-zinc-950 font-bold hover:bg-zinc-200 transition-all rounded shadow-xl flex items-center gap-2"
                >
                  签署结案档案，反思这场“人祸” <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === GameStage.FINALE && (
          <motion.div 
            key="finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center p-6 bg-zinc-950 overflow-y-auto"
          >
            <div className="max-w-3xl w-full bg-white text-zinc-950 p-8 md:p-16 shadow-2xl relative my-8">
              <div className="absolute top-0 left-0 w-full h-3 bg-crushing-red" />
              <div className="space-y-8">
                <div className="border-b-4 border-zinc-950 pb-4 flex justify-between items-end">
                  <h1 className="text-4xl font-serif font-black">伦理终审调查报告</h1>
                  <span className="font-mono text-xl">CASE NO. 2022-0429</span>
                </div>

                <div className="space-y-6 font-serif text-lg leading-loose">
                  <p className="font-bold text-xl text-crushing-red border-b border-zinc-200 pb-2 italic">
                    这不是一起简单的工程意外，而是一场职业道德的集体崩裂。
                  </p>
                  
                  <section className="space-y-4">
                    <h4 className="font-black text-sm uppercase font-mono tracking-tighter border-l-4 border-zinc-900 pl-2">深度透视：长沙“4·29”事故中的伦理多米诺</h4>
                    <p className="text-base text-zinc-700">
                      通过调查，我们可以观察到三个关键层面的伦理失守：
                    </p>
                    <div className="grid gap-4">
                      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded">
                        <span className="font-bold block mb-1">1. 个体伦理：风险与收益的极端不对称</span>
                        <p className="text-sm text-zinc-600">房主吴某获取了扩建带来的全部经济收益，却通过隐瞒结构裂缝，将致命风险转嫁给了完全不知情的学生和租客。这公然违背了<strong>公众知情同意</strong>和<strong>生命安全优先</strong>的基本原则。</p>
                      </div>
                      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded">
                        <span className="font-bold block mb-1">2. 职业伦理：诚信作为技术基石的坍塌</span>
                        <p className="text-sm text-zinc-600">湘大检测公司将具有法律和社会契约性质的签名权力“商品化”。在工程伦理中，数据真实是工程师的灵魂。一旦诚信被明码标价，技术便成了谋财害命的凶器。</p>
                      </div>
                      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded">
                        <span className="font-bold block mb-1">3. 行政伦理：公共职责的彻底懈怠</span>
                        <p className="text-sm text-zinc-600">监管者的“形式主义”是灾难链条的最后一环。当公权力仅满足于纸面上的“销号”，而忽略了真实世界的现场复核时，这种<strong>平庸之恶 (Banality of Evil)</strong> 最终助长了54条生命的陨落。</p>
                      </div>
                    </div>
                  </section>

                  <div className="bg-zinc-100 p-6 rounded-lg border-2 border-dashed border-zinc-300">
                    <h3 className="text-xl font-black mb-4">法治的回响：</h3>
                    <p className="text-base">
                      该事故最终造成<span className="text-crushing-red font-black">54人遇难</span>。2024年5月，法院作出一审判决：房主吴某被判处<span className="font-bold">12年刑期</span>；检测机构多名技术人员因提供虚假证明文件罪被判重刑。
                    </p>
                  </div>
                </div>

                <div className="pt-12 border-t-2 border-zinc-200 text-center">
                  <p className="text-zinc-400 font-mono text-sm italic">
                    “作为这个行业的初学者或从业者，请记住：那一叠叠冰冷的文件，如果失去了伦理的温度，就会变成压在废墟上的最后一块砖。”
                  </p>
                </div>

                <div className="flex justify-center pt-8">
                  <button 
                    onClick={() => setStage(GameStage.INTRO)}
                    className="px-6 py-2 border border-zinc-300 text-zinc-500 hover:text-zinc-900 hover:border-zinc-900 transition-all font-mono text-sm uppercase tracking-widest"
                  >
                   -- 重启调查，警钟长鸣 --
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

