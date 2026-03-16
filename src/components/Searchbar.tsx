interface SearchbarProps {
  search: string;
  setSearch: (search: string) => void;
}
export default function Searchbar({ search, setSearch }: SearchbarProps) {
  return (
    <>
      {/* search */}
      <div className="relative mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute w-4 h-4 top-1/2 -translate-y-1/2 left-3.5 text-subtle"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
          />
        </svg>
        <input
          className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-text text-sm placeholder:text-muted focus:outline-none focus:border-purple transition-colors"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </>
  );
}
