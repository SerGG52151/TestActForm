type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="search-bar">
      <span>Buscar por titulo</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="ej. sunt aut facere"
      />
    </label>
  );
}
