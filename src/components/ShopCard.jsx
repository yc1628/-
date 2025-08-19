export default function ShopCard({ id, name, area, rating, fav, onToggle, mapUrl }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div>
        {/* 店名超連結 */}
        <h3 style={{ margin: "0 0 4px 0" }}>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#000", textDecoration: "none" }}>
            {name}
          </a>
        </h3>
        <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
          地區：{area}　評分：{rating}
        </p>
      </div>

      <button
        onClick={() => onToggle(id)}
        style={{
          background: "none",
          border: "1px solid #ccc",
          borderRadius: 20,
          padding: "6px 12px",
          cursor: "pointer"
        }}
      >
        {fav ? "💜 已收藏" : "🤍 收藏"}
      </button>
    </div>
  );
}
