import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchbarProps {
  search: string;
  setSearch: (search: string) => void;
}
export default function Searchbar({ search, setSearch }: SearchbarProps) {
  return (
    <div className="relative mb-10">
      <Search className="absolute size-4 top-1/2 -translate-y-1/2 left-3.5 text-subtle" />
      <Input
        className="w-full bg-card border-border rounded-xl pl-10 pr-4 py-2.5 h-auto text-text text-sm placeholder:text-muted-foreground focus-visible:border-purple focus-visible:ring-purple/30"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
