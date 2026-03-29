import { Mail, Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const AdminMessages = () => {
  const [messages, setMessages] = useState<
    Array<{ id: number; name: string; email: string; subject: string; message: string; date: string; read: boolean }>
  >([]);

  useEffect(() => {
    fetch("/api/messages?page=1&pageSize=50")
      .then((r) => r.json())
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : payload?.data;
        if (!Array.isArray(list)) return;
        setMessages(
          list.map((m: unknown) => {
            const item = m as {
              id: number;
              name?: string;
              email?: string;
              subject?: string;
              message?: string;
              createdAt?: string | null;
              date?: string | null;
              isRead?: boolean | null;
              read?: boolean | null;
            };

            return {
              id: item.id,
              name: item.name ?? "",
              email: item.email ?? "",
              subject: item.subject ?? "",
              message: item.message ?? "",
              date: item.createdAt?.slice?.(0, 10) ?? item.date ?? "",
              read: item.isRead ?? item.read ?? false,
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Pesan Masuk</h1>
        <p className="text-sm text-muted-foreground">{messages.filter(m => !m.read).length} pesan belum dibaca</p>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`glass-card p-4 sm:p-5 flex items-start gap-4 ${!msg.read ? "border-l-2 border-l-primary" : ""}`}>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className={`h-4 w-4 ${!msg.read ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`text-sm truncate ${!msg.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>{msg.subject}</h4>
                {!msg.read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground">{msg.name} · {msg.email}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
              <p className="text-[10px] text-muted-foreground mt-2">{msg.date}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-colors">
                <Eye className="h-3.5 w-3.5" />
              </button>
              <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMessages;
