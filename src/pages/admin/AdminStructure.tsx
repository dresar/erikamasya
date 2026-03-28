import { Edit } from "lucide-react";
import org from "@/data/organization.json";

const AdminStructure = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Struktur Organisasi</h1>
        <p className="text-sm text-muted-foreground">Kelola struktur kepengurusan periode {org.period}</p>
      </div>

      <div className="space-y-3">
        {org.members.map((m) => (
          <div key={m.id} className="glass-card p-4 flex items-center gap-4">
            <img src={m.photo} alt={m.name} className="h-10 w-10 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground text-sm">{m.name}</h4>
              <p className="text-xs text-muted-foreground">{m.position} · {m.department}</p>
            </div>
            <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-colors">
              <Edit className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStructure;
