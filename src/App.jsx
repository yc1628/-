import { useMemo, useState, useEffect } from "react";
import ShopCard from "./components/ShopCard";
import rawShops from "./data/shop.json";
import { getFavs, toggleFav, isFav } from "./utils/storage";

export default function App() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("rating-desc");
  const [favs, setFavs] = useState([]);
  const [onlyFavs, setOnlyFavs] = useState(false); // ← 新增：只看收藏

  useEffect(() => { setFavs(getFavs()); }, []);

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase();
    let data = rawShops.filter(s =>
      (!kw ||
        s.name.toLowerCase().includes(kw) ||
        s.area.toLowerCase().includes(kw))
      && (!onlyFavs || favs.includes(s.id)) // ← 新增：若只看收藏，就只留在 favs 內的
    );

    if (sort === "rating-desc") data.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "rating-asc")  data.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
    if (sort === "name-asc")    data.sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));
    return data;
  }, [q, sort, onlyFavs, favs]); // ← 記得把 onlyFavs, favs 加進依賴

  const avg = useMemo(() => {
    if (!list.length) return "—";
    const sum = list.reduce((s, x) => s + (x.rating ?? 0), 0);
    return (sum / list.length).toFixed(2);
  }, [list]);

  function handleToggleFav(id) {
    const next = toggleFav(id);
    setFavs(next);
  }

  return (
    <main style={{ padding: 24, background: "#fff", color: "#000" }}>
      <h1 style={{ marginTop: 0 }}>拉麵清單 🍜</h1>

      {/* 上方控制列 */}
      <div style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "center" }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="搜尋店名或地區（例：台北、拉麵）"
          style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc" }}
        />
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc" }}
        >
          <option value="rating-desc">評分：高 → 低</option>
          <option value="rating-asc">評分：低 → 高</option>
          <option value="name-asc">店名：A → Z</option>
        </select>
      </div>

      {/* 只看收藏 開關 */}
      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={onlyFavs}
          onChange={e => setOnlyFavs(e.target.checked)}
        />
        只看收藏（{favs.length}）
      </label>

      <p style={{ marginTop: 0, color: "#444" }}>
        共 {list.length} 家　|　平均評分：{avg}
      </p>

      {list.length === 0 && (
        <p>沒有符合的店家。{onlyFavs ? "你可以取消「只看收藏」或新增收藏。" : "換個關鍵字試試 👀"}</p>
      )}

      {list.map(s => (
        <ShopCard
          key={s.id}
          id={s.id}
          name={s.name}
          area={s.area}
          rating={s.rating}
          fav={isFav(s.id)}
          mapUrl={s.mapUrl}
          onToggle={handleToggleFav}
        />
      ))}
    </main>
  );
}
