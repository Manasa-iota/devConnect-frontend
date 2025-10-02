type BubbleProps = {
  mine: boolean;
  text: string;
  time: string;
  avatar?: string | null;
  name?: string | null;
};

export default function MessageBubble({ mine, text, time, avatar, name }: BubbleProps) {
  return (
    <div className={`w-full flex ${mine ? "justify-end" : "justify-start"} px-1`}>
      <div className={`flex items-end gap-2 max-w-full ${mine ? "flex-row-reverse" : "flex-row"}`}>
        {!mine && (
          avatar ? (
            <img src={avatar} alt="" className="h-7 w-7 rounded-lg border border-white/10 object-cover" />
          ) : (
            <div className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 object-cover" />
          )
        )}
        <div className={`group ${mine ? "items-end text-right" : "items-start text-left"} flex flex-col`}>
          {!mine && name ? <div className="text-[10px] text-white/50 mb-1">{name}</div> : null}
          <div
            className={[
              "rounded-2xl border px-3 py-2 shadow-sm",
              "break-words whitespace-pre-wrap",
              "[overflow-wrap:anywhere]",
              "min-w-[40%] max-w-[85%] sm:max-w-[70%] lg:max-w-[60%]",
              mine ? "bg-brand-primary text-blue-900 border-transparent" : "bg-surface-200 text-white border-white/10"
            ].join(" ")}
          >
            {text}
          </div>
          <div className="text-[10px] text-white/40 mt-1">{time}</div>
        </div>
      </div>
    </div>
  );
}
