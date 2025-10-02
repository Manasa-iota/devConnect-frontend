import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useDevConnectStore } from "../store/useDevConnectStore";
import { useAuthStore } from "../store/useAuthStore";
import { Card, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import MessageBubble from "../components/chat/MessageBubble"


export default function Messages() {
  const { peerId } = useParams<{ peerId?: string }>();
  const {
    conversations,
    messages,
    activeId,
    typing,
    init,
    loadConversations,
    openConversation,
    openByPeer,
    sendMessage,
    setActive,
    markTyping,
  } = useChatStore();
  const { connections, loadAll } = useDevConnectStore();
  const me = useAuthStore((s) => s.user?.id || "");
  const [text, setText] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    init();
    void loadConversations();
    void loadAll();
  }, []);

  useEffect(() => {
    if (peerId) void openByPeer(peerId);
  }, [peerId]);

  useEffect(() => {
    if (!activeId) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [activeId, messages[activeId]?.length]);

  const activeMsgs = useMemo(() => (activeId ? messages[activeId] || [] : []), [messages, activeId]);
  const activePeer = useMemo(() => {
    if (!activeId) return null;
    const c = conversations.find((x) => x.id === activeId);
    return c?.participants.find((p) => p.id !== me) || null;
  }, [conversations, activeId, me]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardBody className="flex flex-col h-[70vh] sm:h-[75vh] lg:h-[78vh]">

          <div className="flex items-center justify-between mb-3">
            <div className="text-white/70 text-sm">Conversations</div>
            <Button size="sm" variant="ghost" onClick={() => setShowNew((v) => !v)}>
              New
            </Button>
          </div>

          {showNew && (
            <div className="mb-3 p-3 border border-white/10 rounded-xl space-y-2">
              <div className="text-white/70 text-sm">Choose connection</div>
              <select
                value={selectedPeer}
                onChange={(e) => setSelectedPeer(e.target.value)}
                className="w-full rounded-xl bg-surface-200 text-white px-3 py-2 border border-white/10 outline-none"
              >
                <option value="">Select</option>
                {connections.map((c) => (
                  <option key={c.peer.id} value={c.peer.id}>
                    {c.peer.name}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                variant="primary"
                onClick={async () => {
                  if (!selectedPeer) return;
                  await openByPeer(selectedPeer);
                  setShowNew(false);
                }}
              >
                Start
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {conversations.map((c) => {
              const peer = c.participants.find((p) => p.id !== me) || c.participants[0];
              const active = activeId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActive(c.id);
                    void openConversation(c.id);
                  }}
                  className={`w-full text-left rounded-xl px-3 py-2 transition ${active ? "bg-white/10" : "hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-3">
                    {peer?.avatar ? (
                      <img src={peer.avatar} className="h-10 w-10 rounded-xl border border-white/10 object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{peer?.name}</div>
                        {c.unread > 0 && (
                          <span className="text-xs bg-brand-primary text-black px-2 py-0.5 rounded">{c.unread}</span>
                        )}
                      </div>
                      <div className="text-white/50 text-xs line-clamp-1">{c.lastMessage || "Start chatting"}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card className="md:col-span-2">
        <CardBody className="flex flex-col h-[70vh] sm:h-[75vh] lg:h-[78vh]">

          {activeId ? (
            <>
              <div className="pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-3">
                  {activePeer?.avatar ? (
                    <img src={activePeer.avatar} className="h-8 w-8 rounded-lg border border-white/10 object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/5" />
                  )}
                  <div className="font-medium">{activePeer?.name ?? "Chat"}</div>
                </div>
              </div>

              {/* <div ref={listRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
                {activeMsgs.map((m) => {
                  const mine = m.from === me || m.from === "me";
                  return (
                    <div key={m.id} className={`max-w-[80%] ${mine ? "ml-auto" : ""}`}>
                      <div
                        className={`px-3 py-2 rounded-2xl border ${
                          mine ? "bg-brand-primary text-blue-800 border-transparent" : "bg-surface-200 text-white border-white/10"
                        }`}
                      >
                        {m.text}
                      </div>
                      <div className="text-[10px] text-white/40 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>
                    </div>
                  );
                })}
                {typing[activeId] && <div className="text-white/50 text-xs">Typing…</div>}
              </div> */}

                <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 pr-1 scrollbar-hide">
  {activeMsgs.map((m) => {
    const mine = m.from === me || m.from === "me";
    const peer = activePeer;
    return (
      <MessageBubble
        key={m.id}
        mine={mine}
        text={m.text}
        time={new Date(m.createdAt).toLocaleTimeString()}
        avatar={!mine ? peer?.avatar || null : undefined}
        name={!mine ? peer?.name || null : undefined}
      />
    );
  })}
  {typing[activeId] && <div className="text-white/50 text-xs px-2">Typing…</div>}
</div>


              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!text.trim() || !activePeer) return;
                  void sendMessage(activeId, activePeer.id, text.trim());
                  setText("");
                }}
                className="sticky bottom-0 mt-3 bg-transparent flex gap-2"
              >
      
                <input
                  className="flex-1 rounded-xl bg-surface-200 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-primary/60 border border-white/10"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!text.trim() || !activePeer) return;
                      void sendMessage(activeId, activePeer.id, text.trim());
                      setText("");
                    }
                  }}
                  onFocus={() => activePeer && markTyping(activeId, activePeer.id, true)}
                  onBlur={() => activePeer && markTyping(activeId, activePeer.id, false)}
                  placeholder={`Message ${activePeer?.name ?? ""}`}
                />
                <Button type="submit" disabled={!text.trim()}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="h-full grid place-items-center text-white/60">
              <div className="space-y-3 text-center">
                <div>No conversation selected</div>
                <Button onClick={() => setShowNew(true)}>Start a new chat</Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
